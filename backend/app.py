import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
import vertexai
from vertexai.generative_models import GenerativeModel
import requests

# Import our new tool from the toolbox
from tools.web_scraper import scrape_nasa_data

# --- SETUP: DO THIS ONCE ---
script_dir = os.path.dirname(os.path.abspath(__file__))
key_path = os.path.join(script_dir, 'service-account-key.json')
inventory_path = os.path.join(script_dir, 'inventory.json')
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = key_path

app = Flask(__name__)
CORS(app)

# --- AI AND DATABASE CONFIGURATION ---
VERTEX_AI_INITIALIZED = False
LM_STUDIO_URL = "http://localhost:1234/v1/chat/completions"

try:
    vertexai.init(location="us-central1")
    gcp_model = GenerativeModel("gemini-1.5-flash-001")
    VERTEX_AI_INITIALIZED = True
    print("✅ Vertex AI initialized successfully. ONLINE mode is available.")
except Exception as e:
    print(f"⚠️ Vertex AI initialization failed: {e}. FALLING BACK to OFFLINE mode (LM Studio).")
    VERTEX_AI_INITIALIZED = False

try:
    with open(inventory_path, 'r') as f:
        inventory_data = json.load(f)
    print(f"✅ Local inventory loaded successfully from {inventory_path}")
except Exception as e:
    print(f"❌ CRITICAL ERROR: Could not load local inventory file: {e}")
    inventory_data = []
# --- END SETUP ---

def query_lm_studio(prompt):
    """Sends a prompt to the local LM Studio instance for offline inference."""
    headers = {"Content-Type": "application/json"}
    payload = { "messages": [{"role": "user", "content": prompt}], "temperature": 0.7, "max_tokens": -1, "stream": False }
    try:
        response = requests.post(LM_STUDIO_URL, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except requests.exceptions.RequestException as e:
        print(f"❌ LM Studio connection error: {e}")
        return "Error: Could not connect to the local LM Studio server. Is it running?"

@app.route("/api/inventory/query", methods=['POST'])
def handle_inventory_query():
    """Handles natural language queries. Decides whether to answer from inventory or use a tool."""
    user_query = request.json.get("query")
    if not user_query:
        return jsonify({"error": "Query not provided"}), 400

    inventory_context = "\n".join([f"- {item['itemName']} (ID: {item['itemId']}): Quantity {item['quantity']}, Located at '{item['location']}', Status: {item['status']}." for item in inventory_data])

    # The upgraded prompt teaches the AI how and when to request a tool
    prompt = f"""
    You are Astro Archive, an AI quartermaster for a space mission. Your primary purpose is to answer questions based ONLY on the provided inventory list.

    INVENTORY DATA:
    {inventory_context}

    --- AVAILABLE TOOLS ---
    You also have access to a special tool: a real-time web scraper that can search NASA's public technical database for mission-related documents and specifications.

    TOOL INSTRUCTIONS:
    If a user's question CANNOT be answered using the inventory data but seems like a request for technical information, research, or specifications (e.g., "Find specs for...", "Look up research on..."), you MUST respond with ONLY the following JSON object and nothing else:
    {{
      "tool_to_use": "web_scraper",
      "search_query": "<the user's original question or a refined search term>"
    }}

    If you can answer the question from the inventory, just provide a direct, concise answer.

    --- TASK ---
    Based on all of this, answer the following question: "{user_query}"
    """

    ai_response_text = ""
    mode = ""

    # Step 1: Get the initial response from the AI (either online or offline)
    if VERTEX_AI_INITIALIZED:
        mode = "ONLINE (Vertex AI)"
        try:
            response = gcp_model.generate_content(prompt)
            ai_response_text = response.text
        except Exception as e:
            print(f"⚠️ Vertex AI call failed, falling back to offline: {e}")
            mode = "OFFLINE (LM Studio Fallback)"
            ai_response_text = query_lm_studio(prompt)
    else:
        mode = "OFFLINE (LM Studio)"
        ai_response_text = query_lm_studio(prompt)

    # Step 2: Check if the AI's response was a request to use a tool
    try:
        # Attempt to parse the AI's response as a JSON object
        tool_request = json.loads(ai_response_text.strip())
        if isinstance(tool_request, dict) and tool_request.get("tool_to_use") == "web_scraper":
            search_query = tool_request.get("search_query", user_query)
            # The AI requested the tool, so we execute it
            tool_result = scrape_nasa_data(search_query)
            # The final response becomes the result from the tool
            ai_response_text = tool_result
    except (json.JSONDecodeError, TypeError):
        # This is the normal case: the AI gave a plain text answer, so we do nothing.
        pass

    return jsonify({"mode": mode, "user_query": user_query, "ai_response": ai_response_text})

if __name__ == '__main__':
    app.run(debug=True, port=5001)