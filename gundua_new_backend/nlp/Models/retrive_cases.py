"""
This module is for retrieving cases from the database.
"""

from http import client
import pymongo
from .similar_search import get_similarities
import urllib.parse



# client = pymongo.MongoClient(
#     "mongodb+srv://sylviachach:sylviachach@cluster0.axlhacq.mongodb.net/?retryWrites=true&w=majority")
# client = pymongo.MongoClient("127.0.0.1", 27017)
# client = pymongo.MongoClient("localhost", 27017)
username = urllib.parse.quote_plus('charles')
password = urllib.parse.quote_plus('@Charles2914')
client=pymongo.MongoClient("mongodb+srv://%s:%s@cluster0.ek3sawq.mongodb.net/?retryWrites=true&w=majority" %(username, password))

db = client.wanyingi
collection = db.cases


def get_case(case_id):
    """
    Gets a single case.

    Returns:
    A specific case based on its object id.
    """
    # case = list(collection.find({"_id": case_id}, {'_id': {'$toString': "$_id"}, 'meta_info': 1,
    #                             'parties_info': 1,  'judgement': 1,
    #                             "related_cases": 1, "resolved_acts": 1, "resolved_charges": 1}))
    
    case=list(collection.find({}))
    
    case[case_id]["judgement"] = clean_judgement(case[case_id]["judgement"])
    return case[case_id]


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
    
    for case in cases:
        case['judgement']=clean_judgement(case['judgement'])
        
        
    
   
    return cases

def adhoc_search(name,cls,case_class):
    
     query={
        "$and":[{'meta_info.Judge(s) ':{"$regex":name}},
                {'meta_info.Court Division':{"$regex":cls}},
                {'meta_info.Case Class ':{"$regex":case_class}}
                ]
    }
     items=list(collection.find(query))
     return items


def search_by_judge(text):
    """
    Conducts a full text search on all cases.

    Args:
    text: Text to compare to.

    Return:
    cases: Cases that match full text search.

    """
    collection.drop_indexes()
    index = [
        
        ('meta_info.Judge(s): ', 'text'),
        ('parties_info', 'text'),
        ('meta_info.Case Number:', 'text')
    ]
    collection.create_index(index)

    cases = list(collection.find({"$text": {"$search":text}}
        ))

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


def list_all_categories():


    '''
    This list all categories inthe data base and removes the duplictaes
    '''

    cases=get_cases()


    categ=[]

    for item in cases:
        categ.append(item['resolved_acts']+item['resolved_charges'])

    categ = list(filter(None, categ))
    
    ## flatemt the nested list into one list

    def flatten_list(_2d_list):
        flat_list = []
        # Iterate through the outer list
        for element in _2d_list:
            if type(element) is list:
                # If the element is of type list, iterate through the sublist
                for item in element:
                    flat_list.append(item)
            else:
                flat_list.append(element)

        return flat_list

        # remove  dumplicates
    list_cat=[]
    for item in flatten_list(categ):
        if item not in list_cat:
            list_cat.append(item)

    return sorted(list_cat)





    



