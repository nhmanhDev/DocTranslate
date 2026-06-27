import os
import sys
import argparse
import asyncio
import logging
from pathlib import Path

# Add project root to path to ensure imports work correctly
sys.path.append(str(Path(__file__).resolve().parent.parent))
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

from doctranslate.schema import UnifiedDocument
from doctranslate.translator import OllamaTranslator
from doctranslate.parsers.docx_parser import parse_docx
from doctranslate.exporters.docx_exporter import export_docx
from doctranslate.parsers.pptx_parser import parse_pptx
from doctranslate.exporters.pptx_exporter import export_pptx
from doctranslate.parsers.epub_parser import parse_epub
from doctranslate.exporters.epub_exporter import export_epub
from doctranslate.parsers.html_parser import parse_html_file
from doctranslate.exporters.html_exporter import export_html_file

# PDF and BabelDOC imports
from babeldoc.format.pdf.translation_config import TranslationConfig, WatermarkOutputMode
from babeldoc.translator.translator import OpenAITranslator
from babeldoc.docvision.doclayout import OnnxModel
import babeldoc.format.pdf.high_level
from doctranslate.mineru_integration import MinerULayoutModel

# Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("DocTranslate")

async def translate_pdf_file(file_path: str, args):
    """Translate a PDF file using BabelDOC, MinerU layout, and local Ollama."""
    logger.info(f"Translating PDF: {file_path}")
    
    # 1. Initialize Ollama Translator compatible with OpenAI Client
    translator = OpenAITranslator(
        lang_in=args.lang_in,
        lang_out=args.lang_out,
        model=args.ollama_model,
        base_url=args.ollama_url,
        api_key=args.api_key,
        ignore_cache=True,
    )
    
    # 2. Setup DocLayoutModel (MinerU 2.5 Pro VLM adapter or Default ONNX)
    if args.mineru_api:
        logger.info(f"Using MinerU 2.5 Pro adapter with API: {args.mineru_api}")
        doc_layout_model = MinerULayoutModel(mineru_api_url=args.mineru_api)
    else:
        logger.info("Using MinerU 2.5 Pro adapter locally via python...")
        # Verify if mineru packages can be loaded, otherwise fallback to ONNX
        try:
            import magic_pdf
            doc_layout_model = MinerULayoutModel()
        except ImportError:
            logger.warning("magic_pdf/mineru package not found. Falling back to default BabelDOC ONNX layout model.")
            doc_layout_model = OnnxModel.from_pretrained()

    # Determine Watermark Mode
    watermark_output_mode = WatermarkOutputMode.NoWatermark
    
    # Determine Output directory
    output_dir = args.output_dir if args.output_dir else os.path.dirname(file_path)

    # Determine dual/mono output options
    no_dual = args.mode == "mono"
    no_mono = args.mode == "dual"

    # 3. Create BabelDOC Translation Config
    config = TranslationConfig(
        input_file=file_path,
        font=None,
        output_dir=output_dir,
        translator=translator,
        term_extraction_translator=translator,
        debug=args.debug,
        lang_in=args.lang_in,
        lang_out=args.lang_out,
        no_dual=no_dual,
        no_mono=no_mono,
        doc_layout_model=doc_layout_model,
        watermark_output_mode=watermark_output_mode,
        auto_extract_glossary=False,  # Skip glossary extraction to speed up local inference
    )

    # Initialize font mapper
    babeldoc.format.pdf.high_level.init()
    if hasattr(doc_layout_model, "init_font_mapper"):
        doc_layout_model.init_font_mapper(config)

    # 4. Execute asynchronous BabelDOC translation
    logger.info("Executing PDF translation stages...")
    async for event in babeldoc.format.pdf.high_level.async_translate(config):
        if event["type"] == "progress_update":
            logger.info(f"[{event['stage']}] Progress: {event['stage_current']}/{event['stage_total']} ({event['overall_progress']}%)")
        elif event["type"] == "error":
            logger.error(f"PDF Translation Error: {event['error']}")
            break
        elif event["type"] == "finish":
            result = event["translate_result"]
            logger.info(f"PDF Translation Finished! Output paths:\nDual: {result.mono_pdf_path}\nMono: {result.dual_pdf_path}")
            break

