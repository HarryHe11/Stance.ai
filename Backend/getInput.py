import torch
import nltk
from ekphrasis.classes.segmenter import Segmenter
from preprocess import preprocess_text

def input_to_tensor(data, config):
    x = torch.LongTensor([_[0] for _ in data]).to(config.device)
    seq_len = torch.LongTensor([_[1] for _ in data]).to(config.device)
    mask = torch.LongTensor([_[2] for _ in data]).to(config.device)
    x_target = torch.LongTensor([_[3] for _ in data]).to(config.device)
    mask_target = torch.LongTensor([_[4] for _ in data]).to(config.device)
    return (x, seq_len, mask, x_target, mask_target)


def get_model_input(text, target, config):
    nltk.download("punkt")
    nltk.download("wordnet")
    nltk.download("stopwords")
    seg = Segmenter(corpus="english")
    text = preprocess_text(text,seg, config.language)
    token = config.tokenizer.tokenize(text)
    seq_len = len(token)
    token_ids = config.tokenizer.convert_tokens_to_ids(token)
    mask = []
    pad_size = config.pad_size
    if len(token) < pad_size:
        mask = [1] * len(token_ids) + [0] * (pad_size - len(token))
        token_ids += ([0] * (pad_size - len(token)))
    else:
        mask = [1] * pad_size
        token_ids = token_ids[:pad_size]
        seq_len = pad_size

    target_token = config.tokenizer.tokenize(target)
    target_token = ['[CLS]'] + target_token
    target_seq_len = len(target_token)
    target_ids = config.tokenizer.convert_tokens_to_ids(target_token)
    target_mask = []
    target_pad_size = 10
    if target_seq_len < target_pad_size:
        target_mask = [1] * len(target_ids) + [0] * \
            (target_pad_size - len(target_ids))
        target_ids += ([0] * (target_pad_size - len(target_ids)))
    else:
        target_mask = [1] * target_pad_size
        target_ids = target_ids[:target_pad_size]
        target_seq_len = target_pad_size
    inputs = [(token_ids, seq_len, mask, target_ids, target_mask)]
    inputs = input_to_tensor(inputs, config)
    return inputs
