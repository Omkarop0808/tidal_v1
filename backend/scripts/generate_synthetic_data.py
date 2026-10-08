import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import sys

# Ensure backend is in path to import drift engine if needed, though we can mock it here
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def generate_synthetic_data(num_records=2000, output_path="data/synthetic_historical.csv"):
    """
    Generates 2 years of simulated weather/drift data for training the BeachingRiskModel.
    """
    print(f"Generating {num_records} synthetic records...")
    
    np.random.seed(42)
    start_date = datetime.now() - timedelta(days=365*2)
    
    data = []
    
    # Base seasonal patterns (Monsoons in Mumbai: June to Sept)
    for i in range(num_records):
        current_date = start_date + timedelta(hours=i*12)
        month = current_date.month
        
        # Monsoon multiplier
        is_monsoon = 1 if 6 <= month <= 9 else 0
        
        # Simulated features
        wind_speed = np.random.normal(25 if is_monsoon else 12, 5 if is_monsoon else 3)
        wind_speed = max(0, wind_speed)
        
        wind_direction = np.random.normal(225 if is_monsoon else 45, 20) % 360
        
        current_speed = np.random.normal(1.5 if is_monsoon else 0.8, 0.3)
        current_speed = max(0, current_speed)
        
        precipitation = np.random.exponential(10 if is_monsoon else 1)
        
        # Simulated Monte-Carlo output (beached_percent)
        # Higher wind speed towards coast (~270 deg) increases beaching
        onshore_wind_component = wind_speed * max(0, np.cos(np.radians(wind_direction - 270)))
        beached_percent = min(100, max(0, onshore_wind_component * 2 + np.random.normal(0, 10)))
        
        # Target variable (beaching_kg)
        # Assuming true physical relation + noise
        beaching_kg = (wind_speed * 12) + (precipitation * 5) + (beached_percent * 8) + np.random.normal(0, 50)
        beaching_kg = max(0, beaching_kg)
        
        data.append({
            "timestamp": current_date.isoformat(),
            "zone_name": np.random.choice(["Juhu", "Versova", "Bandra"]),
            "wind_speed": wind_speed,
            "wind_direction": wind_direction,
            "current_speed": current_speed,
            "precipitation": precipitation,
            "beached_percent": beached_percent,
            "beaching_kg": beaching_kg
        })
        
    df = pd.DataFrame(data)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    
    print(f"Data saved to {output_path}")
    return df

if __name__ == "__main__":
    generate_synthetic_data()
