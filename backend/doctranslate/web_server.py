import os
import uuid
import shutil
import logging
import asyncio
from pathlib import Path
from typing import Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Imports from doctranslate
from doctranslate.schema import UnifiedDocument
from doctranslate.translator import OllamaTranslator
from doctranslate.parsers.docx_parser import parse_docx
from doctranslate.exporters.docx_exporter import export_docx
from doctranslate.parsers.pptx_parser import parse_pptx
from doctranslate.exporters.pptx_exporter import export_pptx
from doctranslate.parsers.epub_parser import parse_epub
from doctranslate.exporters.epub_exporter import export_epub
from doctranslate.parsers.html_parser import parse_html, parse_html_file
from doctranslate.exporters.html_exporter import export_html_file

# Imports from BabelDOC
from babeldoc.format.pdf.translation_config import TranslationConfig, WatermarkOutputMode
from babeldoc.translator.translator import OpenAITranslator
from babeldoc.docvision.doclayout import OnnxModel
import babeldoc.format.pdf.high_level
from doctranslate.mineru_integration import MinerULayoutModel

# Setup logging
logger = logging.getLogger("DocTranslateWeb")

app = FastAPI(title="DocTranslate API")

# Enable CORS for frontend development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
WORKSPACE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = WORKSPACE_DIR / "doctranslate_uploads"
OUTPUT_DIR = WORKSPACE_DIR / "doctranslate_outputs"
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# In-memory database of tasks
# Structure: { task_id: { "status": "processing" | "done" | "error", "progress": 0-100, "stage": "parsing" | "translating" | "done", "error": str, "file_name": str, "ext": str, "lang_in": str, "lang_out": str, "mode": str, "output_files": { "mono": str, "dual": str } } }
tasks_db: Dict[str, Dict[str, Any]] = {}

class SettingsModel(BaseModel):
    ollama_model: str = "qwen2.5:8b"
    ollama_url: str = "http://localhost:11434/v1"
    api_key: Optional[str] = "ollama"
    mineru_api: Optional[str] = None

# Default settings
global_settings = {
    "ollama_model": "qwen2.5:8b",
    "ollama_url": "http://localhost:11434/v1",
    "api_key": "ollama",
    "mineru_api": ""
}

@app.get("/api/settings")
def get_settings():
    return global_settings

@app.post("/api/settings")
def save_settings(settings: SettingsModel):
    global_settings["ollama_model"] = settings.ollama_model
    global_settings["ollama_url"] = settings.ollama_url
    global_settings["api_key"] = settings.api_key or "ollama"
    global_settings["mineru_api"] = settings.mineru_api or ""
    return {"status": "success", "settings": global_settings}

@app.get("/api/tasks/{task_id}")
def get_task_status(task_id: str):
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks_db[task_id]

@app.get("/api/tasks")
def list_tasks():
    # Return tasks sorted by timestamp or ID
    return [{"id": k, **v} for k, v in tasks_db.items()]

