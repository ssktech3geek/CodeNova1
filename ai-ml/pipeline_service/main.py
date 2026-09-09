from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, model_validator


FEATURES = [
    "act_cost",
    "act_duration_min",
    "act_intensity",
    "user_budget",
    "cost_to_budget_ratio",
    "tag_match",
    "pace_match",
    "adventure_match",
    "party_size",
]
MODEL_PATH = Path(os.getenv(
    "LIGHTGBM_MODEL_PATH",
    str(Path(__file__).resolve().parent / "artifacts" / "lightgbm_ranker.joblib"),
))
trained_ranker: Any = None


class Traveler(BaseModel):
    budget: float = Field(gt=0)
    interests: list[str] = []
    pace: str = "MODERATE"
    adventure_level: int = Field(default=3, ge=1, le=5)
    travelers_count: int = Field(default=1, ge=1)


class Activity(BaseModel):
    id: str
    name: str
    tag: str
    cost: float = Field(ge=0)
    duration_min: int = Field(gt=0)
    intensity: int = Field(ge=1, le=5)
    open_min: int = Field(default=480, ge=0, le=1440)
    close_min: int = Field(default=1440, ge=0, le=1440)
    available: bool = True

    @model_validator(mode="after")
    def validate_opening_window(self) -> "Activity":
        if self.close_min <= self.open_min:
            raise ValueError("close_min must be greater than open_min")
        return self


class HistoricalInteraction(BaseModel):
    user_id: str
    activity_id: str
    user_budget: float = Field(gt=0)
    interests: list[str] = []
    pace: str = "MODERATE"
    adventure_level: int = Field(default=3, ge=1, le=5)
    party_size: int = Field(default=1, ge=1)
    act_tag: str
    act_cost: float = Field(ge=0)
    act_duration_min: int = Field(gt=0)
    act_intensity: int = Field(ge=1, le=5)
    action: str


class PipelineRequest(BaseModel):
    traveler: Traveler
    activities: list[Activity] = Field(min_length=1)
    historical_interactions: list[HistoricalInteraction] = []
    max_budget: float = Field(gt=0)
    travel_time_gap: int = Field(default=30, ge=0, le=240)
    excluded_activity_ids: list[str] = []
    locked_activity_ids: list[str] = []

    @model_validator(mode="after")
    def validate_activity_constraints(self) -> "PipelineRequest":
        excluded = set(self.excluded_activity_ids)
        locked = set(self.locked_activity_ids)
        overlap = excluded & locked
        if overlap:
            raise ValueError(f"Activities cannot be both locked and excluded: {sorted(overlap)}")

        activity_ids = {activity.id for activity in self.activities}
        missing_locked = locked - activity_ids
        if missing_locked:
            raise ValueError(f"Locked activities are missing from activities: {sorted(missing_locked)}")
        return self


def _pace_match(pace: str, intensity: int) -> int:
    target = {"SLOW": 1, "RELAXED": 1, "MODERATE": 3, "BALANCED": 3, "FAST": 5, "INTENSE": 5}.get(pace.upper(), 3)
    return int(abs(target - intensity) <= 1)


def _feature_rows(records: list[dict[str, Any]]) -> pd.DataFrame:
    rows = []
    for record in records:
        interests = {str(value).lower() for value in record.get("interests", [])}
        tag = str(record["act_tag"]).lower()
        budget = float(record["user_budget"])
        intensity = int(record["act_intensity"])
        rows.append({
            "act_cost": float(record["act_cost"]),
            "act_duration_min": int(record["act_duration_min"]),
            "act_intensity": intensity,
            "user_budget": budget,
            "cost_to_budget_ratio": float(record["act_cost"]) / max(budget, 1e-6),
            "tag_match": int(tag in interests),
            "pace_match": _pace_match(str(record.get("pace", "MODERATE")), intensity),
            "adventure_match": int(abs(int(record.get("adventure_level", 3)) - intensity) <= 1),
            "party_size": int(record.get("party_size", 1)),
        })
    return pd.DataFrame(rows, columns=FEATURES)


def _fallback_scores(activities: list[Activity], traveler: Traveler) -> np.ndarray:
    rows = _feature_rows([
        {
            "act_tag": activity.tag,
            "act_cost": activity.cost,
            "act_duration_min": activity.duration_min,
            "act_intensity": activity.intensity,
            "user_budget": traveler.budget,
            "interests": traveler.interests,
            "pace": traveler.pace,
            "adventure_level": traveler.adventure_level,
            "party_size": traveler.travelers_count,
        }
        for activity in activities
    ])
    return (
        rows["tag_match"] * 0.45
        + rows["pace_match"] * 0.15
        + rows["adventure_match"] * 0.15
        + (1 / (1 + rows["cost_to_budget_ratio"])) * 0.25
    ).to_numpy()


def _candidate_features(request: PipelineRequest) -> pd.DataFrame:
    return _feature_rows([
        {
            "act_tag": item.tag,
            "act_cost": item.cost,
            "act_duration_min": item.duration_min,
            "act_intensity": item.intensity,
            "user_budget": request.traveler.budget,
            "interests": request.traveler.interests,
            "pace": request.traveler.pace,
            "adventure_level": request.traveler.adventure_level,
            "party_size": request.traveler.travelers_count,
        }
        for item in request.activities
    ])[FEATURES]


