# 🌐 DocTranslate

**DocTranslate** is a local, AI-powered document conversion and translation system. It allows you to translate files into multiple languages while preserving their exact layout, styling, and structural elements.

It supports high-fidelity PDF translation by combining **BabelDOC**'s layout-reconstruction engine with **MinerU 2.5 Pro**'s advanced VLM layout parsing, and handles office/book formats via a **Unified Document** model. All translations run fully locally using **Ollama** models.

---

## ✨ Features

* **Local LLM Translation:** Connects to your local **Ollama** instance (compatible with models like `qwen2.5:8b`, `gemma2`, or `llama3`).
* **High-Fidelity PDF Translation:** 
  * Integrates **MinerU 2.5 Pro** (`opendatalab/MinerU2.5-Pro-2605-1.2B` VLM) for world-class PDF layout parsing, table extraction, and math formula OCR.
  * Rebuilds the PDF preserving original coordinates, fonts, tables, and equations.
* **Reflowable Formats:** Converts, translates, and exports **DOCX**, **PPTX**, **EPUB**, and **HTML** documents.
* **Dual & Mono Outputs:** Supports generating both **Song ngữ (Bilingual/Dual)** and **Đơn ngữ (Monolingual/Mono)** versions.
* **Premium Web UI Dashboard:** Comes with a built-in React/Tailwind Web Dashboard (served locally via FastAPI) with real-time upload progress indicators, settings configuration, and downloads.

---

## 🛠️ Folder Structure

```
DocTranslate/
├── backend/                  # Python backend code
│   ├── babeldoc/             # PDF layout-preserving translation engine
│   └── doctranslate/         # Core application (CLI, web server, parsers, exporters)
├── frontend/                 # React frontend dashboard source code (Lovable TanStack app)
├── pyproject.toml            # Merged backend python dependencies & scripts
├── uv.lock
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

1. **Python 3.10 to 3.13**
2. **Ollama:** Download and install [Ollama](https://ollama.com). Ensure it is running and has your preferred translation model pulled:
   ```bash
   ollama run qwen2.5:8b
   ```
3. **Bun (Optional):** Needed if you plan to modify and compile the React frontend code:
   ```bash
   # Install bun
   powershell -c "irm bun.sh/install.ps1 | iex"
   ```

### Installation

Use [uv](https://github.com/astral-sh/uv) to install dependencies and manage the virtual environment automatically:

```bash
# Clone the repository
git clone https://github.com/nhmanhDev/DocTranslate.git
cd DocTranslate

# Install dependencies and sync virtual environment
uv sync
```

---

## 💻 Usage

DocTranslate can be run either as a local Web application or directly from the Command Line Interface (CLI).

### 1. Launching the Web UI Dashboard (Recommended)

Starts the local FastAPI server and automatically opens the dashboard in your default browser:

```bash
uv run doctranslate web
```
Visit the dashboard at `http://127.0.0.1:8080/dashboard` to upload files, adjust language settings, and monitor progress interactively.

### 2. Translating via CLI

#### Translate Reflowable Documents
Translate `.docx`, `.pptx`, `.epub`, or `.html` documents locally:
```bash
uv run doctranslate translate document.docx -li en -lo vi --ollama-model qwen2.5:8b
```

#### Translate PDF (Preserving Layout)
Provide the local MinerU API endpoint for layout parsing:
```bash
uv run doctranslate translate document.pdf -li en -lo vi --ollama-model qwen2.5:8b --mineru-api http://127.0.0.1:8000/parse
```

---

## ⚙️ Configuration Options

| Option | Command Line Flag | Default | Description |
| :--- | :--- | :--- | :--- |
| **Source Language** | `-li`, `--lang-in` | `en` | Input document language code |
| **Target Language** | `-lo`, `--lang-out` | `vi` | Output document language code |
| **Ollama Model** | `--ollama-model` | `qwen2.5:8b` | Name of the local Ollama model |
| **Ollama API URL** | `--ollama-url` | `http://localhost:11434/v1` | Ollama connection endpoint |
| **MinerU API** | `--mineru-api` | `None` | Optional MinerU local parsing API URL |
| **Output Mode** | `--mode` | `both` | Output formats: `mono`, `dual`, or `both` |
