# Chi tiết Kiến trúc & Triển khai Kỹ thuật

> [!NOTE]
> Tài liệu kỹ thuật này mô tả sâu các giai đoạn xử lý cốt lõi bên trong hệ thống dịch thuật giữ nguyên bố cục.

## Luồng Xử lý Cốt lõi (Core Processing Flow)

Các giai đoạn xử lý chính theo thứ tự thực thi thực tế của hệ thống:

1. **Phân tích PDF & Tạo tầng trung gian:** Chi tiết cơ chế xem tại [PDFParsing.md](PDFParsing/PDFParsing.md)
   * Trích xuất các đối tượng hình học, ký tự, font chữ và hình ảnh từ tệp PDF gốc để chuyển đổi thành ngôn ngữ trung gian (IL).

2. **Nhận diện Layout OCR (Layout OCR):**
   * Sử dụng MinerU 2.5 Pro (hoặc mô hình ONNX tích hợp sẵn) để phân tích các khối văn bản (text blocks), cột báo chí, vị trí đặt bảng biểu và công thức toán học.

3. **Nhóm dòng thành Đoạn văn:** Chi tiết cơ chế xem tại [ParagraphFinding.md](ParagraphFinding/ParagraphFinding.md)
   * Ghép nối các dòng văn bản rời rạc từ PDF thành các đoạn văn hoàn chỉnh có nghĩa để gửi đến LLM dịch chuẩn văn cảnh.

4. **Xử lý Định dạng & Công thức:** Chi tiết cơ chế xem tại [StylesAndFormulas.md](StylesAndFormulas/StylesAndFormulas.md)
   * Bảo toàn các công thức toán học LaTeX, các chữ in đậm, in nghiêng hoặc màu sắc khác nhau trong cùng một đoạn văn.

5. **Dịch thuật Tầng Trung gian:** Chi tiết cơ chế xem tại [ILTranslator.md](ILTranslator/ILTranslator.md)
   * Gửi nội dung đã được chuẩn hóa định dạng và đoạn văn sang mô hình ngôn ngữ lớn (Ollama) để dịch sang ngôn ngữ đích.

6. **Phân bổ và Dàn trang (Typesetting):** Chi tiết cơ chế xem tại [Typesetting.md](Typesetting/Typesetting.md)
   * Tính toán kích thước từ chữ dịch sang (vốn có thể dài/ngắn hơn từ gốc) để co giãn size chữ phù hợp với khoảng trống Bounding Box cũ.

7. **Bản đồ Font chữ (Font Mapping):**
   * Tự động lựa chọn font chữ tiếng Việt thích hợp (hỗ trợ Unicode tiếng Việt đầy đủ) để thay thế cho font gốc bị thiếu hoặc không hỗ trợ tiếng Việt.

8. **Tái tạo tệp PDF Đích:** Chi tiết cơ chế xem tại [PDFCreation.md](PDFCreation/PDFCreation.md)
   * Vẽ lại các phần tử văn bản mới đã dịch, hình ảnh, đường nét biểu đồ vào tệp PDF kết quả.

## API Dịch Bất Đối Xứng

1. **Async Translation API:** Chi tiết xem tại [AsyncTranslate.md](AsyncTranslate/AsyncTranslate.md)
   * Cách thiết lập cơ chế gọi hàm dạng Async Generator để cập nhật tiến trình dịch theo thời gian thực (real-time progress).

> [!TIP]
> Click vào các liên kết tài liệu ở trên để xem chi tiết nguyên lý hoạt động và các tùy chọn cấu hình nâng cao.
