# English Easier - Ứng dụng học Tiếng Anh

Ứng dụng web học tiếng Anh thông qua flashcard, được xây dựng bằng React + TypeScript + Vite.

## Tính năng

### 📚 Flashcard System
- Tạo và quản lý các bộ flashcard theo chủ đề
- Thêm từ vựng tiếng Anh kèm nghĩa tiếng Việt
- Tổ chức các bộ flashcard vào thư mục
- Tùy chỉnh màu sắc và biểu tượng cho mỗi bộ

### 🎯 Đa dạng chế độ học
- **Lật thẻ**: Xem từ và tự kiểm tra bằng cách lật thẻ
- **Trắc nghiệm**: Chọn đáp án đúng trong 4 lựa chọn
- **Điền từ (Anh → Việt)**: Gõ nghĩa tiếng Việt
- **Điền từ (Việt → Anh)**: Gõ từ tiếng Anh

### 🍅 Pomodoro Timer
- Timer tập trung học tập theo kỹ thuật Pomodoro
- Tùy chỉnh thời gian làm việc và nghỉ ngơi
- Thống kê thời gian tập trung

### 🏆 Hệ thống xếp hạng
- Tích điểm qua việc học tập
- 6 cấp bậc: Người mới → Học viên → Trung cấp → Thành thạo → Chuyên gia → Bậc thầy
- Bảng xếp hạng tuần và tổng thể
- Hệ thống thành tích

### 👤 Tài khoản người dùng
- Đăng ký / Đăng nhập
- Lưu trữ dữ liệu cục bộ
- Hồ sơ cá nhân với thống kê

## Cài đặt

1. Clone repository
2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy development server:
```bash
npm run dev
```

4. Build cho production:
```bash
npm run build
```

## Công nghệ sử dụng

- **React 18** - UI Framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **Lucide React** - Icons
- **Supabase** - Backend (optional)

## Deploy lên Vercel

1. Push code lên GitHub
2. Kết nối repository với Vercel
3. Vercel sẽ tự động detect Vite project và deploy

## Cấu trúc thư mục

```
src/
├── components/     # Các component dùng chung
├── pages/          # Các trang của ứng dụng
├── stores/         # Zustand stores
├── types/          # TypeScript type definitions
├── utils/          # Utility functions & constants
├── lib/            # External library configs
├── App.tsx         # Main App component
├── main.tsx        # Entry point
└── index.css       # Global styles
```

## Demo Mode

Ứng dụng hiện hoạt động ở chế độ demo với local storage. Để sử dụng với Supabase backend:

1. Tạo project trên [Supabase](https://supabase.com)
2. Copy `.env.example` thành `.env`
3. Điền thông tin Supabase URL và Anon Key

## License

MIT License
