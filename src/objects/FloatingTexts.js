/**
 * Hệ thống văn bản nổi - Tạo 1000 hạt "Anh yêu em ❤️" nổi
 * Sử dụng Troika Three Text để hỗ trợ tiếng Việt
 */

import * as THREE from 'three';
import { Text } from 'troika-three-text';

export class FloatingTexts {
  constructor(scene, count = 1000) {
    this.scene = scene;
    this.count = count;
    this.particles = [];
    this.textObjects = [];
    this.loadingPromises = [];

    this.createTexts();
  }

  /**
   * Tạo hạt văn bản nổi
   */
  createTexts() {
    const text = 'Anh yêu em ❤️';
    const colors = [
      0xff1493,
      0xff69b4,
      0xff8fab,
      0xffc0cb,
      0xffe4e1,
    ];

    for (let i = 0; i < this.count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const textObject = new Text();

      textObject.text = text;
      textObject.fontSize = Math.random() * 2 + 1;
      textObject.color = color;
      textObject.anchorX = 'center';
      textObject.anchorY = 'middle';
      textObject.sdfGlyphSize = 64;

      const promise = textObject.sync().then(() => {
        this.scene.add(textObject);
        this.textObjects.push(textObject);
      });
      this.loadingPromises.push(promise);

      // Tạo dữ liệu vật lý hạt
      const particle = {
        object: textObject,
        x: (Math.random() - 0.5) * 200,
        y: Math.random() * 300 + 50,
        z: (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 20,
        vy: -Math.random() * 30 - 10,
        vz: (Math.random() - 0.5) * 15,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 4,
        life: 1,
        lifeDecay: Math.random() * 0.3 + 0.1,
      };

      textObject.position.set(particle.x, particle.y, particle.z);
      textObject.rotation.z = particle.rotation;

      this.particles.push(particle);
    }
  }

  /**
   * Cập nhật văn bản nổi mỗi khung hình
   */
  update(deltaTime) {
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      // Cập nhật vận tốc (trọng lực)
      particle.vy -= 9.8 * deltaTime;
      particle.vx *= 0.99;
      particle.vz *= 0.99;

      // Cập nhật vị trí
      particle.x += particle.vx * deltaTime * 10;
      particle.y += particle.vy * deltaTime * 10;
      particle.z += particle.vz * deltaTime * 10;

      // Cập nhật xoay
      particle.rotation += particle.rotationSpeed * deltaTime;

      // Giảm cuộc sống
      particle.life -= particle.lifeDecay * deltaTime;

      // Đặt lại khi hạt đi quá xa hoặc cuộc sống kết thúc
      if (particle.y < -150 || particle.life <= 0) {
        particle.life = 1;
        particle.x = (Math.random() - 0.5) * 200;
        particle.y = 150;
        particle.z = (Math.random() - 0.5) * 100;
        particle.vy = -Math.random() * 30 - 10;
        particle.vx = (Math.random() - 0.5) * 20;
        particle.vz = (Math.random() - 0.5) * 15;
      }

      // Cập nhật thuộc tính đối tượng
      particle.object.position.set(particle.x, particle.y, particle.z);
      particle.object.rotation.z = particle.rotation;
      particle.object.material.opacity = Math.max(0, particle.life);
    }
  }

  /**
   * Giải phóng tài nguyên
   */
  dispose() {
    for (let textObject of this.textObjects) {
      this.scene.remove(textObject);
      if (textObject.geometry) textObject.geometry.dispose();
      if (textObject.material) textObject.material.dispose();
    }
    this.textObjects = [];
    this.particles = [];
  }
}