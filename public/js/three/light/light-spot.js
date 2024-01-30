import * as THREE from "three";

const params = {
  angle: 0.3,
  penumbra: 0.3,
  decay: 0.5,
  distance: 500,
  intensity: 1,
};

const spotLight1 = new THREE.SpotLight(0x00ff00);
spotLight1.angle = params.angle;
spotLight1.penumbra = params.penumbra;
spotLight1.decay = params.decay;
spotLight1.distance = params.distance;
// spotLight1.intensity = params.intensity;
spotLight1.position.set(0, 300, 0);
// spotLight1.castShadow = true;

const spotLightHelper1 = new THREE.SpotLightHelper(spotLight1);

export { spotLight1, spotLightHelper1 };
