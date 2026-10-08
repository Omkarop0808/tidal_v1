import sys
import os
import pandas as pd

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml.model import risk_model

def test_model():
    print("Testing ML Model...")
    df = pd.read_csv("data/synthetic_historical.csv")
    res = risk_model.train(df)
    print("Training Results:", res)
    
    # Test SHAP extraction
    print("Extracting SHAP values...")
    feat = {"wind_speed": 15, "wind_direction": 225, "current_speed": 1.2, "precipitation": 5, "beached_percent": 12}
    shap_vals = risk_model.get_feature_contributions(feat)
    print("SHAP Values:", shap_vals)

if __name__ == "__main__":
    test_model()
