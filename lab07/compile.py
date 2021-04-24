#!/usr/bin/env python3

import re
from bs4 import BeautifulSoup as bs
from jinja2 import Environment, FileSystemLoader, select_autoescape


r = re.compile('^ +', re.MULTILINE)


def prettify(html: str) -> str:
    soup = bs(html, 'html.parser')
    return r.sub(lambda x: '\t' * len(x.group()), soup.prettify(formatter='html5'))
    #                                                                      html5
    # this will work correctly with <option selected></option> for bs4 4.10.0
    # the latest version for now is 4.9.3
    # :(


def main() -> None:
    environment = Environment(
        loader=FileSystemLoader('.'),
        autoescape=select_autoescape(['html', 'xml']),
    )

    template = environment.get_template('template.html')
    rendered_page = prettify(template.render())

    with open('index.html', 'w', encoding='utf-8') as file:
        file.write(rendered_page)


if __name__ == '__main__':
    main()
