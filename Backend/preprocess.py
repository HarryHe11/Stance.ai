import re
import nltk
import jieba
import nltk
import ekphrasis
from ekphrasis.classes.segmenter import Segmenter


def remove_html_tags(text):
    cleaned_text = re.sub(r"<.*?>", "", text)
    return cleaned_text


def remove_urls(text):
    cleaned_text = re.sub(r"http\S+|www\S+|https\S+", "", text)
    return cleaned_text


def remove_mentions(text):
    cleaned_text = re.sub(r"@\w+", "", text)
    return cleaned_text


def replace_hashtags(text, seg):
    hashtag_pattern = re.compile(r"#(\w+)")
    hashtag = re.search(hashtag_pattern, text)
    if hashtag:
        hashtag = hashtag.group()[1:]
        split_text = {hashtag: seg.segment(hashtag)}
        replaced_text = re.sub(hashtag_pattern, lambda match: split_text.get(
            match.group(1), match.group(1)), text)
        return replaced_text
    else:
        return text


def lemmatize_words(text):
    lemmatizer = nltk.WordNetLemmatizer()
    lemmatized_words = [lemmatizer.lemmatize(
        word) for word in nltk.word_tokenize(text)]
    return " ".join(lemmatized_words)


def remove_stopwords(text, language):
    if language == "english":
        stopwords = nltk.corpus.stopwords.words("english")
        tokens = nltk.word_tokenize(text)
        cleaned_tokens = [
            token for token in tokens if token.lower() not in stopwords]
        cleaned_text = " ".join(cleaned_tokens)
    elif language == "chinese":
        stopwords = set()
        with open("chinese_stopwords.txt", "r", encoding="utf-8") as f:
            for line in f:
                stopwords.add(line.strip())
        words = jieba.cut(text)
        cleaned_words = [word for word in words if word not in stopwords]
        cleaned_text = " ".join(cleaned_words)
    else:
        raise ValueError(
            "Invalid language. Supported languages are 'english' and 'chinese'.")

    return cleaned_text


def preprocess_text(text, seg, language):

    cleaned_text = remove_html_tags(text)
    cleaned_text = remove_urls(cleaned_text)
    cleaned_text = remove_mentions(cleaned_text)
    restored_text = replace_hashtags(cleaned_text, seg)
    lemmatized_text = lemmatize_words(restored_text)
    cleaned_text = remove_stopwords(lemmatized_text, language)
    return cleaned_text


if __name__ == "__main__":
    nltk.download("punkt")
    nltk.download("wordnet")
    nltk.download("stopwords")
    seg = Segmenter(corpus="english")
    text = '@HillaryClinton @WomenintheWorld we need to re-establish a #global system dominated by love and affection have #moral_humane RT'

    #text = "很好的手机，性价比高，比国产好的没话说，国产一年一环 苹果用 5 年 8 年没事不卡不迟钝，黑粉们哪个牌子派来的去哪里带着去，有意思吗？不喜欢就不要买，到处乱喷 这就是素质。"
    #text = '@HillaryClinton @WomenintheWorld we need to re-establish a #global system dominated by love and affection have #moral_humane RT'
    print("预处理前：")
    print(text)
    print("预处理后：")
    print(preprocess_text(text, seg))
