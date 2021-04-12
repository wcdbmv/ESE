#!/usr/bin/env python3

from jinja2 import Environment, FileSystemLoader, select_autoescape


def main() -> None:
    environment = Environment(
        loader=FileSystemLoader('.'),
        autoescape=select_autoescape(['html', 'xml']),
    )

    template = environment.get_template('template.html')
    rendered_page = template.render()

    with open('index.html', 'w', encoding='utf-8') as file:
        file.write(rendered_page)


if __name__ == '__main__':
    main()
