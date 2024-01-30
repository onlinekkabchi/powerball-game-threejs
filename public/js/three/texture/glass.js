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

function generateTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 2;

  const context = canvas.getContext("2d");
  context.fillStyle = "white";
  context.fillRect(0, 1, 2, 1);

  return canvas;
}

const glassTexture = new THREE.CanvasTexture(generateTexture());
glassTexture.magFilter = THREE.NearestFilter;
glassTexture.wrapT = THREE.RepeatWrapping;
glassTexture.wrapS = THREE.RepeatWrapping;
glassTexture.repeat.set(1, 3.5);

const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  // metalness: 0,
  roughness: 0,
  clearcoat: 1,
  transmission: 1, // 값을 올릴 경우 화면 톤전체가 엄청 밝아짐
  transparent: true,
  reflectivity: 1,
  // refractionRatio: 0.9,
  ior: 2.33,
  // alphaMap: glassTexture,
  envMap: hdrLoader,
  envMapIntensity: 0.3,
  opacity: 1,
  side: THREE.BackSide,
  transparent: true,
});
const transparentMat = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0,
});

export { glassMat, transparentMat };
