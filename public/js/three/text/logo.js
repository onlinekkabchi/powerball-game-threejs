import { FontLoader } from "three/addons/loaders/FontLoader.js";

const loader = new FontLoader();

// https://threejs.org/examples/?q=text#webgl_geometry_text_shapes

function createText() {
  loader.load("fonts/helvetiker_regular.typeface.json", function (font) {
    const color = 0x006699;
  });
}
