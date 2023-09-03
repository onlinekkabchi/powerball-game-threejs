﻿import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

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

// // 텍스쳐
import { hdrLoader } from "./camera/hdr.js";
import { glassMat, transparentMat } from "./texture/glass.js";

const loader = new GLTFLoader();
const clock = new THREE.Clock();

let animationStartTime = null;

let mesh;
let firework,
  fireworkAction,
  lottery,
  lotteryAction,
  ring,
  ringAction,
  trupper,
  trupperAction;
let fireworkMixer, ringMixer, lotteryMixer, trupperMixer;
let lotterySample, lotterySampleMixer;
let lotterySampleAction = [];

let group, camera, scene, renderer;

let isRingAnimationPlaying = false;
let animations;

let ballController = {
  moving: false,
  limit: 10,
};
let lightIntensity = {
  hemiLight: 1,
  ambientLight: 1,
};

init();

function init() {
  console.log("scene");

  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xebebeb);

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
    250 // 카메라 거리
  );
  camera.position.set(0, 12, 25);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight * 0.7); // 캔버스 사이즈
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.minDistance = 20;
  controls.maxDistance = 50;
  controls.maxPolarAngle = Math.PI / 2;
  // controls.enableRotate = false;

  scene.add(ambientLight, dirLight, hemiLight, dirLightHelper, hemiLightHelper);
  scene.add(pointLight, pointLightHelper, pointLight2, pointLightHelper2);

  const meshGeometry = new THREE.BoxGeometry(200, 250, 100);
  // const meshGeometry = new THREE.SphereGeometry(20, 32, 16);
  const meshMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    opacity: 1,
    side: THREE.DoubleSide,
    transparent: true,
  });

  mesh = new THREE.Mesh(meshGeometry, meshMaterial);
  mesh.position.set(0, 0, -130);
  // scene.add(mesh);

  // window.addEventListener( 'resize', onWindowResize );

  // 전체 배경
  // const hdrPath = "../../../static/texture/MR_INT-005_WhiteNeons_NAD.hdr";
  // const hdrPath = "../../../static/texture/MR_INT-001_NaturalStudio_NAD.hdr";
  // const hdrPath = "../../../static/texture/Window_Lighting_01.jpeg";
  const hdrPath = "../../../static/background/space-1.hdr";
  // const hdrPath = "../../../static/background/glitter-3.hdr";

  new RGBELoader().load(hdrPath, function (texture) {
    scene.background = texture;
    scene.environment = texture;
  });

  // 무대 베이킹본
  loader.load(
    "./static/model/stage-baked/scene.gltf",
    function (gltf) {
      const model = gltf.scene;
      model.position.set(0, -130, 20);
      model.scale.set(25, 25, 25); // orthographic 카메라 사용할때 크기 주의할것
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
  const ballGeometry = new THREE.SphereGeometry(10, 32, 32);
  const ballMat = new THREE.MeshPhysicalMaterial({
    color: 0xff7900,
    metalness: 0.9,
    roughness: 0,
    clearcoat: 1,
    // emissive: 0xffffff,
    // emissiveIntensity: 1,
  });
  loader.load(lotteryPath, function (gltf) {
    lottery = gltf.scene;

    console.log("lottery machine");
    console.log(gltf);

    // lottery.children.forEach((el) => {
    //   el.material = lotteryMat1;
    // });
    lottery.children[3].material = glassMat;
    lottery.children[2].material = transparentMat;
    lottery.children[1].mesh = ballGeometry;
    lottery.children[1].material = ballMat;

    lottery.position.set(0, -30, 0);
    lottery.scale.set(20, 20, 20);

    scene.add(lottery);
  });

  // 샘플 로터리 머신
  const lotterySamplePath =
    "./static/model/lottery-machine/lottery-machine2.glb";
  loader.load(lotterySamplePath, function (gltf) {
    lotterySample = gltf.scene;

    console.log("lottery machine sample");
    console.log(gltf);

    lotterySample.children[0].material = ballMat;
    lotterySample.children[1].material = ballMat;
    lotterySample.children[2].material = ballMat;
    lotterySample.children[3].material = ballMat;
    lotterySample.children[4].material = transparentMat;
    lotterySample.position.set(-200, -300, 0);
    lotterySample.scale.set(800, 800, 800);
    // lotterySample.rotation.y += 90;
    scene.add(lotterySample);

    const lotterySampleAnimations = gltf.animations;
    lotterySampleMixer = new THREE.AnimationMixer(lotterySample);
    // lotterySampleMixer.clipAction(lotterySampleAnimations[0]).play();

    // Create animation actions for each animation
    for (let i = 0; i < lotterySampleAnimations.length; i++) {
      const action = lotterySampleMixer.clipAction(lotterySampleAnimations[i]);
      lotterySampleAction.push(action);
      // console.log("sample animation: " + i);
    }

    // Play all animation actions simultaneously
    lotterySampleAction.forEach((action) => action.play());
  });

  // 마법진?
  const ringPath = "./static/model/magic_ring_green/scene.gltf";
  loader.load(ringPath, function (gltf) {
    ring = gltf.scene;

    console.log("ring");
    console.log(gltf);
    ring.position.set(0, -130, 0);
    ring.scale.set(20, 20, 20);

    scene.add(ring);

    const animations = gltf.animations;
    ringMixer = new THREE.AnimationMixer(ring);
    ringAction = ringMixer.clipAction(animations[0]);
    // console.log(ringMixer.clipAction(animations[0]));

    animate();
  });

  // 폭죽
  // const fireworkPath = "./static/model/firework/scene.gltf";
  // loader.load(
  //   fireworkPath,
  //   function (gltf) {
  //     firework = gltf.scene;

  //     console.log("firework");
  //     console.log(gltf);
  //     firework.position.set(0, 80, 0);
  //     firework.scale.set(8, 8, 8);

  //     scene.add(firework);

  //     // 폭죽 애니메이션
  //     const fireAnimations = gltf.animations;
  //     fireworkMixer = new THREE.AnimationMixer(firework);
  //     fireworkMixer.clipAction(fireAnimations[0]).play();
  //     console.log(fireworkMixer.clipAction(fireAnimations[0]));

  //     // animate();
  //   },
  //   undefined,
  //   function (err) {
  //     console.error(err);
  //   }
  // );

  // 스톰트루퍼
  const trupperPath = "./static/model/dancing_stormtrooper/scene.gltf";
  loader.load(
    trupperPath,
    function (gltf) {
      trupper = gltf.scene;

      console.log("trupper");
      console.log(gltf);
      trupper.position.set(130, -130, 0);
      trupper.scale.set(30, 30, 30);

      scene.add(trupper);

      const trupperAnimations = gltf.animations;
      trupperMixer = new THREE.AnimationMixer(trupper);
      trupperMixer.clipAction(trupperAnimations[0]).play();
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
  // mesh.rotation.y += 0.05;

  let mixerUpdateDelta = clock.getDelta();

  // console.log(mixerUpdateDelta);
  // console.log(mixer);

  // if (fireworkMixer) {
  //   fireworkMixer.update(mixerUpdateDelta);
  // }

  if (ringMixer) {
    ringMixer.update(mixerUpdateDelta);
    // ringAction.play();
  }

  if (trupperMixer) {
    trupperMixer.update(mixerUpdateDelta);
  }

  if (isRingAnimationPlaying) {
    // lotterySampleAction.forEach((action) => action.play());
    ringAction.play();
    lotterySampleMixer.update(mixerUpdateDelta);
  }

  // if (ballController.moving && isRingAnimationPlaying) {
  // 둥둥
  // lottery.position.y += 0.2;

  // 빛 밝기 조절
  // dirLight.intensity += 0.01;
  // ambientLight.intensity += 0.01;
  // hemiLight.intensity += 0.02;
  // console.log(lottery.position.y, ballController.limit);
  // console.log("ambientlight intensity: " + ambientLight.intensity);
  // console.log("hemilight intensity: " + hemiLight.intensity);

  // 조건 달성하면 움직임 중지
  //   if (lottery.position.y > ballController.limit) {
  //     ballController.moving = false;
  //   }
  // }

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
