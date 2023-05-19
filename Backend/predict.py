from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np
import json
import openai

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

def chatgpt_predict(target, sentence):
    from dotenv import find_dotenv, load_dotenv
    import os

    prompt = "Decide whether a Text's stance on" + target + "is favor, against, or neither.\n" \
                "Text: "+sentence+"\n" \
                "Stance:"
    load_dotenv(find_dotenv('.env'))
    env_dist = os.environ
    openai.api_key = env_dist.get('open_ai_api_key')


    result = openai.Completion.create(
                model="text-davinci-003",
                prompt=prompt,
                max_tokens=10,
                temperature=0,)

    print(result)

    result_text = result["choices"][0]["text"].strip().upper()
    prediction_data = {"label": result_text}
    print(prediction_data)
    json_obj = json.dumps(prediction_data, default=convert)
    return json_obj

if __name__ == "__main__":
    target = 'Trump'
    sentence = "MAGA!!!"
    result = chatgpt_predict(target, sentence)
    print(result)