def translate_reflowable_file(file_path: str, args):
    """Translate reflowable text files (DOCX, PPTX, EPUB, HTML) via Unified Document Model."""
    ext = os.path.splitext(file_path.lower())[1]
    logger.info(f"Parsing format {ext} for: {file_path}")

    # 1. Parse File into Unified Document Model
    if ext == ".docx":
        unified_doc = parse_docx(file_path)
    elif ext == ".pptx":
        unified_doc = parse_pptx(file_path)
    elif ext == ".epub":
        unified_doc = parse_epub(file_path)
    elif ext in [".html", ".htm"]:
        unified_doc = parse_html_file(file_path)
    else:
        logger.error(f"Unsupported format: {ext}")
        return

    logger.info(f"Extraction successful. Extracted {len(unified_doc.blocks)} content blocks.")

    # 2. Initialize Ollama Translator
    translator = OllamaTranslator(
        model_name=args.ollama_model,
        base_url=args.ollama_url,
        api_key=args.api_key,
        lang_in=args.lang_in,
        lang_out=args.lang_out,
    )

    # Test connection
    if not translator.test_connection():
        logger.warning("Ollama API is not reachable. Attempting to proceed anyway...")

    # Extract all text blocks that need translation
    blocks_to_translate = []
    
    def collect_translatable_blocks(blocks):
        for block in blocks:
            # We translate direct text contents
            if block.content and block.type != "table":
                blocks_to_translate.append(block)
            if block.table_rows:
                for row in block.table_rows:
                    for cell in row:
                        collect_translatable_blocks(cell)

    collect_translatable_blocks(unified_doc.blocks)

    if not blocks_to_translate:
        logger.warning("No translatable text elements found in document.")
        return

    logger.info(f"Translating {len(blocks_to_translate)} text blocks via Ollama...")

    # 3. Perform Batch translation of texts
    texts = [b.content for b in blocks_to_translate]
    translated_texts = translator.translate_batch(texts)

    # Match translations back to the blocks
    for block, translated in zip(blocks_to_translate, translated_texts):
        block.translated_content = translated

    logger.info("Translation complete. Reconstructing outputs...")

    # Determine Output Paths and Modes
    output_dir = args.output_dir if args.output_dir else os.path.dirname(file_path)
    os.makedirs(output_dir, exist_ok=True)
    base_name = os.path.splitext(os.path.basename(file_path))[0]

    modes = []
    if args.mode in ["mono", "both"]:
        modes.append("mono")
    if args.mode in ["dual", "both"]:
        modes.append("dual")

    # 4. Export to translated formats
    for mode in modes:
        suffix = f".{args.lang_out}.{mode}{ext}"
        out_path = os.path.join(output_dir, base_name + suffix)
        
        logger.info(f"Exporting [{mode.upper()}] to: {out_path}")
        
        if ext == ".docx":
            export_docx(file_path, out_path, unified_doc, mode=mode)
        elif ext == ".pptx":
            export_pptx(file_path, out_path, unified_doc, mode=mode)
        elif ext == ".epub":
            export_epub(file_path, out_path, unified_doc, mode=mode)
        elif ext in [".html", ".htm"]:
            export_html_file(file_path, out_path, unified_doc, mode=mode)

    logger.info("All reflowable exports finished successfully!")

