"""
This module is for retrieving cases from the database.
"""

import pymongo
from similar_search import get_similarities


# client = pymongo.MongoClient(
#     "mongodb+srv://sylviachach:sylviachach@cluster0.axlhacq.mongodb.net/?retryWrites=true&w=majority")
client = pymongo.MongoClient("localhost", 27017)
db = client.presentation
collection = db.cases


def get_case(case_id):
    """
    Gets a single case.

    Returns:
    A specific case based on its object id.
    """
    case = list(collection.find({"_id": case_id}, {'_id': {'$toString': "$_id"}, 'meta_info': 1,
                                'parties_info': 1,  'judgement': 1,
                                "related_cases": 1, "resolved_acts": 1, "resolved_charges": 1}))
    case[0]["judgement"] = clean_judgement(case[0]["judgement"])
    return case


def get_cases():
    """
    List all cases in the database.

    Returns:
    cases: All cases in the database
    """
    cases = list(collection.find({}, {'_id': {'$toString': "$_id"}, 'meta_info': 1,
                                      'parties_info': 1,  'judgement': 1,
                                      "related_cases": 1, "resolved_acts": 1,
                                       "resolved_charges": 1}))
    return cases


def full_text_search(text):
    """
    Conducts a full text search on all cases.

    Args:
    text: Text to compare to.

    Return:
    cases: Cases that match full text search.

    """
    collection.drop_indexes()
    index = [
        ('parties_info', 'text'),
        ('meta_info.Case Number:', 'text'),
        ('meta_info.Judge(s): ', 'text'),
        ('judgement', 'text')
    ]
    collection.create_index(index)
    cases = list(collection.find({"$text": {"$search": text}}, {'_id': {'$toString': "$_id"}, 'meta_info': 1,
                                      'parties_info': 1,  'judgement': 1,
                                      "related_cases": 1, "resolved_acts": 1,
                                       "resolved_charges": 1}))
    return cases


def get_similar_cases(source_text):
    """
    This function takes a piece of text and tries to find cases
    with similar meaning to text based a certain threshold.

    Args:
    source_text: Text to compare to.

    Return:
    sim_cases: Cases that meet threshold of similarity
    """

    # Get all the cases
    cases = get_cases()

    # Get list to hold the judgements of cases
    judgements_list = [' '.join(case['judgement']) for case in cases]

    # Get the score of all the judgements in comparison to the source text
    sim_scores_judgements = get_similarities(source_text, judgements_list)

    # Define list to hold cases that meet threshold of similarity
    sim_cases = []

    # Get only cases with threshold score
    for sim_score, case in zip(sim_scores_judgements, cases):
        if sim_score['score'] > 0.127:
            sim_cases.append(case)

    return sim_cases


def clean_judgement(judgements):
    """
    This function cleans and classifies paragraphs of
    the judgement section of the cases. 

    Args:
    judgements: list of paragraphs of judgements.

    Returns:
    cleaned_judgements: list of cleaned and classified paragraphs
                         of judgements.
    """
    cleaned_judgements = []
    for _, j in enumerate(judgements):
        j = j.replace(',', '')
        j = j.replace('  ', '')
        j = j.strip()

        cleaned_judgements.append(j)
    return cleaned_judgements

def get_categorized_cases(category):
    """
    This function gets cases of a specific category

    Args:
    category: category of case

    Returns:
    categorized_cases: list of cases of that particular category.
    """
    cases = get_cases()
    categorized_cases = [i for i in cases for j in i['resolved_acts']+i['resolved_charges'] if j==category]
    return categorized_cases
