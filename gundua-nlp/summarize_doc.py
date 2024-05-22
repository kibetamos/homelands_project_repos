"""
This module is used for handling summaraizations of long texts
"""
from summarizer.sbert import SBertSummarizer

def summarize(long_text):

    """
    This function returns the summmary of a long text.

    Args:
    long_text: text to be summarized

    Returns:
    summary: Summary of the text.
    """
    body = ''.join(long_text)
    model = SBertSummarizer('paraphrase-MiniLM-L6-v2')
    summary = model(body, num_sentences=4)
    summary = ''.join(summary)
    return summary