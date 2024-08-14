import os

def on_page_markdown(markdown, page, config, files):
    if page.edit_url:
        page.edit_url = page.edit_url.replace('/index/_edit', '/Home/_edit')
    return markdown
