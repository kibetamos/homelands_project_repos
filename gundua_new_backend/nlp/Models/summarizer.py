"""
This module is used for handling summaraizations of long texts
"""
from summarizer.sbert import SBertSummarizer
import math

def summarize(long_text):

    """
    This function returns the summmary of a long text.

    Args:
    long_text: text to be summarized

    Returns:
    summary: Summary of the text.
    """
    n=math.floor((len(long_text)/300)*0.2)
    body = ''.join(long_text)
    model = SBertSummarizer('paraphrase-MiniLM-L6-v2')
    summary = model(body, num_sentences=n)
    summary = ''.join(summary)
    #return print(summary)
    return summary