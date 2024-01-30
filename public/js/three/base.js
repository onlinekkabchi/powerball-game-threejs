import * as THREE from "three";
// import * as POSTPROCESSING from ""
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

// 이펙트
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { BloomPass } from "three/addons/postprocessing/BloomPass.js";
// import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
// import { FocusShader } from "three/addons/shaders/FocusShader.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

// import { LuminosityShader } from "three/addons/shaders/LuminosityShader.js";
// import { SobelOperatorShader } from "three/addons/shaders/SobelOperatorShader.js";

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

import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { rectLight1, rectLight2, rectLight3 } from "./light/light-rect.js";
// import { bulbLight } from "./light/light-bulb.js";

import { spotLight1, spotLightHelper1 } from "./light/light-spot.js";

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
import {
  ballMatGreen,
  ballMatYellow,
  ballMatBlue,
  ballMatRed,
} from "./texture/lottery-ball.js";

const loader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const fbxLoader = new FBXLoader();
const objLoader = new OBJLoader();
const clock = new THREE.Clock();

let animationStartTime = null;

let mesh;
let firework,
  fireworkMixer,
  fireworkAction,
  lottery,
  lotteryMixer,
  lotteryAction = [],
  ring,
  ringMixer,
  ringAction,
  trupper,
  trupperMixer,
  trupperAction,
  particle,
  particleMixer,
  particleAction,
  updownLogo;
// let fireworkMixer, ringMixer, lotteryMixer, trupperMixer;
let lotterySample,
  lotterySampleMixer,
  lotterySampleAction = [];

let group, camera, scene, renderer;

let isRingAnimationPlaying = false;
let animations;

let composer, bloomComposer;

const BLOOM_SCENE = 1;
const bloomLayer = new THREE.Layers();

let ballController = {
  up: true,
  top: 70,
  bottom: 50,
};

init();

