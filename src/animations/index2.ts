import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const monkeyUrl = new URL("./exampleanimation_1_watch_9_50.glb", import.meta.url);
const renderer = new Three.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Three.Scene();

const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer.setClearColor(0xa3a3a3);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 10, 10);
orbit.update();
const grid = new Three.GridHelper(30, 30);
scene.add(grid);

const assetLoader = new GLTFLoader();

let mixer: Three.AnimationMixer;
assetLoader.load(
  monkeyUrl.href,
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    mixer = new Three.AnimationMixer(model);
    const clips = gltf.animations;

    const animationName = "watchOficial";
    const clip = Three.AnimationClip.findByName(clips, animationName);
    const action = mixer.clipAction(clip);
    action.play();

    // // Play all animations at the same time
    // clips.forEach((clip) => {
    //   const action = mixer.clipAction(clip);
    //   action.play();
    // });
  },
  undefined,
  (error) => console.error(error)
);

const clock = new Three.Clock();
const animate = () => {
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
