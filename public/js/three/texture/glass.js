import * as THREE from "three";
import { hdrLoader } from "../camera/hdr.js";

// const glassMat = new THREE.MeshPhysicalMaterial({
//   color: 0xffffff,
//   metalness: 1,
//   roughness: 0,
//   clearcoat: 1,
//   transparent: true,
//   opacity: 0.5,
//   reflectivity: 0.1,
//   refractionRatio: 0.9,
//   ior: 1,
//   side: THREE.BackSide,
//   envMap: hdrLoader,
//   envMapIntensity: 1,
//   // emissive: 0xffffff,
//   // emissiveIntensity: 0.1,
// });
const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  clearcoat: 1,
  transmission: 1,
  // transparent: true,
  // opacity: 0.5,
  // reflectivity: 0.1,
  // refractionRatio: 0.9,
  ior: 2.33,
  envMap: hdrLoader,
  envMapIntensity: 1,
  opacity: 1,
  side: THREE.BackSide,
});
const transparentMat = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0,
});

export { glassMat, transparentMat };
