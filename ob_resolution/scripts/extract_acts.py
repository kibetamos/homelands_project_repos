import spacy
from spacy.lang.en import English
import json
import re


"""
This module extracts sections of the Laws of Kenya.
"""
def clean_sentence(sentence):
    keywords = ['order', 'rule', 'offence', 'section', 'act', 'sections', 'subsection', 'subsections']
    cleaned_sentence = re.sub(r'\bof\b', 'Of', sentence)
    cleaned_sentence = re.sub(r'\bthe\b', 'The', cleaned_sentence)
    cleaned_sentence = re.sub(r'\band\b', 'And', cleaned_sentence)
    for keyword in keywords:
        regex_keyword = r'\b'+keyword+r'\b'
        cleaned_sentence = re.sub(regex_keyword, keyword.title(), cleaned_sentence)

    return cleaned_sentence



def get_provision(text):
    results = []
    keywords = ['Order', 'Rule', 'Offence', 'Section', 'Act']
    nlp = English()
    nlp.add_pipe(nlp.create_pipe('sentencizer'))
    doc = nlp(text)
    sentences = [sent.string.strip() for sent in doc.sents]

    for sentence in sentences:
        for keyword in keywords:
            if keyword.lower() in sentence.lower():
                cleaned_sentence = clean_sentence(sentence)
                civil_rex=r'(([A-Z][a-z]+)*([\(0-9\)])*(\([a-z.]+\))*([\s+,.]))*'
                matches = re.finditer(civil_rex, cleaned_sentence)
                for match in matches:
                    match_word = match.group(0)
                    if keyword in match_word:
                        results.append(match_word)
       
    return results




