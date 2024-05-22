from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.stem import WordNetLemmatizer
from nltk import word_tokenize
from nltk.corpus import stopwords
import re

stop_words = set(stopwords.words('english'))

"""
This module returns the similarity score between a source text
and a list of target texts.

"""

# Interface lemma tokenizer from nltk with sklearn


class LemmaTokenizer:
    ignore_tokens = [',', '.', ';', ':', '"', '``', "''", '`']

    def __init__(self):
        self.wnl = WordNetLemmatizer()

    def __call__(self, doc):
        return [self.wnl.lemmatize(t) for t in word_tokenize(doc) if t not in self.ignore_tokens]


tokenizer = LemmaTokenizer()
token_stop = tokenizer(' '.join(stop_words))


def clean_text(text):
    """
    This function cleans text before
    the being passed to model

    Args:
    text: string to be cleaned

    Returns:
    text: cleaned text
    """

    text = text.replace('.', '. ')
    text = re.sub(r'\w*\d\w*', ' ', text).strip()
    text = re.sub("[\(\[].*?[\)\]]", " ", text)

    return text


def get_similarities(source, targets):
    """
    The function that returns the list of similariry scores

    Args:
    source: The text to compare.
    targets: The list of texts to be compared to.
    """

    # Create a list of all the text and clean them
    clean_texts = [clean_text(i) for i in targets]
    clean_texts.append(clean_text(source))

    # Get the TF-IDF vectors of all the texts
    tfidf = TfidfVectorizer(stop_words=token_stop,
                            tokenizer=tokenizer).fit_transform(clean_texts)

    # Get the similarity of all the texts
    pairwise_similarity = tfidf * tfidf.T

    # Get only the similarity scores of source and targets
    sim_scores = pairwise_similarity.toarray()[-1]

    # Define list to contain score and the text of target
    sim_scores_list = []

    for sim_score, target_doc in zip(sim_scores[:-1], targets):

        # Define dictionary to hold the score and the text of target
        sim_score_dict = {}
        sim_score_dict.update({'score': sim_score})
        sim_score_dict.update({'doc': target_doc})

        # Append each score and text to the list
        sim_scores_list.append(sim_score_dict)

    return sim_scores_list
