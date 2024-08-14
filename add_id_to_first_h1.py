# Add id="top" to first <h1> tag which is page title added by mkdocs
def on_post_page(html, page, config):
    html = html.replace('<h1>', '<h1 id="top">', 1)
    return html