function init() {
  console.log("init function start");

  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xebebeb); // 씬 컬러

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
    window.innerHeight / 2,
    window.innerHeight / -2,
    -1000,
    800 // 카메라 거리
  );
  camera.position.set(0, 30, 150);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: false,
    logarithmicDepthBuffer: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight); // 캔버스 사이즈
  renderer.toneMapping = THREE.ReinhardToneMapping;
  // renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // renderer.toneMapping = THREE.CineonToneMapping;
  renderer.toneMappingExposure = 1;
  // renderer.clear(false, true, false);
  console.log("renderer");
  console.log(renderer);

  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.minDistance = 20;
  controls.maxDistance = 50;
  controls.maxPolarAngle = Math.PI / 2;
  controls.maxAzimuthAngle = Math.PI / 2;
  // controls.enableRotate = false;

  // 전체 배경
  const hdrPath = "./static/background/night/night_free_Env.hdr";

  rgbeLoader.load(hdrPath, function (texture) {
    scene.background = texture;
    // scene.environment = texture;
  });

  // 빛 추가
  scene.add(
    ambientLight,
    dirLight,
    hemiLight
    // dirLightHelper, hemiLightHelper
  );
  // scene.add(
  //   pointLight,
  //   pointLightHelper
  // pointLight2, pointLightHelper2
  // );

  // 사각 조명 추가
  RectAreaLightUniformsLib.init();
  scene.add(
    rectLight1,
    //   rectLight2,
    //   rectLight3,
    new RectAreaLightHelper(rectLight1)
    //   new RectAreaLightHelper(rectLight2),
    //   new RectAreaLightHelper(rectLight3)
  );

  // scene.add(spotLight1, spotLightHelper1);

  // 안개 추가
  // Create a fog with the desired color and initial density
  const fogColor = 0x000104;
  const fogDensity = 0.003;
  const fog = new THREE.FogExp2(fogColor, fogDensity);

  // Assign the fog to the scene
  scene.fog = fog;

  // 보정

  const renderPass = new RenderPass(scene, camera);

  bloomLayer.set(BLOOM_SCENE);
  const bloomParams = {
    threshold: 0,
    strength: 0.15,
    radius: 0.5,
    exposure: 0.5,
    scene: "SCENE WITH GLOW",
  };
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
  );
  bloomPass.threshold = bloomParams.threshold;
  bloomPass.strength = bloomParams.strength;
  bloomPass.radius = bloomParams.radius;
  bloomPass.selectedLayer = BLOOM_SCENE;

  const outputPass = new OutputPass();

  // composer 내용
  composer = new EffectComposer(renderer);
  composer.renderToScreen = true;
  composer.addPass(renderPass);
  composer.addPass(bloomPass);
  composer.addPass(outputPass);

  console.log("composer");
  console.log(composer);
  console.log(renderPass);
  console.log(bloomPass);
  // console.log(outputPass);

  // composer.setSize(window.innerWidth, window.innerHeight * 0.7);

  // 테스트 알
  // const eggPath = "../../../static/model/egg/egg.obj";
  // objLoader.load(eggPath, function (obj) {
  // const positions = combineBuffer(obj, "position");
  // createMesh(positions, scene, 4.05, -500, -350, 600, 0xff7744);
  // createMesh(positions, scene, 4.05, 500, -350, 0, 0xff5522);
  // createMesh(positions, scene, 4.05, -250, -350, 1500, 0xff9922);
  // createMesh(positions, scene, 4.05, -250, -350, -1500, 0xff99ff);
  // });

  // 테스트 박스
  const meshGeometry = new THREE.BoxGeometry(100, 100, 100);
  // const meshGeometry = new THREE.SphereGeometry(20, 32, 16);
  const meshMaterialRed = new THREE.MeshStandardMaterial({
    color: 0xebebeb,
    toneMapped: true,
    // emissive: "red",
    // emissiveIntensity: 10,
  });

  mesh = new THREE.Mesh(meshGeometry, meshMaterialRed);
  mesh.position.set(250, 50, 0);
  // scene.add(mesh);

  // 테스트 스피어
  const sphereGeometry = new THREE.SphereGeometry(90, 32, 32);
  const testSphere = new THREE.Mesh(sphereGeometry, glassMat);
  testSphere.position.set(-300, 0, 0); // x: -180
  // scene.add(testSphere);

  // window.addEventListener( 'resize', onWindowResize );

  // 무대
  // const stagePath =  "./static/model/stage/stage-retouch-1.gltf";
  const stagePath = "./static/model/stage-baked/scene.gltf";
  loader.load(
    stagePath,
    function (gltf) {
      const model = gltf.scene;
      model.position.set(0, -130, 20);
      model.scale.set(35, 35, 35); // orthographic 카메라 사용할때 크기 주의할것
      scene.add(model);

      model.children.forEach((el) => (el.material = ballMatBlue));
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (err) {
      console.error(err);
    }
  );

  // 로터리 머신
  const lotteryPath = "./static/model/lottery-machine/lottery-machine2.glb";
  loader.load(lotteryPath, function (gltf) {
    lottery = gltf.scene;

    console.log("lottery machine");
    console.log(gltf);

    lottery.children[0].material = ballMatBlue;
    lottery.children[1].material = ballMatGreen;
    lottery.children[2].material = ballMatYellow;
    lottery.children[3].material = ballMatBlue;

    lottery.children[4].material = glassMat;

    lottery.position.set(300, -350, 0);
    lottery.scale.set(800, 800, 800);

    // scene.add(lottery);

    const lotteryAnimations = gltf.animations;
    lotteryMixer = new THREE.AnimationMixer(lottery);
    // lotteryAction = lotteryMixer.clipAction(animations[0]).play();

    for (let i = 0; i < lotteryAnimations.length; i++) {
      const action = lotteryMixer.clipAction(lotteryAnimations[i]);
      lotteryAction.push(action);
    }

    lotteryAction.forEach((action) => action.play());
  });

  // 샘플 로터리 머신
  // const lotterySamplePath = "./static/model/simulation/emitter-final-3.gltf";
  const lotterySamplePath =
    "./static/model/lottery-machine-remake/tester-3/lottery-machine-wind-4.gltf";
  loader.load(lotterySamplePath, function (gltf) {
    lotterySample = gltf.scene;

    console.log("lottery machine sample");
    console.log(gltf);

    lotterySample.children[0].material = transparentMat;
    // lotterySample.children[0].material = glassMat;
    lotterySample.children[9].material = glassMat;

    lotterySample.children[1].material = ballMatGreen;
    lotterySample.children[2].material = ballMatGreen;
    lotterySample.children[3].material = ballMatGreen;
    lotterySample.children[4].material = ballMatRed;
    lotterySample.children[5].material = ballMatBlue;
    lotterySample.children[6].material = ballMatBlue;
    lotterySample.children[7].material = ballMatBlue;
    lotterySample.children[8].material = ballMatYellow;
    // lotterySample.children[9].material = ballMatBlue;
    lotterySample.children[10].material = ballMatYellow;
    lotterySample.children[11].material = ballMatYellow;
    lotterySample.children[12].material = ballMatYellow;
    lotterySample.children[13].material = ballMatYellow;
    lotterySample.children[14].material = ballMatGreen;
    lotterySample.children[15].material = ballMatGreen;
    lotterySample.children[16].material = ballMatGreen;
    lotterySample.children[17].material = ballMatRed;
    lotterySample.children[18].material = ballMatRed;
    lotterySample.children[19].material = ballMatRed;
    lotterySample.children[20].material = ballMatRed;
    lotterySample.children[21].material = ballMatYellow;
    lotterySample.children[22].material = ballMatYellow;
    lotterySample.children[23].material = ballMatYellow;
    lotterySample.children[24].material = ballMatYellow;
    lotterySample.children[25].material = ballMatBlue;
    lotterySample.children[26].material = ballMatBlue;
    lotterySample.children[27].material = ballMatBlue;
    lotterySample.children[28].material = ballMatBlue;
    // lotterySample.children[29].material = ballMatBlue;

    lotterySample.position.set(0, 30, 0);
    lotterySample.scale.set(40, 40, 40);
    scene.add(lotterySample);

    const lotterySampleAnimations = gltf.animations;
    lotterySampleMixer = new THREE.AnimationMixer(lotterySample);

    // // Create animation actions for each animation
    for (let i = 0; i < lotterySampleAnimations.length; i++) {
      const action = lotterySampleMixer.clipAction(lotterySampleAnimations[i]);
      lotterySampleAction.push(action);
    }

    // // Play all animation actions simultaneously
    lotterySampleAction.forEach((action) => action.play());

    animate();
  });

  // 마법진?
  // const ringPath = "./static/model/magic_ring_green/scene.gltf";
  // const ringPath = "./static/model/magic_ring_yingyangblue/scene.gltf";
  // const ringPath = "./static/model/magic_ring_green-1/ring-1.gltf";
  // loader.load(ringPath, function (gltf) {
  //   ring = gltf.scene;

  //   console.log("ring");
  //   console.log(gltf);
  //   ring.position.set(0, -130, 0);
  //   ring.scale.set(30, 30, 30);

  //   // scene.add(ring);

  //   const animations = gltf.animations;
  //   ringMixer = new THREE.AnimationMixer(ring);
  //   ringAction = ringMixer.clipAction(animations[0]).play();
  //   // console.log(ringMixer.clipAction(animations[0]));

  // });

  // 업다운 로고
  const logoPath = "./static/model/updwon-logo/updown-logo-3.gltf";
  loader.load(logoPath, function (gltf) {
    updownLogo = gltf.scene;

    updownLogo.position.set(-30, 180, 0);
    updownLogo.scale.set(50, 50, 50);

    scene.add(updownLogo);
  });

  // 폭죽
  const fireworkPath = "./static/model/firework/scene.gltf";
  loader.load(
    fireworkPath,
    function (gltf) {
      firework = gltf.scene;

      console.log("firework");
      console.log(gltf);
      firework.position.set(0, 50, 0);
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

  // 로봇
  const robotPath = "./static/model/dancing_robot/robot-3.gltf";
  const trupperPath = "./static/model/dancing_stormtrooper/scene.gltf";
  loader.load(
    robotPath,
    function (gltf) {
      trupper = gltf.scene;

      console.log("robot");
      console.log(gltf);

      trupper.position.set(30, -150, 400);
      trupper.scale.set(18, 18, 18);

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

  // updownLogo.rotation.y -= 0.005;
  // mesh.rotation.y += 0.05;

  let mixerUpdateDelta = clock.getDelta();

  // console.log(mixerUpdateDelta);
  // console.log(mixer);

  if (fireworkMixer) {
    // firework.rotation.y += 0.01;
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
    //   ringAction.play();
    lotterySampleMixer.update(mixerUpdateDelta * 2.5);
    lotteryMixer.update(mixerUpdateDelta);
  }

  // if (camera.position.x < 0) {
  //   camera.position.x += 0.5;
  //   camera.lookAt(0, 0, 0);
  // }

  // camera.layers.set(BLOOM_SCENE);
  composer.render();
  // bloomComposer.render();
  // render();
}

function render() {
  renderer.render(scene, camera);
}

setTimeout(() => {
  console.log("ring animation playing..");

  isRingAnimationPlaying = true;
  ballController.moving = true;
}, 3000);
