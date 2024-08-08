import os

def on_page_markdown(markdown, page, config, files):
    if page.edit_url:
        page_name = os.path.splitext(os.path.basename(page.file.src_path))[0]
        page.edit_url = f"{config['repo_url']}/{page_name}/_edit"
        page.edit_url = page.edit_url.replace('/index/_edit', '/Home/_edit')
    return markdown
