﻿import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// threejs 인스턴스
// import { gridHelper, axesHelper } from "./helper/helper.js";
// import { camera, orbitController } from "./camera/camera.js";
// import { orbitController } from "./camera/camera.js";
// // import { renderer } from "./camera/renderer.js";
import {
  ambientLight,
  dirLight,
  hemiLight,
  dirLightHelper,
  hemiLightHelper,
} from "./light/light.js";
import {
  pointLight,
  pointLightHelper,
  pointLight2,
  pointLightHelper2,
} from "./light/light-point.js";

// import { rectLight1, rectLight2, rectLight3 } from "./light/light-rect.js";
// import { pointLight, pointLightHelper } from "./light/light-point.js";
// import { bulbLight } from "./light/light-bulb.js";

// // 모델
// import { cube1, cube2 } from "./models/cube.js";
// import { stage, stageBaked } from "./models/stage.js";
// import Lottery from "./models/lottery-machine-class.js";
// import { Fox } from "./models/fox.js";
// import { sphere, sphere1 } from "./models/sphere.js";

// 텍스트
import {
  text,
  bevelEnabled,
  font,
  fontName,
  fontWeight,
  fontHeight,
  fontSize,
  fontHover,
  fontCurveSegments,
  fontBevelSize,
  fontBevelThickness,
  fontMirror,
  fontMap,
  weightMap,
} from "./text/text.js";
// // 텍스쳐
import { hdrLoader } from "./camera/hdr.js";

const loader = new GLTFLoader();
const clock = new THREE.Clock();

let animationStartTime = null;

let mesh;
let firework, fireworkAction, lottery, lotteryAction, ring, ringAction;
let fireworkMixer, ringMixer, lotteryMixer;
let group, camera, scene, renderer;

let isRingAnimationPlaying = false;
let animations;

let ballController = {
  moving: false,
  limit: 100,
};
let lightIntensity = {
  hemiLight: 1,
  ambientLight: 1,
};

init();

