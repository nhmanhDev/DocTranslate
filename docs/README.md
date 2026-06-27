# 📖 Tài liệu kỹ thuật DocTranslate

Trang này chứa tài liệu hướng dẫn kỹ thuật chi tiết về cơ chế hoạt động bên dưới của hệ thống dịch thuật giữ nguyên bố cục **DocTranslate**.

---

## 🔍 Danh mục tài liệu

### 1. [Giới thiệu về cấu trúc đối tượng PDF](intro-to-pdf-object.md)
* Hướng dẫn chi tiết cách thức cấu trúc tệp PDF hoạt động dưới góc nhìn lập trình (Objects, Pages, Fonts, Content Streams, Coordinate Systems). 
* Giúp anh hiểu cách DocTranslate tái xây dựng file PDF đích từ tọa độ hình học của file gốc.

### 2. [Danh sách ngôn ngữ hỗ trợ](supported_languages.md)
* Bảng thống kê chi tiết các ngôn ngữ nguồn và ngôn ngữ đích được hệ thống dịch thuật và bộ tái lập font chữ hỗ trợ.

### 3. [Chi tiết triển khai kỹ thuật (Implementation Details)](ImplementationDetails/README.md)
* **Dịch bất đối xứng (Async Translation):** Cách tiến trình dịch nền hoạt động mà không gây nghẽn luồng xử lý chính.
* **Bộ máy dựng PDF (PDF Creation):** Cơ chế vẽ văn bản đã dịch đè lên tọa độ gốc của tệp PDF cũ.
* **Bộ máy phân tích đoạn văn (Paragraph Finding):** Thuật toán nhóm các dòng text đơn lẻ từ layout thành các đoạn văn hoàn chỉnh để gửi cho LLM dịch chuẩn ngữ cảnh.
* **Xử lý Công thức & Định dạng (Styles and Formulas):** Cách nhận diện và bảo toàn định dạng in đậm, in nghiêng, công thức toán học hoặc mã màu văn bản.

---

## ⚙️ Cơ chế hoạt động của DocTranslate PDF Engine

Hệ thống dịch PDF giữ nguyên bố cục hoạt động theo chu trình khép kín sau:

```
[File PDF Gốc] 
      │
      ▼
[Layout Parser (MinerU 2.5 Pro)] ───► Phân tích hộp giới hạn (Bounding Boxes), bảng biểu, hình ảnh
      │
      ▼
[BabelDOC PDF Engine] ──────────────► Trích xuất và nhóm dòng văn bản thành đoạn (Paragraphs)
      │
      ▼
[Ollama Local LLM] ─────────────────► Dịch thuật văn bản từng đoạn theo ngữ cảnh
      │
      ▼
[BabelDOC Render Engine] ───────────► Vẽ văn bản dịch đè lên PDF gốc (áp dụng font thích hợp)
      │
      ▼
[File PDF Đích (Mono / Dual)]
```
