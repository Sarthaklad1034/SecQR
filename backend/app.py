from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from PIL import Image
import base64
from io import BytesIO
import os
import joblib
import pandas as pd
import cv2
from pymongo import MongoClient
import numpy as np
from utils.feature_extraction import extract_features
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS with environment variables
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
app.config['CORS_ORIGINS'] = [FRONTEND_URL]
CORS(app, resources={r"/*": {"origins": app.config['CORS_ORIGINS']}})

# Load the pre-trained model
MODEL_PATH = os.path.join('models', 'random_forest_model.pkl')
loaded_model = joblib.load(MODEL_PATH)

# MongoDB connection with environment variables
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/SecuQR')
client = MongoClient(MONGODB_URI, tlsAllowInvalidCertificates=True)
db = client[os.getenv('MONGODB_DB', 'SecuQR')]

def analyze_qr_code(image):
    """Analyze QR code from image and return status and decoded data."""
    detector = cv2.QRCodeDetector()
    data, bbox, _ = detector.detectAndDecode(image)
    if data and bbox is not None:
        # Store original URL for return
        original_url = data
        
        # Normalize URL by adding scheme if missing
        if not data.startswith('http://') and not data.startswith('https://'):
            normalized_data = 'http://' + data
        else:
            normalized_data = data
        
        # Check databases first (with both original and normalized URLs)
        if does_safe_link_exist(original_url) or does_safe_link_exist(normalized_data):
            return 'safe', original_url
            
        if does_malicious_link_exist(original_url) or does_malicious_link_exist(normalized_data):
            return 'malicious', original_url
            
        # Extract features and make prediction only if not found in databases
        features = extract_features(normalized_data)
        prediction = loaded_model.predict(pd.DataFrame([features]))[0]
        status = 'safe' if prediction == 0 else 'malicious'
        return status, original_url
    return 'safe', None


# Database utility functions
def does_safe_link_exist(url):
    """Check if URL exists in safe links database."""
    safe_collection = db['safeLinks']
    return safe_collection.find_one({'url': url}) is not None

def does_malicious_link_exist(url):
    """Check if URL exists in malicious links database."""
    malicious_collection = db['maliciousLinks']
    return malicious_collection.find_one({'url': url}) is not None

def add_link_if_not_exists(url, category):
    """Add URL to appropriate database if it doesn't exist."""
    collection = db['maliciousLinks'] if category == 'malicious' else db['safeLinks']
    if not collection.find_one({'url': url}):
        collection.insert_one({'url': url, 'category': category})
        return True
    return False

# API Endpoints
@app.route('/scan', methods=['POST'])
@cross_origin()
def scan_qr_code():
    """Endpoint to receive and analyze QR code image."""
    try:
        data = request.json
        if not data or 'image' not in data:
            return jsonify({'status': 'error', 'message': 'No image provided'}), 400

        # Decode the Base64 image
        image_data = data['image'].replace('data:image/png;base64,', '')
        image = Image.open(BytesIO(base64.b64decode(image_data)))

        # Convert PIL image to OpenCV format
        open_cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        # Analyze QR code
        result, url = analyze_qr_code(open_cv_image)

        if not url:
            return jsonify({'status': 'error', 'message': 'No QR code detected'}), 200

        return jsonify({'status': result, 'url': url}), 200

    except Exception as e:
        # Remove detailed error logging for production
        return jsonify({'status': 'error', 'message': 'Error processing QR code'}), 500

@app.route('/checksafe-url', methods=['POST'])
def checksafe_url():
    """Endpoint to check if URL exists in safe links database."""
    data = request.json
    url = data.get('url')
    
    if url:
        exists = does_safe_link_exist(url)
        return jsonify({'exists': exists}), 200
    return jsonify({'error': 'URL not provided'}), 400

@app.route('/checkmalicious-url', methods=['POST'])
def checkmalicious_url():
    """Endpoint to check if URL exists in malicious links database."""
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No JSON data received'}), 400

        url = data.get('url')
        if not url:
            return jsonify({'error': 'URL field is missing in the JSON data'}), 400

        exists = does_malicious_link_exist(url)
        return jsonify({'exists': exists}), 200

    except Exception:
        # Remove detailed error logging for production
        return jsonify({'error': 'Error processing request'}), 500

@app.route('/report-url', methods=['POST'])
def report_url():
    """Endpoint to report a URL as malicious."""
    data = request.json
    url = data.get('url')
    
    if url:
        added = add_link_if_not_exists(url, 'malicious')
        if added:
            return jsonify({'message': 'URL reported as malicious successfully'}), 200
        return jsonify({'message': 'URL already exists in database'}), 200
    
    return jsonify({'error': 'URL not provided'}), 400

# Health check endpoint for deployment platforms
@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint."""
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    # Get port from environment variable for deployment platforms
    port = int(os.getenv('PORT', 5000))
    app.run(host="0.0.0.0", port=port, debug=False)