import * as THREE from "three";

const pballMatGreen = new THREE.MeshPhysicalMaterial({
  // color: 0x006b3d,
  color: 0x29af34,
  metalness: 0.9,
  roughness: 0.1,
  clearcoat: 1,
});

const pballMatYellow = new THREE.MeshPhysicalMaterial({
  // color: 0xfdcc0c,
  // color: 0xffffff, // yellow
  color: 0xfebe00, // amber
  metalness: 0.9,
  roughness: 0.1,
  clearcoat: 1,
});
const pballMatBlue = new THREE.MeshPhysicalMaterial({
  // color: 0x000083,
  color: 0x2347bd,
  metalness: 0.9,
  roughness: 0.1,
  clearcoat: 1,
  // emissive: "blue",
  // emissiveIntensity: 1,
});
const pballMatRed = new THREE.MeshPhysicalMaterial({
  // color: 0xa11c0f,
  color: 0x8e0500,
  metalness: 0.9,
  roughness: 0.1,
  clearcoat: 1,
  // emissive: "red",
  // emissiveIntensity: 1,
});

// let texture = new THREE.CanvasTexture(new FlakesTexture());
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
// texture.repeat.x = 10;
// texture.repeat.y = 6;

const ballMatGreen = new THREE.MeshPhysicalMaterial({
  color: 0x29af34,
  // color: 0x013220,
  metalness: 0.7,
  roughness: 0.5,
  clearcoat: 1,
  toneMapped: true,
  emissive: "blue",
  emissiveIntensity: 1,
});
const ballMatYellow = new THREE.MeshStandardMaterial({
  color: 0xfebe00,
  metalness: 0.9,
  roughness: 0.5,
  clearcoat: 1,
  toneMapped: true,
  emissive: "green",
  emissiveIntensity: 1,
});
const ballMatRed = new THREE.MeshPhysicalMaterial({
  color: 0x8e0500,
  // toneMapped: true,
  metalness: 0.9,
  roughness: 0.5,
  clearcoat: 1,
  toneMapped: true,
  emissive: "yellow",
  emissiveIntensity: 10,
});
const ballMatBlue = new THREE.MeshStandardMaterial({
  color: 0x2347bd,
  metalness: 0.9,
  roughness: 0.5,
  clearcoat: 1,
  toneMapped: true,
  emissive: "red",
  emissiveIntensity: 1,
});

export { ballMatGreen, ballMatYellow, ballMatBlue, ballMatRed };
