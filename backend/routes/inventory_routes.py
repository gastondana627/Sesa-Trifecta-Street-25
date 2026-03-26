import os
import json
from flask import Blueprint, jsonify, request
from ..services.ai_service import get_ai_response

inventory_bp = Blueprint('inventory', __name__)

# --- LOAD DATA ---
script_dir = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))
inventory_path = os.path.join(script_dir, 'inventory.json')
sample_inventory_path = os.path.join(script_dir, 'sample_inventory.json')

def load_inventory():
    try:
        if os.path.exists(inventory_path):
            with open(inventory_path, 'r') as f:
                return json.load(f)
        elif os.path.exists(sample_inventory_path):
            with open(sample_inventory_path, 'r') as f:
                return json.load(f)
    except Exception as e:
        print(f"⚠️ Error loading inventory: {e}")
    return []

inventory_data = load_inventory()
if not inventory_data:
    print("ℹ️ No inventory data loaded.")

@inventory_bp.route("/query", methods=['POST'])
def handle_inventory_query():
    """Handles natural language queries."""
    user_query = request.json.get("query")
    if not user_query:
        return jsonify({"error": "Query not provided"}), 400

    ai_response_text, mode = get_ai_response(user_query, inventory_data)

    return jsonify({
        "mode": mode,
        "user_query": user_query,
        "ai_response": ai_response_text
    })

@inventory_bp.route("/health", methods=['GET'])
def health_check():
    """Simple health check endpoint."""
    return jsonify({"status": "healthy", "inventory_loaded": len(inventory_data) > 0})
