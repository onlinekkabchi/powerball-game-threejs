import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

// 컴포저
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { BloomPass } from "three/addons/postprocessing/BloomPass.js";
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
import { FocusShader } from "three/addons/shaders/FocusShader.js";
// import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

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

// import { spaceman } from "./models/spaceman.js";

// // 텍스쳐
// import { hdrLoader } from "./camera/hdr.js";
import { glassMat, transparentMat } from "./texture/glass.js";

const loader = new GLTFLoader();
const fbxLoader = new FBXLoader();
const clock = new THREE.Clock();

let animationStartTime = null;

let mesh;
let firework,
  fireworkMixer,
  fireworkAction,
  lottery,
  lotteryMixer,
  lotteryAction,
  ring,
  ringMixer,
  ringAction,
  trupper,
  trupperMixer,
  trupperAction,
  particle,
  particleMixer,
  particleAction;
// let fireworkMixer, ringMixer, lotteryMixer, trupperMixer;
let lotterySample, lotterySampleMixer;
let lotterySampleAction = [];

let group, camera, scene, renderer;

let isRingAnimationPlaying = false;
let animations;

let composer;

let ballController = {
  moving: false,
  limit: 10,
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
  camera.position.set(0, 15, 25);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight * 0.7); // 캔버스 사이즈
  renderer.toneMapping = THREE.ReinhardToneMapping;
  // renderer.toneMapping = THREE.CineonToneMapping;

  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.minDistance = 20;
  controls.maxDistance = 50;
  controls.maxPolarAngle = Math.PI / 2;
  // controls.enableRotate = false;

  scene.add(
    ambientLight,
    dirLight,
    hemiLight
    // dirLightHelper, hemiLightHelper
  );
  scene.add(pointLight, pointLightHelper, pointLight2, pointLightHelper2);

  // 테스트 박스
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

  // 테스트 스피어
  const sphereGeometry = new THREE.SphereGeometry(60, 32, 16);
  const sphere = new THREE.Mesh(sphereGeometry, glassMat);
  // sphere.material = glassMat;
  sphere.position.set(-200, 10, 0);
  scene.add(sphere);

  // scene.add(mesh);

  // window.addEventListener( 'resize', onWindowResize );

  // 전체 배경
  // const hdrPath = "../../../static/texture/MR_INT-005_WhiteNeons_NAD.hdr";
  // const hdrPath = "../../../static/texture/MR_INT-001_NaturalStudio_NAD.hdr";
  // const hdrPath = "../../../static/texture/Window_Lighting_01.jpeg";
  // const hdrPath = "../../../static/background/space-1.hdr";
  // const hdrPath = "../../../static/background/milky-way-1.hdr";
  // const hdrPath = "../../../static/background/night-city-2.hdr";
  const hdrPath = "../../../static/background/green-galaxy-1.hdr";

  new RGBELoader().load(hdrPath, function (texture) {
    scene.background = texture;
    // scene.environment = texture;
  });

  // 무대 베이킹본
  loader.load(
    "./static/model/stage-baked/scene.gltf",
    function (gltf) {
      const model = gltf.scene;
      model.position.set(0, -130, 20);
      model.scale.set(30, 25, 30); // orthographic 카메라 사용할때 크기 주의할것
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
  const lotteryPath =
    "./static/model/lottery-machine-remake/simulation-to-mesh-1.gltf";
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
    lottery.children[1].material = glassMat;
    // lottery.children[11].material = transparentMat;
    // lottery.children[2].mesh = ballGeometry;
    lottery.children[0].material = ballMat;

    lottery.position.set(0, -30, 0);
    lottery.scale.set(20, 20, 20);

    // scene.add(lottery);

    const animations = gltf.animations;
    lotteryMixer = new THREE.AnimationMixer(lottery);
    lotteryAction = lotteryMixer.clipAction(animations[0]).play();
  });

  // 샘플 로터리 머신
  const lotterySamplePath = "./static/model/simulation/emitter-final-3.gltf";
  loader.load(lotterySamplePath, function (gltf) {
    lotterySample = gltf.scene;

    console.log("lottery machine sample");
    console.log(gltf);

    // lotterySample.children[113].material = ballMat;
    // lotterySample.children[0].material = transparentMat;
    lotterySample.children[0].material = glassMat;
    lotterySample.children[1].material = transparentMat;
    lotterySample.children[2].material = transparentMat;

    for (let i = 3; i < lotterySample.children.length; i++) {
      const element = lotterySample.children[i];
      element.material = ballMat;
    }

    // lotterySample.children.forEach((el) => (el.material = ballMat));

    lotterySample.position.set(0, 10, 0);
    lotterySample.scale.set(20, 20, 20);
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
    ring.scale.set(25, 25, 25);

    scene.add(ring);

    const animations = gltf.animations;
    ringMixer = new THREE.AnimationMixer(ring);
    ringAction = ringMixer.clipAction(animations[0]).play();
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

      firework.position.set(0, 90, 0);
      firework.scale.set(10, 10, 10);

      scene.add(firework);

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

  // 우주복
  // spaceman(scene);

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

  if (fireworkMixer) {
    fireworkMixer.update(mixerUpdateDelta);
  }

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
    lotteryMixer.update(mixerUpdateDelta);
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
