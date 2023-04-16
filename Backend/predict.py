from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np
import json

def convert(o):
    if isinstance(o, np.generic):
        return o.item()
    raise TypeError


# select mode path here
# see more at https://huggingface.co/kornosk
def predict(sentence):
    path = r'models/bert-election2020-twitter-stance-biden-KE-MLM'
    # load model
    tokenizer = AutoTokenizer.from_pretrained(path)
    model = AutoModelForSequenceClassification.from_pretrained(path)
    print("Model Loaded")

    id2label = {
        0: "FAVOR",
        1: "AGAINST",
        2: "NONE"
    }
    ##### Prediction Favor #####
    inputs = tokenizer(sentence, return_tensors="pt")
    outputs = model(**inputs)
    predicted_probability = torch.softmax(outputs[0], dim=1)[0].tolist()
    predicted_label = id2label[np.argmax(predicted_probability)]
    prediction_data = {"label": predicted_label, "probs": predicted_probability}
    json_obj = json.dumps(prediction_data, default=convert)
    return json_obj



if __name__ == "__main__":
    sentence = "MAGA!!!"
    result = predict(sentence)
    print(result)

