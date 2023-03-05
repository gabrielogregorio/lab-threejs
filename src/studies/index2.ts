import * as Three from "three";

let renderer = new Three.WebGLRenderer();

const setSizeScreen = (rendererLocal: Three.WebGLRenderer) => {
  rendererLocal.setSize(window.innerWidth, window.innerHeight);
};

setSizeScreen(renderer);
document.body.appendChild(renderer.domElement);

// camera
// perspective: zoom in and out
// orthographic:  size object is equal, object near or far
const NEAR = 0.1;
const FAR = 1000;
const FOV = 45;
const ASPECT = window.innerWidth / window.innerHeight;
let camera = new Three.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
camera.position.set(5, 2, 10); // camera.position.x = 5, camera.position.y = 2,  camera.position.z = 10;

let scene = new Three.Scene();

// axes helper
const axesHelper = new Three.AxesHelper(5);
scene.add(axesHelper);

const boxGeometry = new Three.BoxGeometry();
const boxMaterial = new Three.MeshBasicMaterial({ color: 0x339966 });
const box = new Three.Mesh(boxGeometry, boxMaterial);

scene.add(box);

// orbit control
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// plane
const planeGeometry = new Three.PlaneGeometry(40, 40);
const planeMaterial = new Three.MeshStandardMaterial({
  color: 0xeeeeee,
  side: Three.DoubleSide, // undefined or show two side
});
const plane = new Three.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
scene.add(plane);

// grid helper
const gridHelper = new Three.GridHelper(60, 70);
scene.add(gridHelper);

// sphere
const sphereGeometry = new Three.SphereGeometry(1, 10, 10);
const sphereMaterial = new Three.MeshBasicMaterial({
  color: 0x2255ee,
  wireframe: false, // as wireframe
});
const sphere = new Three.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 2;
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
const ambientLight = new Three.AmbientLight(0x773311);
scene.add(ambientLight);

// to reflex ambientLigth
const box2Geometry = new Three.BoxGeometry(3, 5, 30);
const box2Material = new Three.MeshStandardMaterial(); // standard reflect enviroment
const box2 = new Three.Mesh(box2Geometry, box2Material);
box2.position.x = -4;
box2.position.y = 4;
scene.add(box2);

// to reflex ambientLigth
const box3Geometry = new Three.BoxGeometry(2, 1, 1);
const box3Material = new Three.MeshStandardMaterial(); // standard reflect enviroment
const box3 = new Three.Mesh(box3Geometry, box3Material);
box3.position.x = 0;
box3.position.y = 4;
scene.add(box3);

// directional light
const directionalLight = new Three.DirectionalLight(0xeeee22, 0.8);
directionalLight.position.set(-30, 20, 0);

scene.add(directionalLight);

// directional light helper
const directionalLightHelper = new Three.DirectionalLightHelper(
  directionalLight,
  5
);
scene.add(directionalLightHelper);

// spot light
const spotLight = new Three.SpotLight(0x22eeff);
spotLight.position.set(4, 4, 0);
spotLight.angle = 0.8;
scene.add(spotLight);

const slHelper = new Three.SpotLightHelper(spotLight);
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
const directionalLightShadowHelper = new Three.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(directionalLightShadowHelper);

// FOG
// scene.fog = new Three.Fog(0xff8811, 0, 100);
scene.fog = new Three.FogExp2(0xffffff, 0.05);

// bg color and texture images
// renderer.setClearColor(0x1111ff);
import img1 from "../../../stars/img1.png";
import img3 from "../../../stars/img3.png";
import { BufferAttribute } from "three";
const textureLoader = new Three.TextureLoader();
// scene.background = textureLoader.load(img3); // one image
const cubeTextureLoader = new Three.CubeTextureLoader();
scene.background = cubeTextureLoader.load([img3, img1, img1, img3, img1, img1]);

// item with texture
const box4Geometry = new Three.BoxGeometry(1, 1);
// const box4Material = new Three.MeshStandardMaterial({
//   map: textureLoader.load(img3),
// });

const box4MultiMaterial = [
  new Three.MeshBasicMaterial({ map: textureLoader.load(img1) }),
  new Three.MeshBasicMaterial({ map: textureLoader.load(img3) }),
  new Three.MeshBasicMaterial({ map: textureLoader.load(img1) }),
  new Three.MeshBasicMaterial({ map: textureLoader.load(img3) }),
  new Three.MeshBasicMaterial({ map: textureLoader.load(img1) }),
  new Three.MeshBasicMaterial({ map: textureLoader.load(img3) }),
];
// const box4 = new Three.Mesh(box4Geometry, box4Material);
const box4 = new Three.Mesh(box4Geometry, box4MultiMaterial);
box4.position.x = 2;
box4.position.y = 2;

scene.add(box4);

// event click in a object
const mousePosition = new Three.Vector2();
window.addEventListener("mousemove", (event) => {
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
box4.name = "testName";

const rayCaster = new Three.Raycaster();
const sphereId = sphere.id;

// update position object
const plane2Geometry = new Three.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new Three.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});
const plane2 = new Three.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);
plane2.position.set(10, 10, 15);
plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();

const lastPoint = plane2.geometry.attributes.position.array.length - 1;

// sphere shader
// const vShader = `
//   void main() {
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
// `;

// const fshader = `
//   void main() {
//     gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
//   }
// `;

const sphere2Geometry = new Three.SphereGeometry(4);
const sphere2Material = new Three.ShaderMaterial({
  vertexShader: document.getElementById("vertexShader").textContent, //vShader,
  fragmentShader: document.getElementById("fragmentShader").textContent, //fshader,
});
const sphere2 = new Three.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

// import blend files -> .glb
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const assetLoader = new GLTFLoader();

const threeUrl = new URL("./assets/three.glb", import.meta.url);
assetLoader.load(
  threeUrl.href,
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(0, 0, 1);
  },
  undefined,
  (error) => {
    console.error("erro ao carregar arvores", error);
  }
);

const animate = (time) => {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;

  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;

  // RAYCASTER CLICK
  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObjects(scene.children);

  intersects.forEach((intersect) => {
    if (intersect.object.id === sphereId) {
      intersect.object.material.color.set(0xff0000);
    }

    if (intersect.object.name === "testName") {
      box4.rotation.x = time / 1000;
      intersect.object.rotation.y = time / 1000;
    }
  });

  // RAYCASTER CLICK

  // atributes
  plane2.geometry.attributes.position.array[lastPoint] = 10 * Math.random();
  plane2.geometry.attributes.position.needsUpdate = true;

  // atributes

  slHelper.update();

  step += options.speed;
  sphere.position.y = 3 * Math.abs(Math.sin(step));
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  setSizeScreen(renderer);
});
