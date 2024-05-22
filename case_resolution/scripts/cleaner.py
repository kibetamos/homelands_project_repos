import pandas as pd

def clean_text(text):
    """
    This function cleans text

    Args:
    text: string to be cleaned

    Returns:
    clean_text: cleaned text
    """
    clean_text = text.strip()
    clean_text = clean_text.replace('\n', '')
    clean_text = clean_text.replace('\t', '')
    return clean_text

def clean_date(date):
    """
    This function cleans the date

    Args:
    date: date to be cleaned

    Returns:
    cleaned_date: cleaned date
    """    
    df = pd.Series(date)
    df = pd.to_datetime(df)
    df = df.dt.strftime('%Y-%m-%d')
    cleaned_date = df.iloc[0]
    return cleaned_date

def clean_dict(a_dict):
    """
    This function cleans meta info and 
    parties info dictionaries.

    Args:
    a_dict: dict to be cleaned

    Returns:
    a_dict: cleaned dict
    """    
    for key,value in a_dict.items():
        clean_value = clean_text(value)        

        if key == "Date Delivered: ":
            clean_value = clean_date(value)

        a_dict.update({key:clean_value})
    return a_dict

def clean_case(case_dict):

    """
    This functions cleans text inside a case dictionary.

    Args:
    case_dict: A dictionary containing the case

    Returns:
    case_dict: A cleaned up dictionary with the case.
    """

    for key,value in case_dict.items():
        if type(value) is dict:
            value = clean_dict(value)
            
        elif type(value) is str:
            value = clean_text(value)
            
        elif type(value) is list:
            clean_value = []
            for v in value:
                clean_v = clean_text(v)
                clean_value.append(clean_v)
            value = clean_value
        case_dict.update({key:value})

    return case_dict

def clean_cases(cases):
    """
    This functions cleans up a list of cases

    Args:
    cases: A list of cases

    Returns:
    cleaned_cases: A list of cleaned cases
    """
    cleaned_cases = []
    for case in cases:
        cleaned_case = clean_case(case)
        cleaned_cases.append(cleaned_case)
    return cleaned_cases