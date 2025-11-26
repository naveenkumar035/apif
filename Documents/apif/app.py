from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin SDK
cred = credentials.Certificate(r'/Users/naveen/Documents/cosine/huco.json')  # Update the path
firebase_admin.initialize_app(cred)
db = firestore.client()

def get_inputs():
    """Fetches user queries and bot responses from Firestore."""
    docs = db.collection('navee').order_by('timestamp').stream()

    person_a_queries = []
    person_b_responses = []

    for doc in docs:
        data = doc.to_dict()
        if 'usertip' in data:
            person_a_queries.append(data['usertip'])
        if 'Mytip' in data:
            person_b_responses.append(data['Mytip'])

    return person_a_queries, person_b_responses

# Fetch initial Firestore data
person_a_queries, person_b_responses = get_inputs()

def jaccard_similarity(query, response):
    """Calculate Jaccard similarity between two sentences."""
    query_set = set(query.split())
    response_set = set(response.split())
    intersection = len(query_set.intersection(response_set))
    union = len(query_set.union(response_set))
    return intersection / union if union != 0 else 0

def overlap_coefficient(query, response):
    """Calculate Overlap Coefficient between two sentences."""
    query_set = set(query.split())
    response_set = set(response.split())
    intersection = len(query_set.intersection(response_set))
    smaller_size = min(len(query_set), len(response_set))
    return intersection / smaller_size if smaller_size != 0 else 0

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    """Chatbot API endpoint."""
    global person_a_queries, person_b_responses
    person_a_queries, person_b_responses = get_inputs()  # Refresh Firestore data on each request

    data = request.json
    user_input = data.get('message', '')

    if not user_input:
        return jsonify({"error": "Message is required"}), 400

    # Calculate similarities for all responses
    jaccard_scores = [jaccard_similarity(user_input, response) for response in person_b_responses]
    overlap_scores = [overlap_coefficient(user_input, response) for response in person_b_responses]

    # Select best response using Jaccard or Overlap (Jaccard is primary here)
    best_response_index = max(range(len(jaccard_scores)), key=lambda i: jaccard_scores[i])
    if jaccard_scores[best_response_index] == 0:  # Fallback to Overlap
        best_response_index = max(range(len(overlap_scores)), key=lambda i: overlap_scores[i])

    response = person_b_responses[best_response_index]
    return jsonify({"response": response})

@app.before_request
def handle_options_request():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        return response

if __name__ == '__main__':
    app.run(debug=True)
