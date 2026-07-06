/**
 * Hệ thống trường sao - Tạo 20000 ngôi sao lấp lóe
 * Tối ưu hóa bằng cách sử dụng kết xuất được khởi tạo để có hiệu suất tốt
 */

import * as THREE from 'three';

export class StarField {
  constructor(scene, count = 20000) {
    this.scene = scene;
    this.count = count;
    this.stars = [];
    this.twinkleSpeeds = [];
    this.positions = [];
    this.colors = [];

    this.createStars();
  }

  /**
   * Tạo trường sao bằng cách sử dụng kết xuất được khởi tạo
   */
  createStars() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);
    const colors = new Float32Array(this.count * 3);
    const sizes = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 250 + Math.random() * 50;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      this.positions.push({ x, y, z });

      const colorVariation = Math.random() * 0.3;
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.9 + colorVariation * 0.1;
      colors[i * 3 + 2] = 0.8 + colorVariation * 0.2;

      this.colors.push({ r: colors[i * 3], g: colors[i * 3 + 1], b: colors[i * 3 + 2] });

      sizes[i] = Math.random() * 2 + 0.5;

      this.twinkleSpeeds.push({
        speed: Math.random() * 2 + 0.5,
        phase: Math.random() * Math.PI * 2,
        brightness: Math.random() * 0.5 + 0.5,
      });

      this.stars.push({
        index: i,
        baseSize: sizes[i],
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      map: this.createStarTexture(),
    });

    const points = new THREE.Points(geometry, material);
    this.scene.add(points);

    this.geometry = geometry;
    this.material = material;
    this.points = points;
  }

  /**
   * Tạo kết xuất hình tròn cho các ngôi sao
   */
  createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    return texture;
  }

  /**
   * Cập nhật các ngôi sao bằng hoạt hình lấp lóe
   */
  update(deltaTime) {
    const sizes = this.geometry.attributes.size.array;
    const colors = this.geometry.attributes.color.array;

    for (let i = 0; i < this.count; i++) {
      const twinkle = this.twinkleSpeeds[i];
      const star = this.stars[i];
      const color = this.colors[i];

      twinkle.phase += deltaTime * twinkle.speed;

      const brightness = Math.sin(twinkle.phase) * 0.5 + twinkle.brightness;

      sizes[i] = star.baseSize * (brightness * 0.5 + 0.5);

      colors[i * 3] = color.r * brightness;
      colors[i * 3 + 1] = color.g * brightness;
      colors[i * 3 + 2] = color.b * brightness;
    }

    this.geometry.attributes.size.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
  }

  /**
   * Giải phóng tài nguyên
   */
  dispose() {
    this.scene.remove(this.points);
    this.geometry.dispose();
    this.material.dispose();
    this.stars = [];
    this.positions = [];
    this.colors = [];
    this.twinkleSpeeds = [];
  }
}