async def run_pdf_translation(task_id: str, input_path: str, lang_in: str, lang_out: str, mode: str, ollama_model: str, ollama_url: str, api_key: str, mineru_api: str):
    """Asynchronously execute PDF translation via BabelDOC."""
    try:
        tasks_db[task_id]["stage"] = "parsing"
        tasks_db[task_id]["progress"] = 5
        
        # 1. Initialize Ollama OpenAI Translator
        translator = OpenAITranslator(
            lang_in=lang_in,
            lang_out=lang_out,
            model=ollama_model,
            base_url=ollama_url,
            api_key=api_key,
            ignore_cache=True,
        )

        # 2. Setup layout model
        if mineru_api:
            logger.info(f"Using MinerU 2.5 Pro adapter with API: {mineru_api}")
            doc_layout_model = MinerULayoutModel(mineru_api_url=mineru_api)
        else:
            try:
                import magic_pdf
                doc_layout_model = MinerULayoutModel()
            except ImportError:
                doc_layout_model = OnnxModel.from_pretrained()

        no_dual = mode == "mono"
        no_mono = mode == "dual"

        # 3. Create Translation Config
        config = TranslationConfig(
            input_file=input_path,
            font=None,
            output_dir=str(OUTPUT_DIR),
            translator=translator,
            term_extraction_translator=translator,
            debug=False,
            lang_in=lang_in,
            lang_out=lang_out,
            no_dual=no_dual,
            no_mono=no_mono,
            doc_layout_model=doc_layout_model,
            watermark_output_mode=WatermarkOutputMode.NoWatermark,
            auto_extract_glossary=False,
        )

        # Initialize font mapper
        babeldoc.format.pdf.high_level.init()
        if hasattr(doc_layout_model, "init_font_mapper"):
            doc_layout_model.init_font_mapper(config)

        # 4. Consume events from async_translate
        async for event in babeldoc.format.pdf.high_level.async_translate(config):
            if event["type"] == "progress_update":
                tasks_db[task_id]["progress"] = int(event["overall_progress"])
                # Map stages: "ILTranslator" or "Translate Paragraphs" -> translating, otherwise parsing
                stage_name = event["stage"]
                if "Translate Paragraphs" in stage_name or "ILTranslator" in stage_name:
                    tasks_db[task_id]["stage"] = "translating"
                else:
                    tasks_db[task_id]["stage"] = "parsing"
            elif event["type"] == "error":
                raise RuntimeError(event["error"])
            elif event["type"] == "finish":
                res = event["translate_result"]
                
                # Retrieve output files generated
                outputs = {}
                if res.mono_pdf_path and os.path.exists(res.mono_pdf_path):
                    # Move to output dir if not already there, and store relative name
                    outputs["mono"] = os.path.basename(res.mono_pdf_path)
                if res.dual_pdf_path and os.path.exists(res.dual_pdf_path):
                    outputs["dual"] = os.path.basename(res.dual_pdf_path)

                tasks_db[task_id]["output_files"] = outputs
                tasks_db[task_id]["status"] = "done"
                tasks_db[task_id]["stage"] = "done"
                tasks_db[task_id]["progress"] = 100
                logger.info(f"PDF task {task_id} completed successfully.")
                break

    except Exception as e:
        logger.error(f"Error in PDF translation task {task_id}: {e}")
        tasks_db[task_id]["status"] = "error"
        tasks_db[task_id]["error"] = str(e)

def run_reflowable_translation(task_id: str, input_path: str, lang_in: str, lang_out: str, mode: str, ollama_model: str, ollama_url: str, api_key: str):
    """Synchronously runs translation for reflowable formats in a background thread."""
    try:
        tasks_db[task_id]["stage"] = "parsing"
        tasks_db[task_id]["progress"] = 15

        ext = os.path.splitext(input_path.lower())[1]

        # 1. Parse original file
        if ext == ".docx":
            unified_doc = parse_docx(input_path)
        elif ext == ".pptx":
            unified_doc = parse_pptx(input_path)
        elif ext == ".epub":
            unified_doc = parse_epub(input_path)
        elif ext in [".html", ".htm"]:
            unified_doc = parse_html_file(input_path)
        else:
            raise ValueError(f"Unsupported format: {ext}")

        tasks_db[task_id]["progress"] = 35
        tasks_db[task_id]["stage"] = "translating"

        # 2. Extract translatable blocks
        blocks_to_translate = []
        def collect_blocks(blocks):
            for block in blocks:
                if block.content and block.type != "table":
                    blocks_to_translate.append(block)
                if block.table_rows:
                    for row in block.table_rows:
                        for cell in row:
                            collect_blocks(cell)
        collect_blocks(unified_doc.blocks)

        if not blocks_to_translate:
            # Nothing to translate, copy original to output
            tasks_db[task_id]["progress"] = 90
            tasks_db[task_id]["stage"] = "exporting"
            outputs = {}
            for m in ["mono", "dual"]:
                out_name = f"{task_id}.{m}{ext}"
                shutil.copy2(input_path, OUTPUT_DIR / out_name)
                outputs[m] = out_name
            tasks_db[task_id]["output_files"] = outputs
            tasks_db[task_id]["status"] = "done"
            tasks_db[task_id]["stage"] = "done"
            tasks_db[task_id]["progress"] = 100
            return

        # 3. Initialize Ollama Translator
        translator = OllamaTranslator(
            model_name=ollama_model,
            base_url=ollama_url,
            api_key=api_key,
            lang_in=lang_in,
            lang_out=lang_out,
        )

        # 4. Translate blocks page-by-page/element-by-element with progress tracking
        total = len(blocks_to_translate)
        for idx, block in enumerate(blocks_to_translate):
            block.translated_content = translator.translate_text(block.content)
            # Update progress between 35% and 85%
            pct = 35 + int((idx + 1) / total * 50)
            tasks_db[task_id]["progress"] = pct

        tasks_db[task_id]["stage"] = "exporting"
        tasks_db[task_id]["progress"] = 90

        # 5. Export outputs
        outputs = {}
        modes_to_export = ["mono", "dual"] if mode == "both" else [mode]

        base_name = os.path.splitext(os.path.basename(input_path))[0]

        for m in modes_to_export:
            out_name = f"{base_name}.{lang_out}.{m}{ext}"
            out_path = OUTPUT_DIR / out_name
            
            if ext == ".docx":
                export_docx(input_path, str(out_path), unified_doc, mode=m)
            elif ext == ".pptx":
                export_pptx(input_path, str(out_path), unified_doc, mode=m)
            elif ext == ".epub":
                export_epub(input_path, str(out_path), unified_doc, mode=m)
            elif ext in [".html", ".htm"]:
                export_html_file(input_path, str(out_path), unified_doc, mode=m)
                
            outputs[m] = out_name

        tasks_db[task_id]["output_files"] = outputs
        tasks_db[task_id]["status"] = "done"
        tasks_db[task_id]["stage"] = "done"
        tasks_db[task_id]["progress"] = 100
        logger.info(f"Reflowable task {task_id} completed successfully.")

    except Exception as e:
        logger.error(f"Error in reflowable task {task_id}: {e}")
        tasks_db[task_id]["status"] = "error"
        tasks_db[task_id]["error"] = str(e)

