from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token

import json
import numpy as np

from predict import predict
app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/userDB'
mongo = PyMongo(app)
jwt = JWTManager(app)

cors = CORS(app)

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response

def convert(o):
    if isinstance(o, np.generic):
        return o.item()
    raise TypeError


@app.route('/register', methods=['POST'])
def register():
    # Parse the JSON data from the request body
    data = request.form.to_dict()

    # Check if the username already exists in the database
    if mongo.db.users.find_one({'username': data['username']}):
        return jsonify({'error': 'Username already exists'}), 400

    # Generate a hash of the user's password
    password_hash = generate_password_hash(data['password'])

    # Insert the new user into the database
    mongo.db.users.insert_one({
        'username': data['username'],
        'password': password_hash
    })

    return jsonify({'message': 'User registered successfully'}), 201


@app.route('/login', methods=['POST'])
def login():
    # Parse the JSON data from the request body
    data = request.json

    # Find the user in the database
    user = mongo.db.users.find_one({'username': data['username']})

    # Check if the user exists and the password is correct
    if user and check_password_hash(user['password'], data['password']):
        # Generate an access token for the user
        access_token = create_access_token(identity=user['_id'])

        return jsonify({'access_token': access_token}), 200

    return jsonify({'error': 'Invalid username or password'}), 401

@app.route("/predict", methods=["GET", "POST"])
def stancePrediction():
    try:
        if request.method == "POST":
            form_values = request.form.to_dict()

            sentence = form_values['text']
            prediction_data = predict(sentence)
            json_obj = json.dumps(prediction_data, default=convert)
            return json_obj
        return json.dumps({"error":"Please Use POST method"}, default=convert)
    except:
        return json.dumps({"error":"Please Enter Valid Data"}, default=convert)

@app.route('/')
def index():
    return 'Index Page'

if __name__ == "__main__":
    app.run(debug=True)
