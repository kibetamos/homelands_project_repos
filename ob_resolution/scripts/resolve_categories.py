from fuzzywuzzy import fuzz
import json
import re
from spacy.lang.en import English

"""
This module extracts the acts or charges referenced.
"""

class CategoryResolver:

    # Class variable
    acts_path = "data/clean_acts.txt"

    # case-resolution/data/clean_acts.txt\

    

    # Extracts Act Of Parliament as categories
    with open(acts_path) as f:

        acts = f.readlines()
    
    def __init__(self):
        pass

    def clean_sentence(self, sentence):
        """
        Replace words used in acts provisions to be in title case.
        This will enable easy extraction. 

        Args:
        sentence: The sentence to be cleaned.

        Returns:
        cleaned_sentence: The cleaned sentence.
        """

        # Keywords that imply this is a provision
        keywords = ['order', 'rule', 'offence', 'section', 'act', 'sections', 'subsection', 'subsections']

        # Replace filler/stop words used with title case version
        cleaned_sentence = re.sub(r'\bof\b', 'Of', sentence)
        cleaned_sentence = re.sub(r'\bthe\b', 'The', cleaned_sentence)
        cleaned_sentence = re.sub(r'\band\b', 'And', cleaned_sentence)

        # Replace keywords with title case
        for keyword in keywords:
            regex_keyword = r'\b'+keyword+r'\b'
            cleaned_sentence = re.sub(regex_keyword, keyword.title(), cleaned_sentence)

        return cleaned_sentence

    def get_provision(self, text):

        """
        This function extracts pieces of text in title case that contains
        provisions keywords.

        Args:
        text: Piece of text to extract provisions

        Returns:
        results: List of extracted provisions
        """

        # List to hold extracted provisions
        results = []

        # List of keywords
        keywords = ['Order', 'Rule', 'Offence', 'Section', 'Act']

        # Initialize spacy corpus
        nlp = English()

        # Create pipe to split into sentences
        nlp.add_pipe(nlp.create_pipe('sentencizer'))
        
        doc = nlp(text)
        sentences = [sent.string.strip() for sent in doc.sents]

        # For each sentence extract provisions
        for sentence in sentences:

            # Look for keyword in sentence
            for keyword in keywords:
                if keyword.lower() in sentence.lower():

                    # Clean sentence in preparation for extracion
                    cleaned_sentence = self.clean_sentence(sentence)

                    # Regex pattern
                    civil_rex=r'(([A-Z][a-z]+)*([\(0-9\)])*(\([a-z.]+\))*([\s+,.]))*'
                    matches = re.finditer(civil_rex, cleaned_sentence)

                    # Add matches to results list
                    for match in matches:
                        match_word = match.group(0)
                        if keyword in match_word:
                            results.append(match_word)
        
        return results

    def clean_act(self, act):

        """
        This functions cleans up the extracted provisions in preparation for
        fuzzy matching.

        Args:
        act: Extracted provision

        Returns:
        cleaned_act: Cleaned extracted provision.
        """

        # Remove digits in acts
        cleaned_act = ' '.join([i for i in act.split() if not i.isdigit()])

        # Remove common words to remain with important act phrases
        keywords = ['order', 'rule', 'offence', 'section', 'act', 'sections',
            'subsection', 'subsections', 'and', 'of', 'the']
        for keyword in keywords:
            regex_keyword = r'\b'+keyword+r'\b'
            cleaned_act = re.sub(regex_keyword, '', cleaned_act)
            cleaned_act = re.sub(r'[0-9.,]', '', cleaned_act)
        return cleaned_act

    def resolve_acts(self, case_text):
        """
        This function matches extracted acts with known acts. 

        Args:
        case_text: Text that includes case judgements

        Returns:
        resolved_acts: List with matched acts
        """

        # List containing matched acts
        resolved_acts = []

        # Extract provisions
        extracted_acts = self.get_provision(case_text)

        # Get the score of each extracted act with list of acts 
        for act_title in self.acts:
            for extracted_act in extracted_acts:
                if act_title:

                    # Clean extracted acts
                    cleaned_extracted_act = self.clean_act(extracted_act.lower())

                    # Get the fuzzy score between extracted acts and available acts
                    fuzz_ratio = fuzz.token_sort_ratio(cleaned_extracted_act, act_title.lower())

                    # If the score is greater than 80 then append as a match
                    if fuzz_ratio>80:
                        act_title = act_title.rstrip().title()
                        resolved_acts.append(act_title)

        return resolved_acts

    def resolve_charges(self, case_text):
        """
        This function extracts criminal charges from text. 

        Args:
        case_text: Text that includes case judgements

        Returns:
        resolved_charges: List with matched charges
        """

        # List of charges extracted
        resolved_charges = []

        # Clean out text
        case_text = case_text.replace(':',' ')

        # Extract with regex pattern
        charge = re.search(r'(charged with three counts for the offences of|charged with an offence of|charged with the offence of|charged with|offence of|offences of) (.*?) (contrary to section|in violation of section|in the penal code)', case_text.lower())

        # Add matches
        if charge:
            if charge.group(2)!='':
                clean_charge = charge.group(2).title().replace("‘", "")
                clean_charge = clean_charge.replace("’", "")
                resolved_charges.append(clean_charge)

        return resolved_charges
