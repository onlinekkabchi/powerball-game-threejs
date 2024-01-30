import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ObjectLoader } from "three";

const gltfLoader = new GLTFLoader();
const objLoader = new ObjectLoader();

async function lottery(path, gscene) {
  //   로터리 머신
  const file = await gltfLoader.loadAsync(path);

  const model = file.scene;
  console.log("lottery machine");
  console.log(model);

  model.position.set(0, -5, 0);
  model.scale.set(20, 20, 20);
  gscene.add(model);
}

async function objLottery(scene) {
  await objLoader.load("./static/model/lottery-machine.obj", function (obj) {
    scene.add(obj);
  }), // called when loading is in progresses
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
      console.log("An error happened");
    };
}

export { lottery, objLottery };
