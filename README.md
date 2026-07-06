# 💕 Anh Yêu Em - Trang web Three.js Lãng Mạn

Một trang web lãng mạn sẵn sàng cho sản xuất, được tối ưu hóa cho thiết bị di động được xây dựng bằng Three.js, với 1000 văn bản tiếng Việt nổi, 500 trái tim phát sáng, 20000 ngôi sao lấp lóe và các hiệu ứng hình ảnh nâng cao.

## 🌟 Các tính năng

### Hiệu ứng hình ảnh
- **1000 Văn bản nổi** - Hạt "Anh yêu em ❤️" với mô phỏng vật lý
- **500 Trái tim phát sáng** - Trái tim 3D được hoạt hình với ánh sáng nhịp
- **20000 Ngôi sao** - Trường sao lấp lóe trong không gian 3D
- **Hiệu ứng Bloom** - Phát sáng thực tế trên các vật thể sáng
- **Chống cưa răng FXAA** - Cạnh mịn trên tất cả hình học
- **Sương mù** - Hiệu ứng độ sâu khí quyển
- **Hệ thống hạt** - Mô phỏng vật lý nâng cao

### Camera và Bộ điều khiển
- **Camera nổi** - Hoạt hình nổi mịn xung quanh tâm cảnh
- **Xoay vuốt** - Xoay cảnh bằng vuốt (thiết bị di động)
- **Phóng to chép** - Phóng to/thu nhỏ bằng cử chỉ chép
- **Động lực** - Suy giảm động lực mịn sau tương tác
- **Phóng to bánh xe chuột** - Hỗ trợ phóng to cho máy tính để bàn

### Hiệu suất
- **Mục tiêu 60 FPS** - Vòng kết xuất được tối ưu hóa
- **Tối ưu hóa iPhone Safari** - Hỗ trợ viewport-fit và safe area
- **Tối ưu hóa di động** - Xử lý sự kiện cảm ứng, tỷ lệ pixel thấp
- **EffectComposer** - Đường ống xử lý sau hiệu quả
- **Kết xuất được khởi tạo** - Kết xuất trường sao được tối ưu hóa

### Công nghệ
- **Vite** - Công cụ xây dựng nhanh và máy chủ phát triển
- **Three.js r128** - Thư viện WebGL
- **Troika Three Text** - Kết xuất văn bản tiếng Việt
- **Kiến trúc Modular** - Tách biệt rõ ràng

## 🚀 Bắt đầu nhanh chóng

### Cài đặt

```bash
npm install
```

### Phát triển

```bash
npm run dev
```

Mở [http://localhost:5173](http://localhost:5173) trong trình duyệt của bạn.

### Xây dựng sản xuất

```bash
npm run build
```

Bản dựng được tối ưu hóa sẽ ở trong thư mục `dist`.

## 📁 Cấu trúc dự án

```
romantic-website/
├── src/
│   ├── main.js
│   ├── scenes/
│   │   └── RomanticScene.js
│   ├── objects/
│   │   ├── FloatingTexts.js
│   │   ├── GlowingHearts.js
│   │   └── StarField.js
│   └── controls/
│       ├── CameraController.js
│       └── InputHandler.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎮 Tương tác

### Máy tính để bàn
- **Bánh xe chuột** - Phóng to/thu nhỏ

### Di động (Cảm ứng)
- **Vuốt** - Xoay cảnh
- **Chép** - Phóng to/thu nhỏ
- **Kéo hai ngón tay** - Xoay động lực

## ⚙️ Cấu hình

### Số lượng hạt
Chỉnh sửa trong `src/scenes/RomanticScene.js`:

```javascript
this.floatingTexts = new FloatingTexts(this.scene, 1000);
this.glowingHearts = new GlowingHearts(this.scene, 500);
this.starField = new StarField(this.scene, 20000);
```

## 📱 Hỗ trợ trình duyệt

- ✅ Chrome/Edge (Máy tính để bàn & Di động)
- ✅ Firefox (Máy tính để bàn & Di động)
- ✅ Safari (Máy tính để bàn & Di động)
- ✅ iPhone Safari (iOS 13+)

## 🔧 Lời khuyên về hiệu suất

1. **Giảm số lượng hạt** cho các thiết bị cũ
2. **Giảm cường độ bloom** để có hiệu suất tốt hơn
3. **Kiểm tra hiệu suất** trong DevTools (mục tiêu 60 FPS)

---

**Được tạo với tình yêu ❤️**