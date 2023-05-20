from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np
import json
import openai
from models.model import Config, Model
from getInput import get_model_input


def convert(o):
    if isinstance(o, np.generic):
        return o.item()
    raise TypeError


# select mode path here
# see more at https://huggingface.co/kornosk
def predict(text, target, language='en'):
    config = Config(language)
    # load model
    model = Model(config).to(config.device)
    # get inputs in a model-acceptable form
    inputs = get_model_input(text, target, config)
    # inputs
    outputs = model(inputs)
    predicted_probability = torch.softmax(outputs, dim=1)
    predicted_probability = predicted_probability[0].tolist()
    print(predicted_probability)
    id2label = {
        0: "FAVOR",
        1: "AGAINST",
    }
    max_prob = max(predicted_probability)
    index = predicted_probability.index(max_prob)
    predicted_label = id2label[index]
    probs = {
        'Favor': predicted_probability[0],
        'Against': predicted_probability[1]
    }
    probs_json_obj = json.dumps(probs, default=convert)
    prediction_data = {"label": predicted_label,
                       "max_prob": max_prob, "probs": probs_json_obj}
    json_obj = json.dumps(prediction_data, default=convert)
    return json_obj


if __name__ == "__main__":
    target = 'Hillary Clinton'
    sentence = "@HillaryClinton @WomenintheWorld we need to re-establish a #global system dominated by love and affection have #moral_humane RT"
    #sentence = '城市是发展了，人民是安居乐业了！可是，作为这个城市最为普通的打工者，他们需要电动车，摩托车作为出行工具，去讨生活！再说，什么又是超标电动车呢？既然超标，为什么还要生产！这领导啊，乱治，乱为！为所欲为啊！'
    result = predict(target, sentence)
    print(result)
