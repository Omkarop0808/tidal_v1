import pytest
import pandas as pd
import numpy as np
from ml.model import BeachingRiskModel

def test_risk_model_prediction():
    model = BeachingRiskModel()
    # Test valid input
    features = {"wind_speed": 10, "beached_percent": 5, "current_speed": 1}
    risk = model.predict(features)
    assert risk >= 0
    
    # Test input validation (clamping)
    features_neg = {"wind_speed": -10, "beached_percent": 5}
    risk_clamped = model.predict(features_neg)
    assert risk_clamped >= 0