function createText() {
  const textGeo = new TextGeometry(text, {
    font: font,

    size: fontSize,
    height: fontHeight,
    curveSegments: fontCurveSegments,

    bevelThickness: fontBevelThickness,
    bevelSize: fontBevelSize,
    bevelEnabled: fontBevelEnabled,
  });

  textGeo.computeBoundingBox();
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);
  console.log("scene");

  // camera = new THREE.PerspectiveCamera(
  //   40,
  //   window.innerWidth / window.innerHeight,
  //   1,
  //   100
  // );
  // camera.position.set(5, 2, 8);

  camera = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    (window.innerHeight * 0.7) / 2,
    (window.innerHeight * 0.7) / -2,
    -200,
    500 // 카메라 거리
  );
  camera.position.set(0, 3, 10);
  // camera.lookAt(0, 10, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight * 0.7); // 캔버스 사이즈
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.minDistance = 20;
  controls.maxDistance = 50;
  controls.maxPolarAngle = Math.PI / 2;

  scene.add(ambientLight, dirLight, hemiLight, dirLightHelper, hemiLightHelper);
  scene.add(pointLight, pointLightHelper, pointLight2, pointLightHelper2);
  // const light = new THREE.PointLight(0xffffff, 1000, 0, 0);

  scene.add(new THREE.AxesHelper(20));

  const meshGeometry = new THREE.BoxGeometry(10, 10, 10);
  // const meshGeometry = new THREE.SphereGeometry(20, 32, 16);
  const meshMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    opacity: 1,
    side: THREE.DoubleSide,
    transparent: true,
  });

  mesh = new THREE.Mesh(meshGeometry, meshMaterial);
  mesh.position.set(0, 200, 0);
  scene.add(mesh);

  // window.addEventListener( 'resize', onWindowResize );

  // 무대 베이킹본
  loader.load(
    "./static/model/stage-baked/scene.gltf",
    function (gltf) {
      const model = gltf.scene;
      model.position.set(0, 0, 0);
      model.scale.set(20, 20, 20); // orthographic 카메라 사용할때 크기 주의할것
      scene.add(model);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (err) {
      console.error(err);
    }
  );

  // 로터리 머신
  const lotteryPath = "./static/model/lottery-machine/ball-collision-2-1.glb";
  const lotteryMat1 = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 1,
    roughness: 0,
    clearcoat: 1,
    transparent: true,
    opacity: 0.2,
    reflectivity: 0.1,
    refractionRatio: 0.9,
    ior: 0.9,
    side: THREE.BackSide,
    envMap: hdrLoader,
    envMapIntensity: 1,
    emissive: 0xffffff,
    emissiveIntensity: 0.1,
  });
  const lotteryMat2 = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
  });
  const ballGeometry = new THREE.SphereGeometry(10, 32, 32);
  const ballMat = new THREE.MeshPhysicalMaterial({
    color: 0xff7900,
    metalness: 1,
    roughness: 0,
    clearcoat: 1,
    envMap: hdrLoader,
    envMapIntensity: 1,
  });
  loader.load(lotteryPath, function (gltf) {
    lottery = gltf.scene;

    console.log("lottery machine");
    console.log(gltf);

    // lottery.children.forEach((el) => {
    //   el.material = lotteryMat1;
    // });
    lottery.children[3].material = lotteryMat1;
    lottery.children[2].material = lotteryMat2;
    lottery.children[1].mesh = ballGeometry;
    lottery.children[1].material = ballMat;

    lottery.position.set(0, 70, 0);
    lottery.scale.set(20, 20, 20);

    scene.add(lottery);
  });

  // 마법진?
  const ringPath = "./static/model/magic_ring_green/scene.gltf";
  loader.load(ringPath, function (gltf) {
    ring = gltf.scene;

    console.log("ring");
    console.log(gltf);
    ring.position.set(0, 10, 0);
    ring.scale.set(15, 15, 15);

    scene.add(ring);

    const animations = gltf.animations;
    ringMixer = new THREE.AnimationMixer(ring);
    ringAction = ringMixer.clipAction(animations[0]);
    // console.log(ringMixer.clipAction(animations[0]));

    animate();
  });

  // 폭죽
  const fireworkPath = "./static/model/firework/scene.gltf";
  loader.load(
    fireworkPath,
    function (gltf) {
      firework = gltf.scene;

      console.log("firework");
      console.log(gltf);
      firework.position.set(0, 80, 0);
      firework.scale.set(5, 5, 5);

      // scene.add(firework);

      // 폭죽 애니메이션
      const fireAnimations = gltf.animations;
      fireworkMixer = new THREE.AnimationMixer(firework);
      fireworkMixer.clipAction(fireAnimations[0]).play();
      console.log(fireworkMixer.clipAction(fireAnimations[0]));

      // animate();
    },
    undefined,
    function (err) {
      console.error(err);
    }
  );

  // animate();

  // render();
}

function animate() {
  requestAnimationFrame(animate);

  // mesh.rotation.x += 0.05;
  mesh.rotation.y += 0.05;

  let mixerUpdateDelta = clock.getDelta();

  // console.log(mixerUpdateDelta);
  // console.log(mixer);

  if (fireworkMixer) {
    fireworkMixer.update(mixerUpdateDelta);
  }

  if (ringMixer) {
    ringMixer.update(mixerUpdateDelta);
    // ringAction.play();
  }

  if (isRingAnimationPlaying) {
    ringAction.play();
  }

  if (ballController.moving && isRingAnimationPlaying) {
    lottery.position.y += 0.2;
    // dirLight.intensity += 0.01;
    // ambientLight.intensity += 0.01;
    // hemiLight.intensity += 0.02;
    // console.log(lottery.position.y, ballController.limit);
    console.log("ambientlight intensity: " + ambientLight.intensity);
    console.log("hemilight intensity: " + hemiLight.intensity);
    if (lottery.position.y > ballController.limit) {
      ballController.moving = false;
    }
  }

  render();
}

function render() {
  renderer.render(scene, camera);
}

setTimeout(() => {
  // if (ringAction) {
  // ringMixer.update(mixerUpdateDelta);
  // ringAction.play();
  // }
  console.log("ring animation playing..");
  isRingAnimationPlaying = true;
  ballController.moving = true;
}, 3000);
