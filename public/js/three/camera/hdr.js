import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

// 씬 배경
const hdrPath = "../../../static/texture/MR_INT-005_WhiteNeons_NAD.hdr";
// const hdrPath = "../../../static/texture/MR_INT-001_NaturalStudio_NAD.hdr";
// const hdrPath = "../../../static/texture/window-lighting-01.hdr";
// const hdrPath = "../../../static/texture/studio-lighting-05.hdr";
// const hdrPath = "../../../static/texture/studio-lighting-light-01.hdr";

const hdrLoader = new RGBELoader().load(hdrPath, function (texture) {
  console.log("hdrtexture!!");

  texture.mapping = THREE.EquirectangularReflectionMapping;
  // scene.background = texture;
  // scene.environment = texture;
});

export { hdrLoader };
