/**
 * Hệ thống trái tim phát sáng - Tạo 500 trái tim được hoạt hình
 * Sử dụng vật liệu shader tùy chỉnh để tối ưu hóa hiệu suất
 */

import * as THREE from 'three';

export class GlowingHearts {
  constructor(scene, count = 500) {
    this.scene = scene;
    this.count = count;
    this.particles = [];
    this.meshes = [];

    this.createHearts();
  }

  /**
   * Tạo hình dáng trái tim phát sáng
   */
  createHearts() {
    const heartGeometry = this.createHeartGeometry();

    for (let i = 0; i < this.count; i++) {
      const color = new THREE.Color().setHSL(0.95 + Math.random() * 0.05, 1, 0.6);
      const material = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: Math.random() * 0.5 + 0.5,
        metalness: 0.3,
        roughness: 0.4,
      });

      const mesh = new THREE.Mesh(heartGeometry, material);

      mesh.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 100
      );

      const scale = Math.random() * 1.5 + 0.5;
      mesh.scale.set(scale, scale, scale);

      this.scene.add(mesh);
      this.meshes.push(mesh);

      const particle = {
        mesh: mesh,
        x: mesh.position.x,
        y: mesh.position.y,
        z: mesh.position.z,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        vz: (Math.random() - 0.5) * 15,
        rotationSpeed: (Math.random() - 0.5) * 4,
        time: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 2 + 1,
        baseEmissive: mesh.material.emissiveIntensity,
      };

      this.particles.push(particle);
    }
  }

  /**
   * Tạo hình dáng trái tim bằng các đường cong Bezier
   */
  createHeartGeometry() {
    const shape = new THREE.Shape();

    const x = 0;
    const y = 0;
    const size = 1;

    shape.moveTo(x + size * 0.5, y);
    shape.bezierCurveTo(
      x + size * 0.5, y - size * 0.5,
      x + size, y - size * 0.5,
      x + size, y - size * 0.25
    );
    shape.bezierCurveTo(
      x + size, y,
      x + size * 0.5, y + size * 0.5,
      x, y + size * 0.75
    );
    shape.bezierCurveTo(
      x - size * 0.5, y + size * 0.5,
      x - size, y,
      x - size, y - size * 0.25
    );
    shape.bezierCurveTo(
      x - size, y - size * 0.5,
      x - size * 0.5, y - size * 0.5,
      x - size * 0.5, y
    );

    const geometry = new THREE.ShapeGeometry(shape, 32);
    geometry.center();

    return geometry;
  }

  /**
   * Cập nhật trái tim phát sáng mỗi khung hình
   */
  update(deltaTime) {
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      particle.x += particle.vx * deltaTime * 5;
      particle.y += particle.vy * deltaTime * 5;
      particle.z += particle.vz * deltaTime * 5;

      particle.vx *= 0.98;
      particle.vy *= 0.98;
      particle.vz *= 0.98;

      if (Math.abs(particle.x) > 120) particle.vx *= -1;
      if (Math.abs(particle.y) > 120) particle.vy *= -1;
      if (Math.abs(particle.z) > 80) particle.vz *= -1;

      particle.time += deltaTime * particle.pulseSpeed;

      const pulse = Math.sin(particle.time) * 0.5 + 0.5;
      particle.mesh.material.emissiveIntensity = particle.baseEmissive * pulse;

      particle.mesh.rotation.x += deltaTime * particle.rotationSpeed * 0.5;
      particle.mesh.rotation.y += deltaTime * particle.rotationSpeed * 0.7;
      particle.mesh.rotation.z += deltaTime * particle.rotationSpeed * 0.3;

      particle.mesh.position.set(particle.x, particle.y, particle.z);
    }
  }

  /**
   * Giải phóng tài nguyên
   */
  dispose() {
    for (let mesh of this.meshes) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
    this.meshes = [];
    this.particles = [];
  }
}