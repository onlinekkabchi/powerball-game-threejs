import * as THREE from "three";
import { EffectComposer } from "https://cdn.skypack.dev/three@0.137.5/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "https://cdn.skypack.dev/three@0.137.5/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "https://cdn.skypack.dev/three@0.137.5/examples/jsm/postprocessing/UnrealBloomPass";

const params = {
  exposure: 1.05,
  bloomStrength: 1.5,
  bloomThreshold: 0.5,
  bloomRadius: 0,
};

const ballMat = new THREE.MeshPhysicalMaterial({
  color: 0x6aa68b,
  metalness: 0.25,
  roughness: 0.75,
  clearcoat: 1,
  emissive: 0xffffff,
  emissiveIntensity: 0.1,
});

const glowBallMat = null;

export { ballMat, glowBallMat };