def run_web_server(args):
    """Compile the React frontend UI and run the local FastAPI web server."""
    root_dir = Path(__file__).resolve().parent.parent.parent
    frontend_dir = root_dir / "frontend"
    frontend_dist = frontend_dir / ".output" / "public"
    if not frontend_dist.exists():
        frontend_dist = frontend_dir / "dist" / "client"
    
    # Check if we need to build
    if not frontend_dist.exists() or args.force_build:
        logger.info("Frontend static assets not found. Building Lovable React application...")
        import subprocess
        # Check if bun is installed and build
        try:
            subprocess.run(["bun", "run", "build"], cwd=str(frontend_dir), check=True, shell=True)
            logger.info("Frontend React app compiled successfully!")
        except Exception as e:
            logger.error(f"Failed to build React frontend: {e}")
            logger.warning("Starting API endpoints only.")

    import uvicorn
    import webbrowser
    import time
    import threading

    # Auto open browser in a separate thread
    def open_browser():
        time.sleep(1.5)
        webbrowser.open(f"http://{args.host}:{args.port}")

    threading.Thread(target=open_browser, daemon=True).start()

    logger.info(f"Starting DocTranslate Web Server on {args.host}:{args.port}")
    # Import app dynamically to ensure it loads with correct packages
    from doctranslate.web_server import app
    uvicorn.run(app, host=args.host, port=args.port, log_level="info")

def main():
    parser = argparse.ArgumentParser(description="DocTranslate - Document Conversion & Translation tool.")
    subparsers = parser.add_subparsers(dest="command", help="Subcommand: translate (default) or web")

    # Translate Subparser (Runs file translation via CLI)
    translate_parser = subparsers.add_parser("translate", help="Translate file(s) directly from command line.")
    translate_parser.add_argument("files", nargs="+", help="Paths to files to translate (.pdf, .docx, .pptx, .epub, .html).")
    translate_parser.add_argument("-li", "--lang-in", default="en", help="Source language code (default: en).")
    translate_parser.add_argument("-lo", "--lang-out", default="vi", help="Target language code (default: vi).")
    translate_parser.add_argument("-o", "--output-dir", help="Directory to save output files. Defaults to input directory.")
    translate_parser.add_argument("--mode", choices=["mono", "dual", "both"], default="both", help="Output layout: mono, dual, or both (default: both).")
    translate_parser.add_argument("--ollama-model", default="qwen2.5:8b", help="Local Ollama model name (default: qwen2.5:8b).")
    translate_parser.add_argument("--ollama-url", default="http://localhost:11434/v1", help="Ollama API base URL (default: http://localhost:11434/v1).")
    translate_parser.add_argument("--api-key", default="ollama", help="API key for local model server (e.g. Unsloth sk-unsloth-...).")
    translate_parser.add_argument("--mineru-api", help="Optional URL to a local MinerU API server (e.g. http://localhost:8000/parse).")
    translate_parser.add_argument("--debug", action="store_true", help="Enable debug logging.")

    # Web Subparser (Starts local web API and opens UI)
    web_parser = subparsers.add_parser("web", help="Start the web-based translation user interface.")
    web_parser.add_argument("--host", default="127.0.0.1", help="Host address to run the web server on (default: 127.0.0.1).")
    web_parser.add_argument("--port", type=int, default=8080, help="Port to run the web server on (default: 8080).")
    web_parser.add_argument("--force-build", action="store_true", help="Force rebuild of frontend React assets.")
    web_parser.add_argument("--debug", action="store_true", help="Enable debug logging.")

    # For backward compatibility: if first arg is not "web" or "translate",
    # default to "translate" command with the file arguments.
    args_list = sys.argv[1:]
    if len(args_list) > 0 and args_list[0] not in ["web", "translate", "-h", "--help"]:
        # Prepend 'translate' so parser handles it correctly
        args_list.insert(0, "translate")

    args = parser.parse_args(args_list)

    if args.debug:
        logger.setLevel(logging.DEBUG)

    if args.command == "web":
        run_web_server(args)
    elif args.command == "translate":
        for file_path in args.files:
            if not os.path.exists(file_path):
                logger.error(f"File not found: {file_path}")
                continue

            ext = os.path.splitext(file_path.lower())[1]
            
            if ext == ".pdf":
                asyncio.run(translate_pdf_file(file_path, args))
            elif ext in [".docx", ".pptx", ".epub", ".html", ".htm"]:
                translate_reflowable_file(file_path, args)
            else:
                logger.error(f"Unsupported file format: {ext}")
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
