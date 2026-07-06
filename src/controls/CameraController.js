/**
 * Bộ điều khiển camera với hoạt hình nổi
 * Xử lý chuyển động camera mịn và xoay
 */

import * as THREE from 'three';

export class CameraController {
  constructor(camera) {
    this.camera = camera;
    this.time = 0;

    // Các tham số hoạt hình nổi
    this.floatDistance = 30;
    this.floatSpeed = 0.3;
    this.rotationCenter = new THREE.Vector3(0, 0, 0);

    // Phóng to và xoay từ đầu vào
    this.targetZoom = 1;
    this.currentZoom = 1;
    this.zoomSmoothness = 0.1;

    this.targetRotationX = 0;
    this.targetRotationY = 0;
    this.currentRotationX = 0;
    this.currentRotationY = 0;
    this.rotationSmoothness = 0.1;
  }

  /**
   * Cập nhật vị trí và xoay camera
   */
  update(deltaTime) {
    this.time += deltaTime;

    this.currentZoom += (this.targetZoom - this.currentZoom) * this.zoomSmoothness;

    this.currentRotationX += (this.targetRotationX - this.currentRotationX) * this.rotationSmoothness;
    this.currentRotationY += (this.targetRotationY - this.currentRotationY) * this.rotationSmoothness;

    const floatX = Math.cos(this.time * this.floatSpeed) * this.floatDistance;
    const floatY = Math.sin(this.time * this.floatSpeed * 0.7) * this.floatDistance * 0.5;
    const floatZ = Math.sin(this.time * this.floatSpeed * 0.5) * this.floatDistance * 0.3;

    const baseDistance = 100 * this.currentZoom;
    const rotX = this.currentRotationX;
    const rotY = this.currentRotationY;

    const x = baseDistance * Math.sin(rotY) * Math.cos(rotX) + floatX;
    const y = baseDistance * Math.sin(rotX) + floatY;
    const z = baseDistance * Math.cos(rotY) * Math.cos(rotX) + floatZ;

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.rotationCenter);
  }

  /**
   * Đặt mức phóng to mục tiêu
   */
  setZoom(zoom) {
    this.targetZoom = Math.max(0.5, Math.min(3, zoom));
  }

  /**
   * Đặt xoay mục tiêu
   */
  setRotation(rotationX, rotationY) {
    this.targetRotationX = rotationX;
    this.targetRotationY = rotationY;
  }

  /**
   * Thêm vào xoay (cho động lực/vuốt)
   */
  addRotation(deltaX, deltaY) {
    this.targetRotationX += deltaY * 0.01;
    this.targetRotationY += deltaX * 0.01;

    this.targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.targetRotationX));
  }
}