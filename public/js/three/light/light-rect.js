import * as THREE from "three";

// rect light 빛 옵션
const light = {
  white: 0xfffffff,
  red: 0xff0000,
  green: 0x00ff00,
  blue: 0x0000ff,
};
const params = {
  width: 10,
  height: 10,
  intensity: 200,
};
const rectLight1 = new THREE.RectAreaLight(
  light.white,
  params.intensity,
  params.width,
  params.height
);
rectLight1.position.set(0, 180, 0);
rectLight1.lookAt(30, 0, 0);

const rectLight2 = new THREE.RectAreaLight(
  light.blue,
  params.intensity,
  params.width,
  params.height
);
rectLight2.position.set(100, 150, 0);
rectLight2.lookAt(30, 0, 0);

const rectLight3 = new THREE.RectAreaLight(light.blue, 50, 40, 10);
rectLight3.position.set(5, 30, 5);
rectLight3.lookAt(30, 0, 0);

export { rectLight1, rectLight2, rectLight3 };
