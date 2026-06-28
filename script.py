import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import matplotlib.pyplot as plt
import joblib

# ==========================================
# PHASE 1: Orthogonal Data Engine
# ==========================================
np.random.seed(42)
N_SAMPLES = 10000

distance_miles = np.clip(np.random.lognormal(mean=2.0, sigma=1.0, size=N_SAMPLES), 0.5, 500)
loyalty_index = np.random.poisson(lam=3, size=N_SAMPLES)
attendance_rate = np.random.beta(a=8, b=2, size=N_SAMPLES)
scarcity = np.random.uniform(0.0, 1.0, size=N_SAMPLES)

df = pd.DataFrame({
    'Distance_Miles': distance_miles,
    'Loyalty_Index': loyalty_index,
    'Attendance_Rate': attendance_rate,
    'Scarcity': scarcity
})

# ==========================================
# PHASE 2: Ground Truth Training Generation
# ==========================================
def calculate_raw_base(row):
    score = 0.0
    if row['Distance_Miles'] <= 15:
        score += 0.30
    elif row['Distance_Miles'] <= 50:
        score += 0.15
        
    score += min(row['Loyalty_Index'] * 0.05, 0.20)
    score -= (row['Scarcity'] * 0.10)
    return score

df['Raw_Base'] = df.apply(calculate_raw_base, axis=1)
df['Noisy_Base'] = df['Raw_Base'] + np.random.normal(0, 0.02, N_SAMPLES)

def apply_training_guardrails(row):
    if row['Attendance_Rate'] < 0.40:
        return 0.0
    elif row['Attendance_Rate'] < 0.60 and row['Loyalty_Index'] > 2:
        return 0.0
    return np.clip(row['Noisy_Base'], 0.0, 0.50)

df['Discount_Score'] = df.apply(apply_training_guardrails, axis=1)

# Save the complete dataset to a CSV file in your project folder
df.to_csv('ethical_ticketing_synthetic_data.csv', index=False)
print("Dataset saved to: ethical_ticketing_synthetic_data.csv")

# ==========================================
# PHASE 3: Optimized Machine Learning Model
# ==========================================
X = df[['Distance_Miles', 'Loyalty_Index', 'Attendance_Rate', 'Scarcity']]
y = df['Discount_Score']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Fixed: Restricted max_depth=3 to ensure stability and robust generalization
model = GradientBoostingRegressor(n_estimators=100, max_depth=3, random_state=42)
model.fit(X_train, y_train)

# Save the trained model to a file
model_filename = 'ethical_discount_model_v1.joblib'
joblib.dump(model, model_filename)
print(f"Trained model saved permanently as: {model_filename}")

# ==========================================
# PHASE 4: Live Per-Prediction Audit Engine
# ==========================================
def predict_with_audit_trail(model_instance, distance, loyalty, attendance, live_scarcity):
    """
    Computes a customer's discount using the ML model, applies business rule layers,
    and returns a comprehensive operational audit path.
    """
    # 1. Construct input vector
    input_data = pd.DataFrame([{
        'Distance_Miles': distance,
        'Loyalty_Index': loyalty,
        'Attendance_Rate': attendance,
        'Scarcity': live_scarcity
    }])
    
    # 2. Extract raw model inference
    raw_prediction = model_instance.predict(input_data)[0]
    
    # 3. Apply post-processing system rules & generate audit tags
    audit_notes = []
    final_discount = raw_prediction
    
    # Absolute Kill Switch Overrides
    if attendance < 0.40:
        final_discount = 0.0
        audit_notes.append("OVERRIDE: Terminated via Absolute Attendance Floor (<40%).")
    elif attendance < 0.60 and loyalty > 2:
        final_discount = 0.0
        audit_notes.append("OVERRIDE: Terminated via High-Volume Scalper Pattern.")
        
    # Boundary Clipping Checks
    if final_discount != 0.0:
        if raw_prediction > 0.50:
            final_discount = 0.50
            audit_notes.append(f"CLIP: Raw prediction ({raw_prediction:.4f}) exceeded commercial cap. Set to 0.50.")
        elif raw_prediction < 0.0:
            final_discount = 0.0
            audit_notes.append(f"CLIP: Raw prediction ({raw_prediction:.4f}) fell below zero floor. Set to 0.00.")
        else:
            audit_notes.append("PASS: Clean calculation within normal operational parameters.")
            
    # Assemble structured audit payload
    audit_log = {
        "inputs": {"distance": distance, "loyalty": loyalty, "attendance": attendance, "scarcity": live_scarcity},
        "raw_model_output": round(raw_prediction, 4),
        "final_discount": round(final_discount, 4),
        "audit_trail": " | ".join(audit_notes) if audit_notes else "PASS"
    }
    return audit_log

# --- Operational Audit Validation Test ---
print("Executing Real-Time Prediction Audit Verifications:\n")

# Scenario A: Legitimate high-loyalty local fan
local_fan_audit = predict_with_audit_trail(model, distance=4.2, loyalty=8, attendance=0.95, live_scarcity=0.15)
print(f"Local Fan Result: {local_fan_audit}\n")

# Scenario B: High-volume purchaser who sells or dumps tickets (Scalper rule catch)
scalper_audit = predict_with_audit_trail(model, distance=12.5, loyalty=14, attendance=0.32, live_scarcity=0.80)
print(f"Scalper System Capture: {scalper_audit}\n")

# Scenario C: A new fan with zero loyalty history but an unverified/poor attendance track record
loophole_test_audit = predict_with_audit_trail(model, distance=8.0, loyalty=1, attendance=0.25, live_scarcity=0.40)
print(f"Loophole Check (New Fan vs Floor): {loophole_test_audit}\n")

# ==========================================
# PHASE 5: Clean Production Metrics & Visuals
# ==========================================
test_preds = model.predict(X_test)
print(f"Validation MAE: {mean_absolute_error(y_test, test_preds):.4f}")
print(f"Validation R-Squared: {r2_score(y_test, test_preds):.4f}")

fig, ax = plt.subplots(figsize=(8, 5))
colors = ['#EF476F', '#FFD166', '#06D6A0', '#118AB2']
ax.barh(X.columns, model.feature_importances_, color=colors, edgecolor='none')

ax.set_title("Feature Impact on Discount Score", fontsize=16, fontweight='bold', color='#333333', pad=15)
ax.set_xlabel("Relative Importance", fontsize=12, fontweight='bold', color='#333333')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['bottom'].set_linewidth(1.5)
ax.spines['left'].set_linewidth(1.5)
ax.spines['bottom'].set_color('#333333')
ax.spines['left'].set_color('#333333')
ax.tick_params(colors='#333333', width=1.5, labelsize=11)

fig.patch.set_alpha(0.0)
ax.patch.set_alpha(0.0)
plt.tight_layout()
plt.savefig('feature_importance_production.png', transparent=True, bbox_inches='tight', dpi=300)