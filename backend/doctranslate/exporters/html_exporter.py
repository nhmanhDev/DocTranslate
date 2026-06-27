from bs4 import BeautifulSoup, NavigableString
from doctranslate.schema import UnifiedDocument

def export_html(
    original_html: str,
    translated_doc: UnifiedDocument,
    mode: str = "mono"  # "mono" or "dual"
) -> str:
    """
    Reconstruct translated HTML content using the original HTML as a template.
    Matches text elements in the exact same traversal order.
    """
    soup = BeautifulSoup(original_html, "lxml")
    
    blocks_by_id = {block.id: block for block in translated_doc.blocks}
    block_counter = 0

    translatable_tags = {"p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "td", "th", "span", "div", "a", "figcaption", "title"}

    def has_direct_text(element):
        for child in element.children:
            if isinstance(child, NavigableString) and child.strip():
                return True
        return False

    # Traverse elements in the exact same order
    for element in soup.find_all(True):
        if element.name in translatable_tags and has_direct_text(element):
            # Find the text parts that belong to NavigableStrings
            # We want to replace these NavigableStrings
            text_nodes = [child for child in element.children if isinstance(child, NavigableString) and child.strip()]
            if not text_nodes:
                continue

            block_counter += 1
            block_id = f"html_{block_counter}"
            block = blocks_by_id.get(block_id)
            if not block or not block.translated_content:
                continue

            translated_text = block.translated_content

            if mode == "mono":
                # Replace the content of text nodes
                # For simplicity, if there is a single text node, replace it.
                # If there are multiple, replace the first and clear the others to maintain structure.
                text_nodes[0].replace_with(translated_text)
                for node in text_nodes[1:]:
                    node.replace_with("")
            elif mode == "dual":
                # In HTML, dual mode is beautiful because we can wrap the translation in a styled span (like gray text)
                # and insert it immediately after the original text node.
                # Let's construct a small span for translation:
                # original_text (translated_text)
                # We can append it at the end of the text node or create a span sibling.
                # Let's create a sibling tag:
                translation_span = soup.new_tag("span")
                translation_span["style"] = "color: #777777; font-style: italic; margin-left: 5px;"
                translation_span.string = f" ({translated_text})"
                # Insert the translation span after the last text node
                text_nodes[-1].insert_after(translation_span)

    return str(soup)

def export_html_file(
    template_path: str,
    output_path: str,
    translated_doc: UnifiedDocument,
    mode: str = "mono"
):
    """Write the translated HTML contents to a file."""
    with open(template_path, "r", encoding="utf-8") as f:
        original_html = f.read()
    translated_html = export_html(original_html, translated_doc, mode)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(translated_html)
