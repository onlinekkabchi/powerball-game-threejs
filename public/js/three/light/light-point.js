import * as THREE from "three";

const sphere = new THREE.SphereGeometry(0.5, 16, 8);
const sphereMat = new THREE.MeshBasicMaterial({ color: 0x81007f }); // Lollipop

// 흰색
const pointLight = new THREE.PointLight(0xffffff, 400);
pointLight.add(new THREE.Mesh(sphere, sphereMat));
const pointLightHelper = new THREE.PointLightHelper(pointLight, 20);
pointLight.position.set(0, 100, 0);
pointLight.lookAt(0, 0, 0);
pointLight.castShadow = true;
pointLight.intensity = 1000;

// 보라색
const pointLight2 = new THREE.PointLight(0x81007f, 400);
pointLight2.add(new THREE.Mesh(sphere, sphereMat));
pointLight2.position.set(300, 300, 0);
pointLight2.lookAt(0, 0, 0);
pointLight2.intensity = 10;

const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 20);

export { pointLight, pointLightHelper, pointLight2, pointLightHelper2 };
