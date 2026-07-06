/**
 * Trình quản lý cảnh lãng mạn chính
 * Điều phối tất cả các thành phần cảnh và xử lý hiển thị
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { FloatingTexts } from '../objects/FloatingTexts.js';
import { GlowingHearts } from '../objects/GlowingHearts.js';
import { StarField } from '../objects/StarField.js';
import { CameraController } from '../controls/CameraController.js';
import { InputHandler } from '../controls/InputHandler.js';

export class RomanticScene {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isPaused = false;
    this.lastFrameTime = Date.now();

    // Khởi tạo Three.js
    this.initScene();
    this.initRenderer();
    this.initLights();
    this.initPostProcessing();
    this.initObjects();
    this.initControls();

    // Bắt đầu vòng lặp hoạt hình
    this.animate();
  }

  /**
   * Khởi tạo cảnh Three.js
   */
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Thêm sương mù cho độ sâu
    this.scene.fog = new THREE.Fog(0x000000, 100, 300);

    // Khởi tạo camera
    const fov = 50;
    const aspect = this.width / this.height;
    const near = 0.1;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.z = 100;
  }

  /**
   * Khởi tạo trình kết xuất WebGL
   */
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
  }

  /**
   * Khởi tạo ánh sáng
   */
  initLights() {
    // Ánh sáng xung quanh cho chiếu sáng cơ bản
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Ánh sáng định hướng cho độ sâu
    const directionalLight = new THREE.DirectionalLight(0xff1493, 0.8);
    directionalLight.position.set(50, 50, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Ánh sáng điểm bổ sung cho hiệu ứng phát sáng
    const pointLight = new THREE.PointLight(0xff69b4, 1, 200);
    pointLight.position.set(-50, -50, 50);
    this.scene.add(pointLight);
  }

  /**
   * Khởi tạo hiệu ứng xử lý sau
   */
  initPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.setSize(this.width, this.height);

    // Lượt kết xuất
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Lượt Bloom để tạo hiệu ứng phát sáng
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.width, this.height),
      1.5,
      0.4,
      0.85
    );
    this.composer.addPass(bloomPass);

    // Lượt FXAA để chống cưa răng
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.uniforms['resolution'].value.x = 1 / this.width;
    fxaaPass.uniforms['resolution'].value.y = 1 / this.height;
    this.composer.addPass(fxaaPass);
  }

  /**
   * Khởi tạo tất cả các đối tượng cảnh
   */
  initObjects() {
    // Tạo trường sao (20000 ngôi sao)
    this.starField = new StarField(this.scene, 20000);

    // Tạo văn bản nổi (1000 "Anh yêu em ❤️")
    this.floatingTexts = new FloatingTexts(this.scene, 1000);

    // Tạo trái tim phát sáng (500 trái tim)
    this.glowingHearts = new GlowingHearts(this.scene, 500);
  }

  /**
   * Khởi tạo bộ điều khiển camera
   */
  initControls() {
    this.cameraController = new CameraController(this.camera);
    this.inputHandler = new InputHandler(this.cameraController);
  }

  /**
   * Xử lý thay đổi kích thước cửa sổ
   */
  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Cập nhật camera
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    // Cập nhật trình kết xuất
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Cập nhật soạn thảo
    this.composer.setSize(this.width, this.height);
  }

  /**
   * Tạm dừng hoạt hình
   */
  pause() {
    this.isPaused = true;
  }

  /**
   * Tiếp tục hoạt hình
   */
  resume() {
    this.isPaused = false;
    this.lastFrameTime = Date.now();
  }

  /**
   * Vòng lặp hoạt hình chính - Mục tiêu 60 FPS
   */
  animate = () => {
    requestAnimationFrame(this.animate);

    if (this.isPaused) return;

    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;

    // Giới hạn delta time
    const clampedDelta = Math.min(deltaTime, 0.016);

    // Cập nhật hoạt hình nổi camera
    this.cameraController.update(clampedDelta);

    // Cập nhật văn bản nổi
    if (this.floatingTexts) {
      this.floatingTexts.update(clampedDelta);
    }

    // Cập nhật trái tim phát sáng
    if (this.glowingHearts) {
      this.glowingHearts.update(clampedDelta);
    }

    // Cập nhật trường sao
    if (this.starField) {
      this.starField.update(clampedDelta);
    }

    // Kết xuất với xử lý sau
    this.composer.render();
  };

  /**
   * Giải phóng tất cả tài nguyên
   */
  dispose() {
    this.inputHandler?.dispose();
    this.floatingTexts?.dispose();
    this.glowingHearts?.dispose();
    this.starField?.dispose();
    this.composer.dispose();
    this.renderer.dispose();
  }
}