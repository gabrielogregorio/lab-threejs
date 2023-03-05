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
const planeMaterial = new THREE.MeshBasicMaterial({
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
const sphereGeometry = new THREE.SphereGeometry(4, 500, 500);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x2255ee,
  wireframe: true, // as wireframe
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

const animate = (time) => {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;

  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);
