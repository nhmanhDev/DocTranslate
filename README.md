# 🌐 DocTranslate

**DocTranslate** là một hệ thống chuyển đổi và dịch thuật tài liệu chạy hoàn toàn local trên máy tính cá nhân. Hệ thống hỗ trợ dịch các định dạng tài liệu khác nhau trong khi vẫn giữ nguyên bố cục cấu trúc, định dạng và phong cách trình bày gốc.

Để xử lý tài liệu PDF (vốn là định dạng phức tạp nhất), DocTranslate tích hợp bộ giải mã bố cục **BabelDOC** kết hợp với VLM phân tích layout hàng đầu **MinerU 2.5 Pro**, kết hợp sử dụng mô hình ngôn ngữ lớn (LLM) thông qua **Ollama** để dịch văn bản. Các định dạng văn bản có cấu trúc khác được xử lý thông qua mô hình tài liệu hợp nhất (**Unified Document Model**).

---

## ✨ Tính năng nổi bật

* **Dịch thuật Local hoàn toàn:** Kết nối trực tiếp với cổng API của **Ollama** local (tương thích cực tốt với các mô hình như `qwen2.5:8b`, `gemma2`, `llama3`).
* **Dịch PDF Giữ Nguyên Bố Cục (High-Fidelity):**
  * Tích hợp mô hình thị giác ngôn ngữ **MinerU 2.5 Pro** (`opendatalab/MinerU2.5-Pro-2605-1.2B` chạy local hoặc qua API) để trích xuất cấu trúc trang, bảng biểu, công thức toán học OCR chuẩn xác.
  * Tái dựng lại file PDF dịch giữ nguyên tọa độ, font chữ, các ô bảng biểu và công thức toán học.
* **Hỗ trợ định dạng văn bản có cấu trúc (Office & Book):** Chuyển đổi, trích xuất cấu trúc và dịch các định dạng **DOCX**, **PPTX**, **EPUB**, và **HTML**.
* **Chế độ dịch Song ngữ (Dual) & Đơn ngữ (Mono):** Tự động xuất ra hai phiên bản:
  * **Bản Song ngữ (Bilingual/Dual):** Hiển thị song song cả câu gốc và câu dịch (phù hợp để đối chiếu đọc tài liệu kỹ thuật).
  * **Bản Đơn ngữ (Monolingual/Mono):** Thay thế hoàn toàn câu gốc bằng câu đã dịch.
* **Giao diện Web Dashboard Cao Cấp:** Giao diện Dashboard được viết bằng React + Tailwind CSS bóng bẩy, hỗ trợ kéo thả tệp tin, tùy chọn ngôn ngữ trực quan và cập nhật tiến trình dịch thời gian thực (real-time).

---

## 🛠️ Cấu trúc thư mục dự án

```
DocTranslate/
├── backend/                  # Mã nguồn Python phía Backend
│   ├── babeldoc/             # Bộ máy xử lý và tái dựng PDF giữ nguyên bố cục
│   └── doctranslate/         # Bộ phân giải định dạng (parsers), xuất file (exporters), API server & CLI
├── frontend/                 # Mã nguồn giao diện React Dashboard (Lovable TanStack)
├── pyproject.toml            # Cấu hình dự án Python & các thư viện phụ thuộc
├── uv.lock
└── README.md                 # Hướng dẫn sử dụng tiếng Việt
```

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống

1. **Python 3.10 đến 3.13**
2. **Ollama:** Tải và cài đặt [Ollama](https://ollama.com). Hãy chắc chắn rằng Ollama đã được khởi động và đã tải mô hình dịch ưa thích của anh, ví dụ:
   ```bash
   ollama run qwen2.5:8b
   ```
3. **Bun (Tùy chọn):** Cần thiết nếu anh muốn tự thay đổi mã nguồn React frontend và biên dịch lại:
   ```bash
   powershell -c "irm bun.sh/install.ps1 | iex"
   ```

### Tiến hành cài đặt

Sử dụng công cụ quản lý môi trường nhanh [uv](https://github.com/astral-sh/uv) để cài đặt tự động:

```bash
# Clone dự án về máy
git clone https://github.com/nhmanhDev/DocTranslate.git
cd DocTranslate

# Đồng bộ thư viện và tạo môi trường ảo tự động
uv sync
```

---

## 💻 Cách sử dụng

DocTranslate hỗ trợ khởi chạy dưới dạng trang Web cục bộ hoặc dịch trực tiếp qua dòng lệnh (CLI).

### 1. Khởi chạy Giao diện Web Dashboard (Khuyên Dùng)

Lệnh này sẽ tự động kiểm tra tài sản tĩnh frontend, khởi động FastAPI server và tự động mở trình duyệt web của anh:

```bash
uv run doctranslate web
```
Sau khi khởi chạy, anh truy cập `http://127.0.0.1:8080/dashboard` để kéo thả tài liệu, chọn ngôn ngữ nguồn/đích, chọn kiểu bố cục (Mono/Dual) và theo dõi tiến trình xử lý trực quan.

### 2. Sử dụng qua CLI (Dòng lệnh)

#### Dịch tài liệu Office/Book (DOCX, PPTX, EPUB, HTML)
```bash
uv run doctranslate translate du-an.docx -li en -lo vi --ollama-model qwen2.5:8b
```

#### Dịch tài liệu PDF (Giữ nguyên bố cục trang)
Chỉ định URL API MinerU đang chạy local của anh để phân tích cấu trúc:
```bash
uv run doctranslate translate bao-cao.pdf -li en -lo vi --ollama-model qwen2.5:8b --mineru-api http://127.0.0.1:8000/parse
```

---

## ⚙️ Bảng tham số cấu hình dòng lệnh

| Tham số | Cờ dòng lệnh | Giá trị mặc định | Mô tả |
| :--- | :--- | :--- | :--- |
| **Ngôn ngữ nguồn** | `-li`, `--lang-in` | `en` | Mã ngôn ngữ gốc của tài liệu (ví dụ: en, zh, ja) |
| **Ngôn ngữ đích** | `-lo`, `--lang-out` | `vi` | Mã ngôn ngữ muốn dịch sang (ví dụ: vi, en) |
| **Mô hình Ollama** | `--ollama-model` | `qwen2.5:8b` | Tên mô hình LLM đang chạy trên Ollama của anh |
| **Endpoint Ollama** | `--ollama-url` | `http://localhost:11434/v1` | URL cổng kết nối API Ollama |
| **MinerU API** | `--mineru-api` | `None` | URL của dịch vụ phân tích bố cục PDF MinerU |
| **Kiểu bố cục xuất** | `--mode` | `both` | Lựa chọn định dạng xuất file: `mono`, `dual`, hoặc `both` |
