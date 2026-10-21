# Cỗ Máy Bói Tình Yêu

Web app HTML/CSS/JavaScript thuần, tối ưu cho màn hình điện thoại và livestream.

## Chạy thử trên máy tính

1. Giải nén thư mục.
2. Mở `index.html` bằng Chrome, Edge hoặc Firefox.
3. Nhập họ tên và ngày sinh của hai người rồi bấm **Giải mã duyên phận**.

Không cần cài package, không cần backend.

## Tính năng

- Bắt buộc nhập họ tên đầy đủ và ngày sinh của cả hai người.
- Điểm tổng thể và 6 chỉ số thành phần.
- Nhận xét từ thư viện nội dung có điều kiện theo mức điểm.
- Bảng xếp hạng chỉ hiển thị Top 10, lưu trong `localStorage`.
- Màn hình chờ bói có hiệu ứng hồi hộp khoảng 2,7 giây.
- Giao diện hồng trắng, tiêu đề gọn và kết quả nổi bật cho livestream.
- Cặp đôi được nhận diện bằng họ tên chuẩn hóa + ngày sinh, không phụ thuộc thứ tự hai người.
- Giữ điểm cao nhất; nếu bằng điểm, cặp có thời điểm đạt điểm cao nhất mới hơn được xếp trên.
- Reset BXH có hộp xác nhận.
- Xuất BXH CSV.
- Nút toàn màn hình.
- Không có nút sao chép kết quả; ngày sinh dùng bộ chọn ngày của điện thoại khi trình duyệt hỗ trợ.

## Cách tính điểm

Điểm sử dụng các quy tắc cố định mang tính trò chơi: chuỗi họ tên được chuẩn hóa và băm, ngày sinh, con số ngày sinh, cung hoàng đạo và nhóm nguyên tố được kết hợp thành điểm nền. Một biến thể nhỏ theo ngày (±3 điểm ở các chỉ số thành phần) tạo chút bất ngờ nhưng giúp kết quả không thay đổi liên tục trong cùng ngày.

Các điểm số, cung hoàng đạo và lời nhận xét chỉ phục vụ giải trí; không phải phương pháp khoa học để đánh giá sự tương hợp trong tình yêu.

## Lưu ý về dữ liệu

- BXH lưu trong trình duyệt trên thiết bị hiện tại, không đồng bộ giữa điện thoại và máy tính.
- Nếu xóa dữ liệu trình duyệt hoặc dùng chế độ ẩn danh, dữ liệu có thể mất.
- Dùng nút **Xuất CSV** để sao lưu BXH.
- Dữ liệu họ tên/ngày sinh chỉ được xử lý trong trình duyệt bởi mã nguồn này; không có máy chủ nhận dữ liệu.

## Đưa lên GitHub và Vercel

### GitHub
1. Tạo repository mới trên GitHub.
2. Upload `index.html`, `style.css`, `app.js`, `README.md` lên thư mục gốc repository.
3. Commit các file.

### Vercel
1. Đăng nhập Vercel bằng GitHub.
2. Chọn **Add New → Project** và import repository.
3. Với HTML thuần, không cần Build Command.
4. Để Output Directory trống hoặc dùng `.` nếu giao diện yêu cầu.
5. Bấm Deploy.

Sau khi triển khai, mở URL Vercel bằng Chrome trên điện thoại. Nếu muốn dữ liệu BXH tồn tại lâu dài, hãy dùng cùng trình duyệt và thiết bị; nên xuất CSV sao lưu định kỳ.
