import * as THREE from "three";

const geometry = new THREE.BoxGeometry(1, 1, 1);

// const material1 = new THREE.MeshBasicMaterial({ color: 0xffffff });
const material1 = new THREE.MeshStandardMaterial({
  emissive: 0xff0000,
  emissiveIntensity: 1,
  color: 0xff0000,
});
// const material2 = new THREE.MeshBasicMaterial({ color: 0x00ffff });
const material2 = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  transparent: 1,
  // refractionRatio: 0.98,
  //   reflectivity: 0.9,
  transmission: 1,
  // envMap: hdrLoader,
  // envMapIntensity: 0.1,
  thickness: 0.1,
});
const material3 = new THREE.MeshBasicMaterial({ color: 0xffff00 });

const cube1 = new THREE.Mesh(geometry, material1);
// cube1.castShadow = true;

const cube2 = new THREE.Mesh(geometry, material2);
const stageFlag = new THREE.Mesh(geometry, material3);

cube1.position.set(0, 50, 0);
cube1.scale.set(10, 10, 10);
cube2.position.set(0, 100, 0); // 텍스쳐 테스트중
cube2.scale.set(10, 10, 10);
stageFlag.position.set(0, 10, 0);
stageFlag.scale.set(0.1, 0.1, 0.1);

export { cube1, cube2, stageFlag };
