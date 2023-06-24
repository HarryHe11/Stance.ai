# coding: UTF-8
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from transformers import BertModel, BertTokenizer

class Config(object):
    """配置参数"""
    def __init__(self, language):
        if language == 'en':
            print('using english model')
            self.language = 'english'
            self.model_name = 'BERTA_EN'
            self.bert_path = 'bert-base-uncased'
        else:
            print('using chinese model')
            self.language = 'chinese'
            self.model_name = 'BERTA_CN'
            self.bert_path = 'bert-base-chinese'
        self.path = 'D:\南邮\毕业设计\codes\Stance.ai\Backend\models\saved_dict'
        self.tokenizer = BertTokenizer.from_pretrained(self.bert_path)
        self.save_path = self.path + '/' + self.model_name + '.ckpt'
        self.class_list = [0, 1, 2]
        self.num_classes = len(self.class_list)
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.dropout = 0.1
        self.num_epochs = 20
        self.batch_size = 16
        self.pad_size = 128
        self.learning_rate = 1e-5
        self.hidden_size = 768
        self.hidden_size2 = 128


class Model(nn.Module):
    def __init__(self, config):
        super(Model, self).__init__()
        self.bert = BertModel.from_pretrained(config.bert_path)
        for param in self.bert.parameters():
            param.requires_grad = True

        self.tanh1 = nn.Tanh()
        self.w = nn.Parameter(torch.zeros(2 * config.hidden_size))
        self.tanh2 = nn.Tanh()
        self.fc1 = nn.Linear(config.hidden_size, config.hidden_size2)
        self.fc = nn.Linear(config.hidden_size2, config.num_classes)
        self.dropout = nn.Dropout(config.dropout)

    def forward(self, x):
        x_token = x[0]  # [batch_size, Seq_len]
        mask = x[2]  # [batch_size, Seq_len]
        target_token = x[3]  # [batch_size, T_Seq_len]
        target_mask = x[4] # [batch_size, T_Seq_len]

        '''词向量表示层'''
        # 生成Text的"输入文本词向量表示"
        x_output = self.bert(x_token, attention_mask=mask)
        x_emb = x_output.last_hidden_state  # [batch_size, Seq_len, hidden_size]
        # 生成Target的"目标文本词向量表示", 并进行平均池化，得到"目标向量表示"
        target_output = self.bert(target_token, attention_mask=target_mask)
        target_emb = target_output.pooler_output
        target_emb = target_emb.unsqueeze(1)  # [batch_size, 1, hidden_size]

        '''目标增强向量表示层'''
        # 将"目标向量表示"与"输入文本词向量表示"中的每个向量拼接，得到"目标增强向量表示"
        target_emb_tiled = target_emb.repeat(1, x_emb.size()[1], 1)  # [batch_size, Seq_len, hidden_size]
        e = torch.cat([x_emb, target_emb_tiled], dim=2)  # [batch_size, Seq_len, hidden_size * 2]
        M = torch.tanh(e)

        '''目标特异性注意力提取层'''
        # 线性变换"目标增强向量表示",将其降维成标量并做softmax操作，得到每个token的注意力信号
        alpha = F.softmax(torch.matmul(M, self.w), dim=1).unsqueeze(-1)  # [batch_size, Seq_len, 1]

        # 内积得到"携带注意力信号的输入文本词向量表示"
        out = x_emb * alpha  # [batch_size, Seq_len, hidden_size]

        # 平均得到最终文本分类特征"最终输入向量表示"
        out = torch.sum(out, 1)  # [batch_size, hidden_size]
        out = self.dropout(out)

        '''分类层'''
        # 分类器
        out = self.fc1(out)  # [batch_size, hidden_size2]
        out = F.relu(out)  # [batch_size, hidden_size2]
        out = self.fc(out)  # [batch_size, 3]
        return out
