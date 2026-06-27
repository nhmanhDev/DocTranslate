import os
import ebooklib
from ebooklib import epub
from doctranslate.schema import UnifiedDocument, DocumentBlock
from doctranslate.parsers.html_parser import parse_html

def parse_epub(file_path: str) -> UnifiedDocument:
    """Parse an EPUB file and extract text from all HTML chapters into a UnifiedDocument."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"EPUB file not found: {file_path}")

    # EbookLib can be noisy with warnings, we suppress them if necessary
    import warnings
    warnings.filterwarnings("ignore", category=UserWarning)
    warnings.filterwarnings("ignore", category=FutureWarning)

    book = epub.read_epub(file_path)
    unified_doc = UnifiedDocument(metadata={
        "title": book.get_metadata('DC', 'title')[0][0] if book.get_metadata('DC', 'title') else os.path.basename(file_path),
        "format": "epub"
    })

    block_counter = 0

    # Iterate through documents (chapters)
    for item in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
        item_id = item.get_id()
        html_content = item.get_content().decode("utf-8")
        
        # Use our HTML parsing logic on the chapter HTML
        chapter_doc = parse_html(html_content)
        
        # Add item ID prefix to each block ID to keep them unique across the EPUB
        for block in chapter_doc.blocks:
            block_counter += 1
            block.id = f"epub_{item_id}_{block.id}"
            # Keep slide/item name in attributes
            block.attributes["epub_item_id"] = item_id
            unified_doc.blocks.append(block)

    return unified_doc
