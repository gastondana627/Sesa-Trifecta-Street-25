import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Setup Google Application Credentials
    script_dir = os.path.dirname(os.path.abspath(__file__))
    key_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS', os.path.join(script_dir, 'service-account-key.json'))

    if os.path.exists(key_path):
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = key_path
        print(f"✅ Google Credentials set from {key_path}")
    else:
        print(f"⚠️ Warning: Google service account key not found at {key_path}")

    # Register Blueprints
    from .routes.inventory_routes import inventory_bp
    app.register_blueprint(inventory_bp, url_prefix='/api/inventory')

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=True, port=port)
