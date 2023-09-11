import * as THREE from "three";
import { ImprovedNoise } from "https://cdn.skypack.dev/three@0.137.5/examples/jsm/math/ImprovedNoise";

// unrealbloom 테스트

const params = {
  exposure: 1.05,
  bloomStrength: 1.5,
  bloomThreshold: 0.5,
  bloomRadius: 0,
};

let testPlane = new THREE.PlaneGeometry(20, 20, 400, 400);
let testPlanePosition = testPlane.attributes.position;
let testPlaneUV = testPlane.attributes.uv;
let planeVector2 = new THREE.Vector2();
const perlin = new ImprovedNoise();

for (let i = 0; i < testPlanePosition.count; i++) {
  planeVector2.fromBufferAttribute(testPlaneUV, i).multiplyScalar(10);
  let y = perlin.noise(planeVector2.x, planeVector2.y, 100);
  y = Math.pow(Math.abs(y), 0.5) * 0.5;
  testPlanePosition.setY(i, y);
}

testPlane.computeVertexNormals();

let tl = new THREE.TextureLoader();
let uniforms = {
  rectSize: { value: new THREE.Vector2(5, 4) },
  rectWidth: { value: 0.125 },
  uvScale: { value: new THREE.Vector2(2.0, 2.0) },
  time: { value: 0 },
  texture1: {
    value: tl.load(
      "https://threejs.org/examples/textures/lava/cloud.png",
      (tex) => {
        tex.wrapT = tex.wrapS = THREE.RepeatWrapping;
      }
    ),
  },
  texture2: {
    value: tl.load(
      "https://threejs.org/examples/textures/lava/lavatile.jpg",
      (tex) => {
        tex.wrapT = tex.wrapS = THREE.RepeatWrapping;
      }
    ),
  },
};
