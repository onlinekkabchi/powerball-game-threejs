﻿import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { scene, sceneBaked } from "./scene.js";
import { cube1, cube2, stageFlag } from "./cube.js";
import { stage, stageBaked } from "./stage.js";

// const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
//scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / 2 / window.innerHeight,
//   0.1,
//   1000
// );
// camera.lookAt(0, 0, 0);
// camera.position.z = 20;

// 카메라 세팅
const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 2, 10);

// 캔버스 생성 및 사이즈
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.9);

// 카메라 궤도 컨트롤러
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 3;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI / 2;
controls.target.set(0, 1, 0);
controls.update();

document.body.appendChild(renderer.domElement);

// 무대 원본, 베이킹본
stage(scene);
// stageBaked(sceneBaked);

// 큐브 추가 및 움직임
function animate() {
  requestAnimationFrame(animate);

  // 큐브 추가
  scene.add(cube1, cube2);

  cube1.rotation.x += 0.03;
  cube1.rotation.y += 0.03;
  cube2.rotation.y += 0.03;

  // 파이널 랜더링
  return renderer.render(scene, camera);
}

animate();