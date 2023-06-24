from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo

from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash


import json
import numpy as np
from datetime import datetime
from predict import predict

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/userDB'

# 初始化会话对象
mongo = PyMongo(app)
# 限制只允许特定的域名进行跨域请求
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# 允许特定的HTTP方法进行跨域请求
CORS(app, resources={r"/*": {"methods": ["GET", "POST"]}})


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add("Access-Control-Allow-Headers",
                         "Origin, X-Requested-With, Content-Type, Accept")
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

def convert(o):
    if isinstance(o, np.generic):
        return o.item()
    raise TypeError


@app.route('/signup', methods=['POST'])
def signup():
    # Parse the JSON data from the request body
    data = request.form.to_dict()

    # Check if the username already exists in the database
    if mongo.db.users.find_one({'username': data['userName']}):
        return jsonify({'message': 'Username already exists'}), 201
    # Generate a hash of the user's password
    password_hash = generate_password_hash(data['password'])
    # Insert the new user into the database
    mongo.db.users.insert_one({
        'username': data['userName'],
        'email': data['email'],
        'password': password_hash,
    })

    return jsonify({'message': 'User registered successfully'}), 200


@app.route('/signin', methods=['POST'])
def signin():
    # Parse the JSON data from the request body
    data = request.form.to_dict()
    # Find the user in the database
    user = mongo.db.users.find_one({'email': data['email']})
    # Check if the user exists and the password is correct
    if not user:
        print('user not found')
        print(data['email'])
        return jsonify({'message': 'user not found'}), 201
    elif user and check_password_hash(user['password'], data['password']):
        print('success')
        return jsonify({'message': 'success'}), 200
    elif user and not (check_password_hash(user['password'], data['password'])):
        print('Invalid username or password')
        print(data['email'])
        return jsonify({'message': 'Invalid username or password'}), 201


@app.route("/predict", methods=["POST"])
def stancePrediction():
    form_values = request.form.to_dict()
    print(form_values)
    model = form_values['model']
    user_email = form_values['user_email']
    user = mongo.db.users.find_one({'email': user_email})
    user_id =  user['_id']
    text = form_values['text']
    target = form_values['target']
    creation_time = datetime.now()

    mongo.db.historys.insert_one({
        'userId': user_id,
        'text': text,
        'target': target,
        'creationTime': creation_time
    })

    if model == 'chinese':
        language = 'cn'
    elif model == 'english':
        language = 'en'
    prediction_data, (stance,probs) = predict(target, text, language)

    data = mongo.db.historys.find_one({'creationTime': creation_time})
    data_id = data['_id']
    print(prediction_data)
    print(stance)
    print(probs)
    stance = stance
    favorConfidence = probs['Favor']
    againstConfidence= probs['Against']
    neitherConfidence= probs['Neither']

    mongo.db.results.insert_one({
        'dataId': data_id,
        'stance': stance,
        'favorConfidence': favorConfidence,
        'againstConfidence': againstConfidence,
        'neitherConfidence': neitherConfidence,
    })

    json_obj = json.dumps(prediction_data, default=convert)


    print(json_obj)
    return json_obj


@app.route('/')
def index():
    return 'Index Page'


if __name__ == "__main__":
    app.run(debug=True)
