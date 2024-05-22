import requests
from bs4 import BeautifulSoup
import json

# Set the number of request retries
requests.adapters.DEFAULT_RETRIES = 10

# Define the url for the acts
ACTS_URL = "http://kenyalaw.org:8181/exist/kenyalex/actview.xql?actid="
ACTS_NO_PATH = "/content/drive/MyDrive/Acts/split_list.txt"
ACTS_JSON_PATH = "/content/drive/MyDrive/Acts/acts_test2.json"


def clean_content(contents):
    """
    This function cleans the section content.

    Args:
    contents: The paragraphs of the section content.

    Returns:
    content_string: A clean string with the section content.
    """
    content_string = ''
    for content in contents:
        content_p = content.find_all('p')
        if content_p:
            for p in content_p:

                # Remove new lines
                content_string = content_string + p.get_text().replace('\n', '')

    return content_string


def get_section(section):
    """
    This function extracts a section of an act.

    Args:
    section: A HTML element with a section

    Returns:
    section_dict: A dictionary with a section
    """

    # Define section dictionary
    section_dict = {}

    # Add the section content
    section_content = section.find_all("div", class_="content")
    clean_section_content = clean_content(section_content)

    # Extract the title of the section
    section_title = section.find_all("div")

    # If there is a section title update the dictionary
    if len(section_title) > 0:
        if section_title[0] != section_content:
            section_title = section_title[0].get_text().strip('\n')
            section_dict.update({'section_title': section_title})

    # Extract section number
    section_number = section.find_all("td", class_="num")

    # If there is a section number update dictionary
    if len(section_number) > 0:
        section_number = section_number[0].get_text().replace('.', '')
        section_dict.update({'section_number': section_number})

    # Add the section content
    section_content = section.find_all("div", class_="content")
    clean_section_content = clean_content(section_content)
    section_dict.update({'section_content': clean_section_content})

    return section_dict


def get_act_parts(part_soup, act_title, act_no):
    """
    This function gets all the parts of an act.

    Args:
    part_soup: The HTML Page of the Act
    act_title: The extracted title of the Act
    act_no: The extracted Act No
    """

    # Get the HTML elements that contain parts
    parts = part_soup.body.find_all("div", class_="part")

    # If there are parts extract the sections in the parts
    if len(parts) != 0:
        for part in parts:

            # Get the heading the Part
            part_heading = part.find_all("div", class_="heading-part")[0]

            # Clean out the heading
            clean_part_heading = part_heading.get_text().strip('\n')

            # Get the sections in the part
            sections = part.find_all("div", class_="heading-section")

            # If there are sections extract each section
            if len(sections) != 0:
                for section in sections:
                    section_dict = get_section(section)

                    # Add the titles and numbers to the section
                    section_dict.update({'part': clean_part_heading})
                    section_dict.update({'act_title': act_title})
                    section_dict.update({'act_no': act_no})

                    # Append extracted section to sections list
                    sections_list.append(section_dict)

            # Otherwise extract the part as a section
            else:
                section_dict = get_section(part)

                # Add the titles and numbers to the section
                section_dict.update({'part': clean_part_heading})
                section_dict.update({'act_title': act_title})
                section_dict.update({'act_no': act_no})

                # Append extracted section to sections list
                sections_list.append(section_dict)

    # If there are no parts extract the sections directly
    else:
        section_dict = get_section(part_soup)
        clean_part_heading = part_soup.title.get_text().strip('\n')
        section_dict.update({'part': clean_part_heading})
        section_dict.update({'act_title': act_title})
        section_dict.update({'act_no': act_no})
        sections_list.append(section_dict)


def get_act(part_url):
    """
    This function scrapes a specific act.

    Args:
    part_url: The URL of the act

    """

    # Get the page
    page = requests.get(part_url)
    if page.ok:

        part_soup = BeautifulSoup(page.content, 'html.parser')

        # Extract Act No
        act_no = part_soup.title.get_text().strip('\n')

        # Extract Act Title
        act_title = part_soup.find_all(
            "div", class_="act-title")[0].get_text().strip('\n').strip(' ')
        if act_no != "XQueryServlet Error":

            # Get all the parts of an act
            get_act_parts(part_soup, act_title, act_no)


def get_acts():
    """
    This function gets all the sections of all acts.
    It used a text file that contains all the acts in Kenya.
    The function reads from the file and depending on the format
    of the Act No scrapes from the URL
    """

    # Open file with all act numbers
    f = open(ACTS_NO_PATH, 'r')
    lines = f.readlines()

    # For each line in the txt file get the act no
    for line in lines:

        no = line.strip('\n').split(' ')
        if len(no) == 4:

            # Extract those with format No xx of xxxx
            part_url = ACTS_URL+"No.%20"+str(no[1])+"%20of%20"+str(no[-1])
            get_act(part_url)

        if len(no) == 2:

            # Extract those with format CAP xxx
            part_url = ACTS_URL+"CAP.%20"+str(no[-1])
            get_act(part_url)


def main():
    global sections_list

    # Define list to hold sections
    sections_list = []

    # Get all the sections of all the act
    get_acts()

    # Store scraped case in JSON file
    with open(ACTS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(sections_list, f, ensure_ascii=False, indent=4)


if __name__ == '__main__':
    main()
