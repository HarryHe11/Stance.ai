from flask import Flask, request
from flask_cors import CORS, cross_origin

import json
import numpy as np

from predict import predict
app = Flask(__name__)

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
