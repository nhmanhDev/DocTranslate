import os
from bs4 import BeautifulSoup, NavigableString
from doctranslate.schema import UnifiedDocument, DocumentBlock

def parse_html(html_content: str) -> UnifiedDocument:
    """Parse HTML string into a UnifiedDocument model."""
    soup = BeautifulSoup(html_content, "lxml")
    unified_doc = UnifiedDocument(metadata={"format": "html"})
    
    block_counter = 0

    # We want to identify block-level or text-containing tags to translate
    # Tag list that usually contains translatable content:
    translatable_tags = {"p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "td", "th", "span", "div", "a", "figcaption", "title"}

    def has_direct_text(element):
        # Checks if element has direct text content and is not empty
        for child in element.children:
            if isinstance(child, NavigableString) and child.strip():
                return True
        return False

    # Find all elements recursively
    for element in soup.find_all(True):
        if element.name in translatable_tags and has_direct_text(element):
            # To prevent translating nested elements multiple times, we ensure we only translate the text nodes.
            # Get only direct text contents of this tag
            direct_text = "".join([child for child in element.children if isinstance(child, NavigableString)]).strip()
            if not direct_text:
                continue

            block_counter += 1
            # Store xpath or class info in attributes to reconstruct
            unified_doc.blocks.append(DocumentBlock(
                id=f"html_{block_counter}",
                type=element.name,
                content=direct_text,
                attributes={"tag": element.name}
            ))

    return unified_doc

def parse_html_file(file_path: str) -> UnifiedDocument:
    """Parse an HTML file into a UnifiedDocument."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"HTML file not found: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        html_content = f.read()
    doc = parse_html(html_content)
    doc.metadata["title"] = os.path.basename(file_path)
    return doc
