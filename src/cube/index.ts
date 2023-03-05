import * as THREE from "three";
import { addCube } from "./cube";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
let renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(addCube(1, 0, 1, 0xffce30));
scene.add(addCube(1, 0, 3, 0x746ab0));
scene.add(addCube(3, 0, 1, 0x288bab));
scene.add(addCube(3, 0, 3, 0xe83845));

let geometry = new THREE.BoxGeometry(30, 0.1, 30);
let material = new THREE.MeshBasicMaterial({ color: 0xc4cec2 });
let terrain = new THREE.Mesh(geometry, material);
terrain.position.y = -1;

scene.add(terrain);
camera.position.z = 10;

let pressedKeys = [];

window.onkeydown = (event) => {
  pressedKeys[event.key] = true;
};

window.onkeyup = (event) => {
  pressedKeys[event.key] = false;
};

const controls = new PointerLockControls(camera, document.body);

controls.isLocked = true;

scene.add(controls.getObject());

const animate = () => {
  requestAnimationFrame(animate);

  if (pressedKeys["w"]) camera.position.z -= 0.04;
  if (pressedKeys["s"]) camera.position.z += 0.04;
  if (pressedKeys["d"]) camera.position.x += 0.04;
  if (pressedKeys["a"]) camera.position.x -= 0.04;

  renderer.render(scene, camera);
};

animate();
