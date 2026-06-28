import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

model = joblib.load("ethical_discount_model_v1.joblib")


class TicketRequest(BaseModel):
    distance_miles: float
    loyalty_index: int
    attendance_rate: float
    scarcity: float


@app.post("/predict")
def predict(req: TicketRequest):
    input_df = pd.DataFrame([{
        "Distance_Miles": req.distance_miles,
        "Loyalty_Index": req.loyalty_index,
        "Attendance_Rate": req.attendance_rate,
        "Scarcity": req.scarcity,
    }])

    raw = model.predict(input_df)[0]
    final = raw
    audit_notes = []

    if req.attendance_rate < 0.40:
        final = 0.0
        audit_notes.append("OVERRIDE: Terminated via Absolute Attendance Floor (<40%).")
    elif req.attendance_rate < 0.60 and req.loyalty_index > 2:
        final = 0.0
        audit_notes.append("OVERRIDE: Terminated via High-Volume Scalper Pattern.")

    if final != 0.0:
        if raw > 0.50:
            final = 0.50
            audit_notes.append(f"CLIP: Raw prediction ({raw:.4f}) exceeded cap. Set to 0.50.")
        elif raw < 0.0:
            final = 0.0
            audit_notes.append(f"CLIP: Raw prediction ({raw:.4f}) fell below zero. Set to 0.00.")
        else:
            audit_notes.append("PASS: Clean calculation within normal operational parameters.")

    return {
        "raw_model_output": round(float(raw), 4),
        "final_discount": round(float(final), 4),
        "audit_trail": " | ".join(audit_notes) if audit_notes else "PASS",
    }