def _load_ranker() -> Any:
    global trained_ranker
    if trained_ranker is not None or not MODEL_PATH.exists():
        return trained_ranker
    try:
        trained_ranker = joblib.load(MODEL_PATH)
    except Exception:
        trained_ranker = None
    return trained_ranker


def _rank_scores(request: PipelineRequest) -> tuple[np.ndarray, str]:
    global trained_ranker
    if len(request.historical_interactions) < 20:
        ranker = _load_ranker()
        if ranker is not None:
            try:
                return ranker.predict(_candidate_features(request)), "lightgbm_lambdarank"
            except Exception:
                pass
        return _fallback_scores(request.activities, request.traveler), "content_based_fallback"

    try:
        import lightgbm as lgb
    except ImportError:
        return _fallback_scores(request.activities, request.traveler), "content_based_fallback"

    records = [item.model_dump() for item in request.historical_interactions]
    training = _feature_rows(records)
    labels = np.array([
        int(item.action in {"booked", "favorited"})
        for item in request.historical_interactions
    ])
    grouped = pd.DataFrame({"user_id": [item.user_id for item in request.historical_interactions]})
    order = grouped["user_id"].sort_values(kind="stable").index
    training = training.iloc[order]
    labels = labels[order]
    groups = grouped.iloc[order].groupby("user_id", sort=False).size().to_numpy()

    if len(np.unique(labels)) < 2 or len(groups) < 2:
        return _fallback_scores(request.activities, request.traveler), "content_based_fallback"

    ranker = lgb.LGBMRanker(
        objective="lambdarank",
        metric="ndcg",
        n_estimators=80,
        learning_rate=0.05,
        num_leaves=15,
        verbosity=-1,
        random_state=42,
    )
    try:
        ranker.fit(training[FEATURES], labels, group=groups)
        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(ranker, MODEL_PATH)
        trained_ranker = ranker
    except Exception:
        return _fallback_scores(request.activities, request.traveler), "content_based_fallback"
    return ranker.predict(_candidate_features(request)), "lightgbm_lambdarank"


def _optimize(request: PipelineRequest, scores: np.ndarray) -> list[dict[str, Any]]:
    from ortools.sat.python import cp_model

    activities = [
        activity for activity in request.activities
        if activity.available and activity.id not in set(request.excluded_activity_ids)
    ]
    score_by_id = {activity.id: float(score) for activity, score in zip(request.activities, scores)}
    model = cp_model.CpModel()
    selected = {item.id: model.NewBoolVar(f"selected_{index}") for index, item in enumerate(activities)}
    starts = {item.id: model.NewIntVar(0, 1440, f"start_{index}") for index, item in enumerate(activities)}
    ends = {item.id: model.NewIntVar(0, 1440, f"end_{index}") for index, item in enumerate(activities)}

    if activities:
        model.Add(sum(selected.values()) >= 1)
    model.Add(sum(selected[item.id] * int(round(item.cost)) for item in activities) <= int(round(request.max_budget)))
    locked = set(request.locked_activity_ids)
    for item in activities:
        model.Add(starts[item.id] >= item.open_min).OnlyEnforceIf(selected[item.id])
        model.Add(ends[item.id] == starts[item.id] + item.duration_min).OnlyEnforceIf(selected[item.id])
        model.Add(ends[item.id] <= item.close_min).OnlyEnforceIf(selected[item.id])
        if item.id in locked:
            model.Add(selected[item.id] == 1)

    for index, left in enumerate(activities):
        for right in activities[index + 1:]:
            left_before = model.NewBoolVar(f"{left.id}_before_{right.id}")
            right_before = model.NewBoolVar(f"{right.id}_before_{left.id}")
            model.Add(ends[left.id] + request.travel_time_gap <= starts[right.id]).OnlyEnforceIf(left_before)
            model.Add(ends[right.id] + request.travel_time_gap <= starts[left.id]).OnlyEnforceIf(right_before)
            model.AddBoolOr([left_before, right_before]).OnlyEnforceIf([selected[left.id], selected[right.id]])

    model.Maximize(sum(selected[item.id] * int(round(max(0, score_by_id[item.id]) * 1000)) for item in activities))
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 5
    status = solver.Solve(model)
    if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        raise HTTPException(status_code=422, detail="No feasible itinerary satisfies the supplied constraints.")

    return [
        {
            "id": item.id,
            "name": item.name,
            "cost": item.cost,
            "suitability_score": round(score_by_id[item.id] * 100, 2),
            "start_min": solver.Value(starts[item.id]),
            "end_min": solver.Value(ends[item.id]),
        }
        for item in activities
        if solver.Value(selected[item.id])
    ]


app = FastAPI(title="CodeNova ML Pipeline", version="1.0.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "healthy"}


@app.post("/pipeline/optimize")
def optimize_pipeline(request: PipelineRequest) -> dict[str, Any]:
    scores, model = _rank_scores(request)
    recommendations = [
        {"id": activity.id, "name": activity.name, "score": round(float(score) * 100, 2)}
        for activity, score in sorted(zip(request.activities, scores), key=lambda pair: pair[1], reverse=True)
        if activity.available and activity.id not in set(request.excluded_activity_ids)
    ]
    return {
        "recommendations": recommendations,
        "itinerary": _optimize(request, scores),
        "model": model,
        "optimizer": "ortools_cp_sat",
    }