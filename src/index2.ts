import * as THREE from "three";

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// camera
// perspective: zoom in and out
// orthographic:  size object is equal, object near or far
const NEAR = 0.1;
const FAR = 1000;
const FOV = 45;
const ASPECT = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
camera.position.set(5, 2, 10); // camera.position.x = 5, camera.position.y = 2,  camera.position.z = 10;

let scene = new THREE.Scene();

// axes helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x339966 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);

scene.add(box);

// orbit control
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// plane
const planeGeometry = new THREE.PlaneGeometry(40, 40);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xeeeeee,
  side: THREE.DoubleSide, // undefined or show two side
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
scene.add(plane);

// grid helper
const gridHelper = new THREE.GridHelper(60, 70);
scene.add(gridHelper);

// sphere
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x2255ee,
  wireframe: true, // as wireframe
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 10;
scene.add(sphere);

import * as dat from "dat.gui";
const gui = new dat.GUI();
const options = {
  sphereColor: "#2211ff",
  wireframe: true,
  speed: 0.01,

  // spot light
  angle: 0.9,
  penumbra: 0,
  intensity: 1,
};

gui.addColor(options, "sphereColor").onChange((value) => {
  sphere.material.color.set(value);
});

gui.add(options, "wireframe").onChange((value) => {
  sphere.material.wireframe = value;
});

gui.add(options, "speed", 0, 0.1);
gui.add(options, "angle", 0, 1);
gui.add(options, "penumbra", 0, 1);
gui.add(options, "intensity", 0, 1);

let step = 0;

// ambientLight
const ambientLight = new THREE.AmbientLight(0x773311);
scene.add(ambientLight);

// to reflex ambientLigth
const box2Geometry = new THREE.BoxGeometry(3, 5, 30);
const box2Material = new THREE.MeshStandardMaterial(); // standard reflect enviroment
const box2 = new THREE.Mesh(box2Geometry, box2Material);
box2.position.x = -4;
box2.position.y = 4;
scene.add(box2);

// to reflex ambientLigth
const box3Geometry = new THREE.BoxGeometry(2, 1, 1);
const box3Material = new THREE.MeshStandardMaterial(); // standard reflect enviroment
const box3 = new THREE.Mesh(box3Geometry, box3Material);
box3.position.x = 0;
box3.position.y = 4;
scene.add(box3);

// directional light
const directionalLight = new THREE.DirectionalLight(0xeeee22, 0.8);
directionalLight.position.set(-30, 20, 0);

scene.add(directionalLight);

// directional light helper
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  5
);
scene.add(directionalLightHelper);

// spot light
const spotLight = new THREE.SpotLight(0xaa33ff);
spotLight.position.set(4, 4, 0);
spotLight.angle = 0.8;
scene.add(spotLight);

const slHelper = new THREE.SpotLightHelper(spotLight);
scene.add(slHelper);

// shadow
renderer.shadowMap.enabled = true;
plane.receiveShadow = true;
directionalLight.castShadow = true;
box2.castShadow = true;
box2.receiveShadow = true;
box3.castShadow = true;
spotLight.castShadow = true;

// helper to position appair shadow
const directionalLightShadowHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(directionalLightShadowHelper);

// FOG
// scene.fog = new THREE.Fog(0xff8811, 0, 100);
scene.fog = new THREE.FogExp2(0xffffff, 0.05);

// bg color and texture images
// renderer.setClearColor(0x1111ff);
import img1 from "../../stars/a.png";
import img3 from "../../stars/b.png";
const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(img3); // one image
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([img3, img1, img1, img3, img1, img1]);

// item with texture
const box4Geometry = new THREE.BoxGeometry(1, 1);
const box4Material = new THREE.MeshStandardMaterial({
  map: textureLoader.load(img3),
});

const box4MultiMaterial = [
  new THREE.MeshBasicMaterial({ map: textureLoader.load(img1) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(img3) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(img1) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(img3) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(img1) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(img3) }),
];
// const box4 = new THREE.Mesh(box4Geometry, box4Material);
const box4 = new THREE.Mesh(box4Geometry, box4MultiMaterial);
box4.position.x = 2;
box4.position.y = 2;

scene.add(box4);

const animate = (time) => {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;

  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;

  slHelper.update();

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);
