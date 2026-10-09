import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_simulation_integration():
    payload = {
        "wind_speed": 20,
        "rainfall_increase": 10,
        "barrier_efficiency": 50,
        "cleanup_teams": 5,
        "lat": 19.135,
        "lon": 72.814
    }
    response = client.post("/api/v1/simulate/scenario", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "trajectory_intervention" in data
    assert "trajectory_baseline" in data
    assert len(data["trajectory_intervention"]) > 0
