import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { hdrLoader } from "../camera/hdr.js";

const loader = new GLTFLoader();

const params = {
  color: 0x808080,
  transmission: 1,
  opacity: 1,
  metalness: 0,
  roughness: 0,
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
};

const glossyMat = new THREE.MeshStandardMaterial({
  color: params.color,
  metalness: params.metalness,
  roughness: params.roughness,
  // 반사광
  // envMap: hdrLoader,
  // envMapIntensity: params.envMapIntensity,
  // reflectivity: params.reflectivity,
  name: "gray1",
});

function stage(scene) {
  // 무대 원본
  loader.load(
    "./static/model/stage.glb",
    function (gltf) {
      const model = gltf.scene;

      // console.log("stage-origin");
      // console.log(gltf);
      // console.log(model);

      model.children.forEach((el) => {
        el.material = glossyMat;
      });

      model.position.set(0, 0, 0);
      model.scale.set(10, 10, 10);
      scene.add(model);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (err) {
      console.error(err);
    }
  );
}

function stageBaked(scene) {
  // 무대 베이킹본
  loader.load(
    "./static/model/stage-baked/scene.gltf",
    function (gltf) {
      const model = gltf.scene;

      // console.log(model);

      model.position.set(0, -1000, 0);
      model.scale.set(20, 20, 20);
      scene.add(model);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (err) {
      console.error(err);
    }
  );
}

export { stage, stageBaked };
