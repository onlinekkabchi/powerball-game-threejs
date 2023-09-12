import * as THREE from "three";
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
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
import { FocusShader } from "three/addons/shaders/FocusShader.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
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
  particleAction;
// let fireworkMixer, ringMixer, lotteryMixer, trupperMixer;
let lotterySample,
  lotterySampleMixer,
  lotterySampleAction = [];

let group, camera, scene, renderer;

let isRingAnimationPlaying = false;
let animations;

let composer;

let ballController = {
  up: true,
  top: 70,
  bottom: 50,
};

init();

function init() {
  console.log("init function start");

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
    700 // 카메라 거리
  );
  camera.position.set(0, 55, 120);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight * 0.7); // 캔버스 사이즈
  renderer.toneMapping = THREE.ReinhardToneMapping;
  // renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // renderer.toneMapping = THREE.CineonToneMapping;

  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.minDistance = 20;
  controls.maxDistance = 50;
  controls.maxPolarAngle = Math.PI / 2;
  controls.maxAzimuthAngle = Math.PI / 2;
  // controls.enableRotate = false;

  // 빛 추가
  scene.add(
    ambientLight,
    dirLight,
    hemiLight
    // dirLightHelper, hemiLightHelper
  );
  scene.add(
    pointLight,
    pointLightHelper
    // pointLight2, pointLightHelper2
  );

  // 안개 추가
  // Create a fog with the desired color and initial density
  const fogColor = 0x000104;
  const fogDensity = 0.003;
  const fog = new THREE.FogExp2(fogColor, fogDensity);

  // Assign the fog to the scene
  scene.fog = fog;

  // 블룸효과
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
  );
  bloomPass.threshold = 0;
  bloomPass.strength = 1;
  bloomPass.radius = 1;
  // const bloomPass = new BloomPass(0.75);

  // const outputPass = new OutputPass();

  composer = new EffectComposer(renderer);

  composer.addPass(renderScene);
  composer.addPass(bloomPass);
  console.log("composer");
  console.log(composer);
  // composer.addPass(outputPass);
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

  // 테스트 스피어
  const sphereGeometry = new THREE.SphereGeometry(90, 32, 32);
  const testSphere = new THREE.Mesh(sphereGeometry, glassMat);
  testSphere.position.set(-300, 0, 0); // x: -180
  // scene.add(testSphere);

  // window.addEventListener( 'resize', onWindowResize );

  // 전체 배경
  // const hdrPath = "../../../static/texture/MR_INT-005_WhiteNeons_NAD.hdr";
  // const hdrPath = "../../../static/texture/MR_INT-001_NaturalStudio_NAD.hdr";
  // const hdrPath = "../../../static/texture/Window_Lighting_01.jpeg";
  const hdrPath = "../../../static/background/space-1.hdr";
  // const hdrPath = "../../../static/background/milky-way-1.hdr";
  // const hdrPath = "../../../static/background/night-city-2.hdr";
  // const hdrPath = "../../../static/background/green-galaxy-1.hdr";
  // const hdrPath = "../../../static/background/space-green-1.hdr";

  rgbeLoader.load(hdrPath, function (texture) {
    scene.background = texture;
    // scene.environment = texture;
  });

  // 무대 베이킹본
  loader.load(
    "./static/model/stage-baked/scene.gltf",
    function (gltf) {
      const model = gltf.scene;
      model.position.set(0, -130, 20);
      model.scale.set(40, 40, 40); // orthographic 카메라 사용할때 크기 주의할것
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
    lottery.scale.set(1100, 1100, 1100);

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
    "./static/model/lottery-machine-remake/tester-3/lottery-machine-rigid-12.gltf";
  loader.load(lotterySamplePath, function (gltf) {
    lotterySample = gltf.scene;

    console.log("lottery machine sample");
    console.log(gltf);

    lotterySample.children[2].material = transparentMat;
    lotterySample.children[11].material = glassMat;

    lotterySample.children[3].material = ballMatGreen;
    // lotterySample.children[3].material = ballMatGreen;
    lotterySample.children[4].material = ballMatRed;
    lotterySample.children[5].material = ballMatBlue;
    lotterySample.children[6].material = ballMatBlue;
    lotterySample.children[7].material = ballMatBlue;
    lotterySample.children[8].material = ballMatYellow;
    lotterySample.children[9].material = ballMatBlue;
    lotterySample.children[10].material = ballMatYellow;
    // lotterySample.children[11].material = ballMatYellow;
    lotterySample.children[12].material = ballMatYellow;
    lotterySample.children[13].material = ballMatYellow;
    lotterySample.children[14].material = ballMatGreen;
    lotterySample.children[15].material = ballMatGreen;
    lotterySample.children[16].material = ballMatGreen;
    lotterySample.children[17].material = ballMatRed;
    lotterySample.children[18].material = ballMatRed;

    // for (let i = 6; i < lotterySample.children.length; i++) {
    //   const element = lotterySample.children[i];
    //   element.material = testMaterial3;
    // }

    lotterySample.position.set(0, 60, 0);
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
  });

  // 마법진?
  const ringPath = "./static/model/magic_ring_green/scene.gltf";
  // const ringPath = "./static/model/magic_ring_yingyangblue/scene.gltf";
  loader.load(ringPath, function (gltf) {
    ring = gltf.scene;

    console.log("ring");
    console.log(gltf);
    ring.position.set(0, -130, 0);
    ring.scale.set(30, 30, 30);

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
      firework.position.set(0, 150, 0);
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
      trupper.position.set(250, -100, 30);
      trupper.scale.set(50, 50, 50);

      // scene.add(trupper);

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
    //   ringAction.play();
    lotterySampleMixer.update(mixerUpdateDelta * 1.5);
    lotteryMixer.update(mixerUpdateDelta);
  }

  composer.render();
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
