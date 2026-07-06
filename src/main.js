/**
 * Điểm vào chính cho trang web Three.js lãng mạn
 * Khởi tạo ứng dụng và xử lý vòng đời
 */

import { RomanticScene } from './scenes/RomanticScene.js';

// Khởi tạo ứng dụng
const app = new RomanticScene();

// Xử lý thay đổi kích thước cửa sổ
window.addEventListener('resize', () => {
  app.onWindowResize();
});

// Xử lý thay đổi khả năng hiển thị
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    app.pause();
  } else {
    app.resume();
  }
});