import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

const spacemanPath = "../../../../static/model/spaceman/scene.gltf";
const spaceman = (scene) =>
  loader.load(spacemanPath, function (gltf) {
    const model = gltf.scene;

    console.log("spaceman");
    console.log(gltf);

    model.position.set(130, 0, 30);
    model.scale.set(20, 20, 20);
    model.rotation.z += 5;

    scene.add(model);
  });

export { spaceman };
