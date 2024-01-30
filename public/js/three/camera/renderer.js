import * as THREE from "three";

// 캔버스 생성 및 랜더링 조건 설정
const params = {
  exposure: 0.57,
  toneMapping: "ACESFilmic",
  blurriness: 0.3,
  intensity: 1.0,
};
const toneMappingOptions = {
  None: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
  Custom: THREE.CustomToneMapping,
};

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.toneMapping = THREE.ReinhardToneMapping;
// renderer.toneMapping = toneMappingOptions.ACESFilmic;
renderer.toneMapping = toneMappingOptions.Cineon;
// renderer.toneMapping = toneMappingOptions.Reinhard;
renderer.toneMappingExposure = Math.pow(params.exposure, 5.0);
renderer.outputColorSpace = THREE.outputColorSpace;
renderer.setPixelRatio(window.devicePixelRatio);

// 캔버스 사이즈
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setViewport(1, 1, window.innerWidth, window.innerHeight);

export { renderer };
