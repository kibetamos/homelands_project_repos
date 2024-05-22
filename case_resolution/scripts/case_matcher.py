"""
This module is for performing case resolution .
"""
import json
from fuzzywuzzy import fuzz
from fuzzywuzzy import process
from collections import Counter
import re


stored_cases = []
"""
This module is used to resolve related case
"""
class CaseResolver:
    
    def exact_match(self, old, new):
        """
        This function checks whether the two
        pieces of text match word for word.
        
        Args:
        old: piece of text
        new: piece of text

        Returns whether they are the same.
        """
        clean_old = old.replace(' ', '')
        clean_old = clean_old.lower()
        clean_new = new.replace(' ', '')
        clean_new = clean_new.lower()
        return clean_new==clean_old

    def get_fuzzy_ratio(self, old, new):
        """
        This function returns ration of closeness
        between two pieces of text using fuzzy
        logic.
        
        Args:
        old: piece of text
        new: piece of text

        Returns ratio of closeness.
        """
        if old!=None and new!=None:
            fuzz_ratio = fuzz.token_sort_ratio(old.lower(), new.lower())
            return fuzz_ratio
        else:
            return 0

    def match_same_case(self, case_number):

        """
        This function gets case numbers that match 
        other case numbers exactly.

        Args:
        case_number: Case number of the new case.

        Returns:
        old_case_number: Case number of an old case
                         that matches new case numbers
        """

        for case in stored_cases:
            old_case_number = case.get('case_number')
            if self.exact_match(old_case_number, case_number):
                return old_case_number 

    def relate_parties(self, party_info, old_party_info):
        """
        This function checks if an incoming case is 
        related an older case.

        Args:
        party_info: A dictionary of party details for an
                    incoming case.

        old_party_info: A dictionary of party details for an
                    older case.

        Returns:
        old_case_number: Case number of an old case
                         that matches new case numbers
        """
        # Get score of relationship between cases
        p_score = 0

        # For each party in party info in both cases
        for _,p in party_info.items():
            for _,old_p in old_party_info.items():

                # Clean out the texts
                p = re.sub(r'\(.*?\)\ *', '',p.lower())
                old_p = re.sub(r'\(.*?\)\ *', '',old_p.lower())

                # Remove common parties from being compared
                if 'assembly of' not in p and 'assembly of' not in old_p:

                    # Add score if greater than 70%
                    if self.get_fuzzy_ratio(p, old_p)>70:
                        p_score+=1
        return p_score>1


    def get_related_cases_score(self, case, older_case):
        related_score = 0
        if self.get_fuzzy_ratio(case['Judge(s): '].lower(), older_case['Judge(s): '].lower())>90:
            related_score+=1
        if case.get("Advocates:") and older_case.get("Advocates:"):
            if self.get_fuzzy_ratio(case["Advocates:"], older_case["Advocates:"])>90:
                related_score+=2
        p = re.sub(r'\(.*?\)\ *', '',case["Parties: "].lower())
        old_p = re.sub(r'\(.*?\)\ *', '',older_case["Parties: "].lower())
        if self.get_fuzzy_ratio(p, old_p)>90:
            related_score+=3  
        return self.get_fuzzy_ratio(p, old_p)
