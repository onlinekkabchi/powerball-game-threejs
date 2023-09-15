import * as THREE from "three";

const params = {
  exposure: 1.05,
  bloomStrength: 1.5,
  bloomThreshold: 0.5,
  bloomRadius: 0,
};

const ballMatGreen = new THREE.MeshPhysicalMaterial({
  color: 0x006b3d,
  metalness: 0.9,
  roughness: 0.1,
  // clearcoat: 1,
  emissive: 0xffffff,
  emissiveIntensity: 0.1,
});

const ballMatYellow = new THREE.MeshPhysicalMaterial({
  color: 0xfdcc0c,
  metalness: 0.9,
  roughness: 0.1,
  // clearcoat: 1,
  emissive: 0xffffff,
  emissiveIntensity: 0.1,
});
const ballMatBlue = new THREE.MeshPhysicalMaterial({
  color: 0x000083,
  metalness: 0.9,
  roughness: 0.1,
  clearcoat: 1,
  emissive: 0xffffff,
  emissiveIntensity: 0.1,
});
const ballMatRed = new THREE.MeshPhysicalMaterial({
  color: 0xa11c0f,
  metalness: 0.9,
  roughness: 0.1,
  // clearcoat: 1,
  emissive: 0xffffff,
  emissiveIntensity: 0.1,
});

const darkMat = new THREE.MeshBasicMaterial({ color: "black" });

const glowBallMat = null;

export { ballMatGreen, ballMatYellow, ballMatBlue, ballMatRed, glowBallMat };
