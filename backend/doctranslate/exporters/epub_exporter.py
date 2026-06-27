import os
import ebooklib
from ebooklib import epub
from doctranslate.schema import UnifiedDocument, DocumentBlock
from doctranslate.exporters.html_exporter import export_html

def export_epub(
    template_path: str,
    output_path: str,
    translated_doc: UnifiedDocument,
    mode: str = "mono"  # "mono" or "dual"
):
    """
    Export the translated document to EPUB.
    Loads the original EPUB as a template, translates each HTML item, and saves it.
    """
    if not os.path.exists(template_path):
        raise FileNotFoundError(f"Template EPUB file not found: {template_path}")

    import warnings
    warnings.filterwarnings("ignore", category=UserWarning)

    book = epub.read_epub(template_path)

    # Group translated blocks by the EPUB item ID they belong to
    blocks_by_item_id = {}
    for block in translated_doc.blocks:
        item_id = block.attributes.get("epub_item_id")
        if item_id:
            if item_id not in blocks_by_item_id:
                blocks_by_item_id[item_id] = []
            blocks_by_item_id[item_id].append(block)

    # Process each document item
    for item in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
        item_id = item.get_id()
        if item_id not in blocks_by_item_id:
            continue

        html_content = item.get_content().decode("utf-8")
        
        # We need to pass a UnifiedDocument containing only the blocks for this item
        # and we need to map their IDs back to local IDs (stripping the "epub_item_id" prefix)
        item_blocks = []
        prefix = f"epub_{item_id}_"
        for block in blocks_by_item_id[item_id]:
            local_block = block.model_copy()
            if local_block.id.startswith(prefix):
                local_block.id = local_block.id[len(prefix):]
            item_blocks.append(local_block)

        item_doc = UnifiedDocument(blocks=item_blocks)
        
        # Reconstruct the HTML
        translated_html = export_html(html_content, item_doc, mode)
        
        # Update content
        item.set_content(translated_html.encode("utf-8"))

    # Save to output path
    epub.write_epub(output_path, book)
