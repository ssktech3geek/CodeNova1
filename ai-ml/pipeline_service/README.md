# CodeNova ML Pipeline

This service implements the prototype recommendation and itinerary pipeline:

1. LightGBM LambdaRank learns activity suitability from grouped traveler interactions.
2. Content-based scoring is used when historical data is too small or LightGBM is unavailable.
3. OR-Tools CP-SAT selects a feasible activity set under budget, opening-hours, duration, and travel-buffer constraints.
4. Excluded activities are removed and locked activities are preserved for disruption replanning.

## Run locally

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r ai-ml/pipeline_service/requirements.txt
python ai-ml/pipeline_service/generate_synthetic_data.py
uvicorn main:app --app-dir ai-ml/pipeline_service --port 8000
```

## Run with Docker Compose

```powershell
docker compose up -d --build ml-pipeline
```

The service is exposed on `http://localhost:8000` and reports readiness at `GET /health`.

The backend calls `POST /pipeline/optimize` through `ML_SERVICE_URL` (default `http://localhost:8000`).
When the service is unavailable, the backend uses the same preference features with a deterministic TypeScript fallback.