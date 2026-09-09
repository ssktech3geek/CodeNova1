from __future__ import annotations

import random
import uuid

import numpy as np
import pandas as pd


random.seed(42)
np.random.seed(42)

PERSONAS = {
    "budget_adventure": (["hiking", "extreme", "nature"], 0.6, 0.9, 4),
    "luxury_leisure": (["luxury", "dining", "spa"], 2.5, 0.1, 1),
    "family_convenience": (["family", "theme_park", "sightseeing"], 1.1, 0.5, 3),
    "culture_enthusiast": (["museum", "history", "art", "culture"], 1.0, 0.4, 2),
    "nature_focused": (["nature", "wildlife", "outdoors"], 0.9, 0.6, 3),
}

ACTIVITIES = [
    ("ACT_01", "Alpine Peak Hike", "hiking", 45, 240, 4),
    ("ACT_02", "5-Star Roof Dining", "dining", 220, 120, 1),
    ("ACT_03", "National Museum Tour", "museum", 25, 180, 1),
    ("ACT_04", "Wildlife Safari Trek", "wildlife", 110, 300, 3),
    ("ACT_05", "City Theme Park Pass", "family", 85, 360, 3),
    ("ACT_06", "Historic Art Gallery", "art", 30, 90, 1),
    ("ACT_07", "Extreme Bungee Jump", "extreme", 150, 60, 5),
    ("ACT_08", "Thermal Spa Day Pass", "spa", 180, 180, 1),
]


def main() -> None:
    users = []
    for index in range(1, 401):
        persona = random.choice(list(PERSONAS))
        tags, budget_multiplier, price_sensitivity, adventure_level = PERSONAS[persona]
        users.append({
            "user_id": f"USR_{index:04d}",
            "persona": persona,
            "interests": tags,
            "user_budget": round(max(40, np.random.normal(120, 30) * budget_multiplier), 2),
            "pace": random.choice(["SLOW", "MODERATE", "FAST"]),
            "adventure_level": adventure_level,
            "party_size": random.randint(3, 6) if persona == "family_convenience" else random.randint(1, 5),
            "price_sensitivity": price_sensitivity,
        })

    interactions = []
    for user in users:
        for _ in range(random.randint(20, 30)):
            activity = random.choice(ACTIVITIES)
            _, _, tag, cost, duration, intensity = activity
            tag_match = tag in user["interests"]
            price_ratio = cost / user["user_budget"]
            utility = (1.5 if tag_match else 0.2) - price_ratio * user["price_sensitivity"]
            utility += 0.35 if abs(user["adventure_level"] - intensity) <= 1 else 0
            utility += np.random.normal(0, 0.3)
            action = "booked" if utility > 0.8 else "favorited" if utility > 0.3 else "skipped" if utility > -0.2 else "rejected"
            interactions.append({
                "interaction_id": str(uuid.uuid4()),
                "user_id": user["user_id"],
                "activity_id": activity[0],
                "user_budget": user["user_budget"],
                "interests": user["interests"],
                "pace": user["pace"],
                "adventure_level": user["adventure_level"],
                "party_size": user["party_size"],
                "act_tag": tag,
                "act_cost": cost,
                "act_duration_min": duration,
                "act_intensity": intensity,
                "action": action,
            })

    pd.DataFrame(users).drop(columns=["price_sensitivity"]).to_json("synthetic_travelers.jsonl", orient="records", lines=True)
    pd.DataFrame(interactions).to_json("synthetic_interactions.jsonl", orient="records", lines=True)
    print(f"Generated {len(users)} users and {len(interactions)} interactions.")


if __name__ == "__main__":
    main()