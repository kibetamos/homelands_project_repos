import requests
from bs4 import BeautifulSoup
import json
import logging
import re
from datetime import datetime
import pandas as pd

# Creating and Configuring Logger
logging.basicConfig(filename="cases.log", level=logging.DEBUG)


class CaseScaper:

    # init method or constructor
    def __init__(self, url):
        self.url = url
        self.parties_last_paragraph = 0

    def get_case(self):
        """
        This function extracts the case details from the 
        case page

        Args:
        url: The URL of the case

        Returns:
        case: A dictionary holding the case details
        """
        # Define dictionary to hold case
        case = {}

        # Get the page of a specific case
        page = requests.get(self.url)
        soup = BeautifulSoup(page.content, 'html.parser')

        try:
            # Get the url of the case
            case.update({'case_url': self.url})
        except Exception as e:
            logging.exception('Case Failed: '+self.url)

        try:
            # Get the case metadata
          meta_info = self.get_meta_info(soup)
          case.update({'meta_info': meta_info})
        except Exception as e:
            logging.exception('Case Failed: '+self.url)

        try:
            # Get the parties in the case
            parties_info = self.get_parties(soup)
            case.update({'parties_info': parties_info})
        except Exception as e:
            logging.exception('Case Failed: '+self.url)

        try:
            # Get the judgement of the case
            judgement = self.get_judgement(soup)
            case.update({'judgement': judgement})
        except Exception as e:
            logging.exception('Case Failed: '+self.url)

        try:
            # Get the case conclusion
            conclusion = self.get_conclusion(soup)
            case.update({'conclusion': conclusion})
        except Exception as e:
            logging.exception('Case Failed: '+self.url)
        try:
            # Get the referenced cases
            referenced_cases = self.get_referenced_cases(soup)
            case.update({'referenced_cases': referenced_cases})
        except Exception as e:
            logging.exception('Case Failed: '+self.url)

        return case

    def get_meta_info(self, soup):
        """
        This function extracts the meta data info from the 
        case page

        Args:
        soup: The HTML element with the case metadata

        Returns:
        meta_info: Dictionary of the case metadata
        """

        # Define dictionary to hold meta info
        meta_info = {}

        # Get the table that holds meta data
        meta_table = soup.find_all("table", class_="meta_info")

        # Get all the rows of the table
        meta_rows = meta_table[0].find_all("tr")[1:]

        # For each row the key is the table header and value is table data
        for meta_row in meta_rows:
            key = meta_row.find("th").get_text().strip(':  ')
            value = meta_row.find("td").get_text()
            # value = pd.to_datetime(value)
      
            meta_info.update({key: value})
        df = pd.Series(meta_info["Date Delivered"])
       
        df = pd.to_datetime(df)
        # df['Date Delivered:'] = pd.to_datetime(df['Date Delivered:'], format='%Y%m%d')
        df = df.dt.strftime('%Y-%m-%d')
        date_converted = df.iloc[0]

        meta_info.update({"Date Delivered": date_converted})
        return meta_info

            
    def check_parties(self, content):
        """
        This function checks whether the piece of text has
        parties.

        Args:
        content: The text to check

        Return whether it has parties or not.
        """

        # Change to lowercase
        content = content.lower()

        # Parties keywords
        parties_titles = ['appellant', 'respondent',
                          'petitioner', 'applicant', 'micus curiae', 'party', 'complainant', 'interested party'
                          ]

        # Check if keywords are in text
        for title in parties_titles:
            if (title in content.lower()) and ("……" in content or "..." in content):
                return True
        return False

    def clean_text(self, text):
        """
        This function cleans text and removes
        unnecessary characters such as newlines

        Args:
        text: The text to be cleaned

        Returns
        clean_text: Cleaned text
        """
        # Remove newlines
        clean_text = text.replace('\n', '')

        # Remove ellipses
        clean_text = text.replace('…', '...', '....')

        # Strip trailing characters
        clean_text = clean_text.strip('.')
        clean_text = clean_text.strip()
        return clean_text

    def check_party_separator(self, content):
        """
        This function checks whether the paragraph is 
        a parties seperator.

        Args:
        content: The text to check if it is a separator

        Returns whether the it is a separator
        """
        clean_content = re.sub('[^a-zA-Z]+', '', content.lower())

        # Separator keywords
        sep_keywords = ['versus', 'vs', 'and', 'v', 'between']

        # Check if keywords are in text
        for word in sep_keywords:
            if word == clean_content:
                return True
        return False

    def get_parties(self, soup):
        """
        This function extracts the case parties info from the 
        case page

        Args:
        soup: The HTML element with the parties info

        Returns:
        parties_info: Dictionary with the parties info
        """
        # Define dictionary to hold parties info
        parties_info = {}

        # Get div element with parties listing
        parties_div = soup.find_all("div", class_="akn-div parties-listing")

        # Check if parties-listing class exists
        if len(parties_div) > 0:
            self.extract_parties_from_listing(parties_info, parties_div)

        # If there is no parties listing div manually extract parties
        else:
            self.extract_parties_from_content(soup, parties_info)
        return parties_info

    def extract_parties_from_listing(self, parties_info, parties_div):

        # Get div with party listings
        parties_listing = parties_div[0].find_all(
            "div", class_="akn-div party-listing")

        # For each party listing, the value is the parties name and the key is the type of party they are
        for party_listing in parties_listing:
            parties_details = party_listing.find_all("div")
            value = parties_details[0].get_text()
            key = parties_details[-1].get_text()
            parties_info.update({key: value})

    def extract_parties_from_content(self, soup, parties_info):

        # List of paragraph numbers with parties
        party_nos = []

        # Get the div with case content
        case_content_div = soup.find_all("div", class_="case_content")

        # Get all the paragraphs
        case_content_p = case_content_div[0].find_all("p")

        # Look through all paragraphs and check if it lists parties
        for p_no, p in enumerate(case_content_p):
            p_text = p.get_text()
            if self.check_parties(p_text):
                # If paragraph is a party then append index
                party_nos.append(p_no)

        # Remove added paragraphs that are away from parties section
        party_nos.sort()
        for i, p_no in enumerate(party_nos[1:]):
            if p_no - party_nos[i] > 3:
                party_nos = party_nos[:i+1]
                break

        # Get list of paragraphs with parties
        parties_content = case_content_p[party_nos[0]:party_nos[-1]+1]

        # Set the paragraph number with the last party
        self.parties_last_paragraph = party_nos[-1]

        # Extract parties from the paragraphs
        value = ''
        for party_content in parties_content:
            party_data = self.clean_text(party_content.get_text()).split("..")
            if len(party_data) > 1:
                value = self.clean_text(
                    value + ' ' + self.clean_text(party_data[0]))
                key = self.clean_text(party_data[-1])

                parties_info.update({key: value})
                value = ''

            elif len(party_data) == 1:
                if not self.check_party_separator(party_data[0]):
                    value = self.clean_text(party_data[0])
                else:
                    value = ''

    def get_judgement(self, soup):
        """
        This function extracts judgement from the 
        case page

        Args:
        soup: The HTML element with the judgement

        Returns:
        judgement: List with paragraphs of judgement.
        """

        # Define list to hold judgement
        judgement = []

        # Get the div element with the judgement
        judgement_divs = soup.find_all("div", class_="akn-judgmentBody")
        if len(judgement_divs) > 0:
            judgement_div = judgement_divs[0]
            arguments_divs = judgement_div.find_all(
                "div", class_="akn-paragraph")
        else:
            # Get the div with case content
            case_content_div = soup.find_all("div", class_="case_content")

            # Get all the paragraphs
            case_content_p = case_content_div[0].find_all("p")

            # Select paragraphs with judgement only
            arguments_divs = case_content_p[self.parties_last_paragraph+1:]

        # For each argument append to judgement list
        for argument in arguments_divs:
            judgement.append(argument.get_text().strip('\n\t  …     '))
        return judgement

    def get_conclusion(self, soup):
        """
        This function extracts conclusion from the case page

        Args:
        soup: The HTML element with the conclusion

        Returns:
        conclusion: A string with the judges concluding remarks
        """
        # Get the div element with the conclusion
        conclusion_div = soup.find_all("div", class_="akn-conclusions")[0]
        conclusion = conclusion_div.get_text(separator=' ').strip('\n')
        return conclusion

    def get_referenced_cases(self, soup):
        """
        This function extracts related cases from the case page

        Args:
        soup: The HTML element with the conclusion

        Returns:
        related_cases: Key and value statements for the text and the link of the case
        """

        referenced_cases = {}

        # Get the div element with the judgement
        link_div = soup.find_all("div", class_="akn-judgmentBody")
        link_listings = link_div[0].find_all("a", class_="akn-ref")
        for link_listing in link_listings:
            key = link_listing.get_text()
            value = link_listing['href']
            referenced_cases.update({key: value})
        return referenced_cases

def main():

    # Define list to hold all cases
    cases = []

    # Iterate each url in the list of urls
    for i in range(232130, 232135):
        url = "http://kenyalaw.org/caselaw/cases/view/"+str(i)

        # Initialise case scraper instance
        case_scraper = CaseScaper(url)

        # Scrape each case
        case = case_scraper.get_case()

        cases.append(case)

    # Store scraped case in JSON file
    with open('v4.json', 'w', encoding='utf-8') as f:
        json.dump(cases, f, ensure_ascii=False, indent=4)

if __name__ == '__main__':
    main()