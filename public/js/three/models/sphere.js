import * as THREE from "three";
import { hdrLoader } from "../camera/hdr.js";

const geometry1 = new THREE.SphereGeometry(15, 32, 32);
const material1 = new THREE.MeshStandardMaterial({
  emissive: 0xd2d1d1, // 0xff00dd 핫핑크, d2d1d1 연회색
  emissiveIntensity: 1,
  color: 0xff00dd,
  roughness: 0,
  metalness: 1, // 반사광있는 금속재질
  //   transmission: 1, // 'transmission' is not a property of this material;
  transparent: 1,
  envMap: hdrLoader,
  envMapIntensity: 0.1,
});

const geometry2 = new THREE.SphereGeometry(15, 32, 32);
const material2 = new THREE.MeshPhysicalMaterial({
  color: 0xd2d1d1,
  emissive: 0xd2d1d1,
  emissiveIntensity: 1,
  metalness: 0,
  roughness: 0,
  transparent: 1,
  // refractionRatio: 0.98,
  //   reflectivity: 0.9,
  transmission: 1,
  envMap: hdrLoader,
  envMapIntensity: 0.1,
  thickness: 0.1,
});

const sphere = new THREE.Mesh(geometry1, material1);
sphere.position.set(50, 25, 0);
sphere.scale.set(1, 1, 1);

const sphere1 = new THREE.Mesh(geometry2, material2);
sphere1.position.set(90, 25, 0);
sphere1.scale.set(1, 1, 1);

export { sphere, sphere1 };