@app.post("/api/translate")
def translate_file_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    lang_in: str = Form("en"),
    lang_out: str = Form("vi"),
    mode: str = Form("both"),  # "mono", "dual", "both"
    ollama_model: Optional[str] = Form(None),
    ollama_url: Optional[str] = Form(None),
    api_key: Optional[str] = Form(None),
    mineru_api: Optional[str] = Form(None),
):
    # Determine settings
    model = ollama_model if ollama_model else global_settings["ollama_model"]
    url = ollama_url if ollama_url else global_settings["ollama_url"]
    key = api_key if api_key else global_settings["api_key"]
    m_api = mineru_api if mineru_api is not None else global_settings["mineru_api"]

    # Generate task ID
    task_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename.lower())[1]
    
    # Save input file
    input_filename = f"{task_id}_input{ext}"
    input_path = UPLOAD_DIR / input_filename
    
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Initialize task status
    tasks_db[task_id] = {
        "id": task_id,
        "status": "processing",
        "progress": 0,
        "stage": "upload",
        "error": None,
        "file_name": file.filename,
        "ext": ext,
        "lang_in": lang_in,
        "lang_out": lang_out,
        "mode": mode,
        "output_files": {}
    }

    # Queue background task
    if ext == ".pdf":
        background_tasks.add_task(
            lambda: asyncio.run(
                run_pdf_translation(task_id, str(input_path), lang_in, lang_out, mode, model, url, key, m_api)
            )
        )
    else:
        background_tasks.add_task(
            run_reflowable_translation, task_id, str(input_path), lang_in, lang_out, mode, model, url, key
        )

    return {"status": "success", "task_id": task_id}

@app.get("/api/download/{task_id}/{mode}")
def download_file(task_id: str, mode: str):
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = tasks_db[task_id]
    if task["status"] != "done":
        raise HTTPException(status_code=400, detail="Task is not finished")

    filename = task["output_files"].get(mode)
    if not filename:
        raise HTTPException(status_code=404, detail=f"Output file in '{mode}' mode not found.")

    file_path = OUTPUT_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File has been deleted from server.")

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream"
    )

# Serve built React frontend if it exists
frontend_dist = WORKSPACE_DIR / "frontend" / ".output" / "public"
if not frontend_dist.exists():
    frontend_dist = WORKSPACE_DIR / "frontend" / "dist" / "client"

if frontend_dist.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")
    logger.info(f"Mounted frontend assets from {frontend_dist}")
else:
    logger.warning(f"Frontend assets not found at {frontend_dist}. API endpoints only are active.")
