import joblib
import pandas as pd

# 1. Load the pre-trained brain from your hard drive
live_model = joblib.load('ethical_discount_model_v1.joblib')

# 2. Run a live customer through it instantly
customer_data = pd.DataFrame([{'Distance_Miles': 5.0, 'Loyalty_Index': 12, 'Attendance_Rate': 0.98, 'Scarcity': 0.85}])
instant_discount = live_model.predict(customer_data)

print(f"Live Discount Authorized: {instant_discount[0]:.2f}")