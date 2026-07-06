/**
 * Trình xử lý đầu vào cho các bộ điều khiển cảm ứng
 * Xử lý xoay vuốt, phóng to chép, và động lực
 */

export class InputHandler {
  constructor(cameraController) {
    this.cameraController = cameraController;
    this.element = document.addEventListener ? window : null;

    // Trạng thái cảm ứng
    this.touches = [];
    this.lastTouches = [];
    this.momentum = { x: 0, y: 0 };
    this.momentumDecay = 0.92;
    this.isMultiTouch = false;

    this.setupListeners();
  }

  /**
   * Thiết lập trình lắng nghe sự kiện
   */
  setupListeners() {
    document.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
    document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
    document.addEventListener('wheel', this.onWheel.bind(this), { passive: false });

    this.momentumInterval = setInterval(() => {
      this.updateMomentum();
    }, 16);
  }

  /**
   * Xử lý cảm ứng bắt đầu
   */
  onTouchStart(event) {
    event.preventDefault();

    this.touches = Array.from(event.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
    }));

    this.lastTouches = [...this.touches];
    this.isMultiTouch = this.touches.length > 1;
    this.momentum = { x: 0, y: 0 };
  }

  /**
   * Xử lý cảm ứng di chuyển
   */
  onTouchMove(event) {
    event.preventDefault();

    const currentTouches = Array.from(event.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
    }));

    if (this.touches.length === 1) {
      const deltaX = currentTouches[0].x - this.lastTouches[0].x;
      const deltaY = currentTouches[0].y - this.lastTouches[0].y;

      this.cameraController.addRotation(deltaX, deltaY);

      this.momentum.x = deltaX;
      this.momentum.y = deltaY;
    } else if (this.touches.length === 2) {
      const oldDistance = this.getDistance(this.lastTouches[0], this.lastTouches[1]);
      const newDistance = this.getDistance(currentTouches[0], currentTouches[1]);
      const scale = newDistance / oldDistance;

      const currentZoom = this.cameraController.currentZoom;
      const newZoom = currentZoom / scale;
      this.cameraController.setZoom(newZoom);
    }

    this.lastTouches = currentTouches;
    this.touches = currentTouches;
  }

  /**
   * Xử lý cảm ứng kết thúc
   */
  onTouchEnd(event) {
    event.preventDefault();
    this.touches = Array.from(event.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
    }));

    if (this.touches.length === 0) {
      this.isMultiTouch = false;
    }
  }

  /**
   * Xử lý phóng to bánh xe chuột
   */
  onWheel(event) {
    event.preventDefault();

    const delta = event.deltaY > 0 ? 1.1 : 0.9;
    const currentZoom = this.cameraController.currentZoom;
    this.cameraController.setZoom(currentZoom * delta);
  }

  /**
   * Cập nhật suy giảm động lực
   */
  updateMomentum() {
    if (Math.abs(this.momentum.x) > 0.1 || Math.abs(this.momentum.y) > 0.1) {
      this.cameraController.addRotation(this.momentum.x, this.momentum.y);
      this.momentum.x *= this.momentumDecay;
      this.momentum.y *= this.momentumDecay;
    }
  }

  /**
   * Tính toán khoảng cách giữa hai điểm cảm ứng
   */
  getDistance(touch1, touch2) {
    const dx = touch1.x - touch2.x;
    const dy = touch1.y - touch2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Giải phóng trình lắng nghe sự kiện
   */
  dispose() {
    document.removeEventListener('touchstart', this.onTouchStart);
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
    document.removeEventListener('wheel', this.onWheel);
    clearInterval(this.momentumInterval);
  }
}