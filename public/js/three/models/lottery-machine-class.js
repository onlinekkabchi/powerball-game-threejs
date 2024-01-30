import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { hdrLoader } from "../camera/hdr.js";

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

// 유리 질감 샘플
let options = {
  roughness: 0,
  transmission: 1,
  thickness: 2,
};
const glass1 = new THREE.MeshPhysicalMaterial({
  color: 0xccddff,
  metalness: 0,
  roughness: 0,
});

const normalMapPath = "../../../static/texture/Window_Lighting_01.jpeg";
// "../../../static/texture/Studio_Lighting_05.jpeg"
const normalMap = textureLoader.load(normalMapPath);
normalMap.wrapS = THREE.RepeatWrapping;
normalMap.wrapT = THREE.RepeatWrapping;
normalMap.repeat.x = 10;
normalMap.repeat.y = 10;

const params = {
  color: 0xffffff,
  transmission: 1,
  opacity: 1,
  metalness: 0,
  roughness: 0.2,
  clearcoat: 1,
  clearcoatRoughness: 1,
  ior: 1.5,
  thickness: 0.01,
  specularIntensity: 1,
  specularColor: 0xffffff,
  envMapIntensity: 0.1,
  lightIntensity: 1,
  exposure: 1,
  refractionRatio: 0.98,
  reflectivity: 0.9,
  // attenuationColor: 0xffffff,
  // attenuationDistance: 1,
};

// const texture = new THREE.CanvasTexture(generateTexture());
// texture.magFilter = THREE.NearestFilter;
// texture.wrapT = THREE.RepeatWrapping;
// texture.wrapS = THREE.RepeatWrapping;
// texture.repeat.set(1, 3.5);

const glasstransparent = new THREE.MeshPhysicalMaterial({
  color: params.color,
  metalness: params.metalness,
  roughness: params.roughness,
  clearcoat: params.clearcoat,
  clearcoatRoughness: params.clearcoatRoughness,
  ior: params.ior,
  // alphaMap: texture,
  envMap: hdrLoader,
  // normalMap: normalMap,
  // normalScale: new THREE.Vector2(0.15, 0.15),
  envMapIntensity: params.envMapIntensity,
  transmission: params.transmission, // use material.transmission for glass materials
  // specularIntensity: params.specularIntensity,
  // specularColor: params.specularColor,
  opacity: params.opacity,
  refractionRatio: params.refractionRatio,
  reflectivity: params.reflectivity,
  side: THREE.DoubleSide,
  transparent: true,

  emissive: 0xffffff,
  emissiveIntensity: 1,

  // attenuationColor: params.attenuationColor,
  // attenuationDistance: params.attenuationDistance,
});

// function generateTexture() {
//   const canvas = document.createElement("canvas");
//   canvas.width = 2;
//   canvas.height = 2;

//   const context = canvas.getContext("2d");
//   context.fillStyle = "white";
//   context.fillRect(0, 1, 2, 1);

//   return canvas;
// }

export default class Lottery {
  constructor(path, scene) {
    this.path = path;
    this.scene = scene;
    this.file = null;
    this.model = null;
    this.mixer = null;
  }
  async load() {
    const file = await loader.loadAsync(this.path);
    this.model = file.scene;

    console.log("lottery machine");
    console.log(file);
    // console.log(this.model);
    // console.log(this.model.children[4]);

    // 로터리 머신 애니메이션
    // this.mixer = new THREE.AnimationMixer(this.model);
    // this.mixer.clipAction(file.animations[0]).play();

    // 유리 씌우기
    const dom = this.model.children[2];
    dom.material = glasstransparent;
    const terrein = this.model.children[3];
    terrein.material = glasstransparent;

    this.model.position.set(0, 27, 0);
    this.model.scale.set(7, 7, 7);

    this.scene.add(this.model);
  }
  animate() {
    console.log(this);
    // this.mixer.clipAction(this.file.animations[0]).play();
  }
}
