import logging
import os
import httpx
import numpy as np
import pymupdf
from collections.abc import Generator
from babeldoc.docvision.base_doclayout import DocLayoutModel, YoloResult, YoloBox
import babeldoc.format.pdf.document_il.il_version_1

logger = logging.getLogger(__name__)

# Map MinerU's block types to BabelDOC doclayout class indices
# Default classes:
# 0: 'title', 1: 'plain text', 2: 'abandon', 3: 'figure', 4: 'figure_caption', 
# 5: 'table', 6: 'table_caption', 7: 'table_footnote', 8: 'isolate_formula', 9: 'formula_caption'
MINERU_CLASS_MAP = {
    "title": 0,
    "text": 1,
    "paragraph": 1,
    "header": 2,
    "footer": 2,
    "abandon": 2,
    "figure": 3,
    "figure_caption": 4,
    "table": 5,
    "table_caption": 6,
    "table_footnote": 7,
    "equation": 8,
    "isolate_formula": 8,
    "formula_caption": 9,
}

class MinerULayoutModel(DocLayoutModel):
    def __init__(self, mineru_api_url: str = None):
        """
        mineru_api_url: URL to a MinerU local API endpoint (e.g. http://localhost:8000/parse)
        """
        self.mineru_api_url = mineru_api_url
        self._names = {
            0: 'title', 1: 'plain text', 2: 'abandon', 3: 'figure', 4: 'figure_caption',
            5: 'table', 6: 'table_caption', 7: 'table_footnote', 8: 'isolate_formula', 9: 'formula_caption'
        }

    @property
    def stride(self) -> int:
        return 32

    def _call_mineru_api(self, pdf_path: str) -> list:
        """Call local MinerU API to parse the PDF layout."""
        logger.info(f"Sending {pdf_path} to MinerU local API: {self.mineru_api_url}")
        try:
            with open(pdf_path, "rb") as f:
                files = {"file": f}
                response = httpx.post(self.mineru_api_url, files=files, timeout=600.0)
                if response.status_code == 200:
                    return response.json().get("pdf_info", [])
                else:
                    logger.error(f"MinerU API returned status code {response.status_code}: {response.text}")
                    return []
        except Exception as e:
            logger.error(f"Failed to communicate with MinerU API: {e}")
            return []

    def _run_mineru_locally(self, pdf_path: str) -> list:
        """Run MinerU model locally using magic_pdf/mineru package."""
        logger.info("Running MinerU 2.5 Pro locally in Python...")
        try:
            # Import magic-pdf / mineru packages dynamically
            from magic_pdf.data.data_reader_writer import FileBasedDataReaderWriter
            from magic_pdf.data.dataset import PymupdfDataset
            from magic_pdf.model.doc_analyze_by_custom_model import doc_analyze
            
            # Setup readers and parse document
            pdf_name = os.path.basename(pdf_path)
            pdf_dir = os.path.dirname(pdf_path)
            reader = FileBasedDataReaderWriter(pdf_dir)
            pdf_bytes = reader.read(pdf_name)
            
            # Initialize PymupdfDataset
            ds = PymupdfDataset(pdf_bytes)
            # Run layout analysis
            # Note: doc_analyze is the core parsing function in mineru/magic_pdf
            # It analyzes layout, tables, formulas, and OCR
            pdf_info = doc_analyze(ds, ocr=True)
            return pdf_info
        except Exception as e:
            logger.error(f"Failed to run MinerU locally: {e}. Ensure mineru is installed with 'pip install mineru[all]'.")
            return []

    def handle_document(
        self,
        pages: list[babeldoc.format.pdf.document_il.il_version_1.Page],
        mupdf_doc: pymupdf.Document,
        translate_config,
        save_debug_image,
    ) -> Generator[
        tuple[babeldoc.format.pdf.document_il.il_version_1.Page, YoloResult], None, None
    ]:
        pdf_path = mupdf_doc.name
        pdf_info = []

        if self.mineru_api_url:
            pdf_info = self._call_mineru_api(pdf_path)
        else:
            pdf_info = self._run_mineru_locally(pdf_path)

        # Convert MinerU's output into YoloResults format for each page
        # If pdf_info is empty, we fall back to an empty result so BabelDOC's fallback parser takes over.
        blocks_by_page = {}
        for block in pdf_info:
            page_idx = block.get("page_idx", 0)
            if page_idx not in blocks_by_page:
                blocks_by_page[page_idx] = []
            blocks_by_page[page_idx].append(block)

        for page in pages:
            translate_config.raise_if_cancelled()
            page_num = page.page_number
            mineru_blocks = blocks_by_page.get(page_num, [])

            boxes_data = []

            # Page size in points
            mupdf_page = mupdf_doc[page_num]
            page_width = mupdf_page.rect.width
            page_height = mupdf_page.rect.height

            for b in mineru_blocks:
                bbox = b.get("bbox")  # normalized [x0, y0, x1, y1] on 0-1000 scale
                block_type = b.get("type", "text")
                
                if not bbox or len(bbox) != 4:
                    continue

                cls_idx = MINERU_CLASS_MAP.get(block_type, 1) # default to text (1)

                # Convert normalized coords [0, 1000] back to page points
                x0 = bbox[0] * page_width / 1000.0
                y0 = bbox[1] * page_height / 1000.0
                x1 = bbox[2] * page_width / 1000.0
                y1 = bbox[3] * page_height / 1000.0

                # YoloBox format expects [x0, y0, x1, y1, confidence, class]
                conf = b.get("score", 0.9)
                boxes_data.append([x0, y0, x1, y1, conf, cls_idx])

            # Convert to numpy array
            if boxes_data:
                np_boxes = np.array(boxes_data, dtype=np.float32)
            else:
                np_boxes = np.empty((0, 6), dtype=np.float32)

            yolo_result = YoloResult(boxes_data=np_boxes, names=self._names)

            # Draw debug image if debug mode is active
            pix = mupdf_page.get_pixmap()
            image = np.frombuffer(pix.samples, np.uint8).reshape(
                pix.height,
                pix.width,
                3,
            )[:, :, ::-1]

            save_debug_image(image, yolo_result, page_num + 1)

            yield page, yolo_result
