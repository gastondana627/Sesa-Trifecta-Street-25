import pytest
import json
from backend.app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test the health check endpoint."""
    response = client.get('/api/inventory/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'healthy'
    assert data['inventory_loaded'] is True

def test_inventory_query_no_query(client):
    """Test query endpoint without a query."""
    response = client.post('/api/inventory/query', json={})
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data

def test_inventory_query_success(client, monkeypatch):
    """Test successful query (mocking AI response)."""

    def mock_get_ai_response(query, inventory_data):
        return "Mocked AI Response", "OFFLINE (Mock)"

    # Correct path to mock based on where it's used or imported
    monkeypatch.setattr("backend.routes.inventory_routes.get_ai_response", mock_get_ai_response)

    response = client.post('/api/inventory/query', json={"query": "How many medkits?"})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['ai_response'] == "Mocked AI Response"
    assert data['mode'] == "OFFLINE (Mock)"
