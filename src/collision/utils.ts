import * as Three from "three";
import * as Cannon from "../../node_modules/cannon-es/dist/cannon-es.cjs";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const initialSetup = () => {
  const renderer = new Three.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const scene = new Three.Scene();
  const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  const orbit = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 20, -30);
  orbit.update();

  const grid = new Three.GridHelper(30, 30);
  scene.add(grid);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return {
    scene,
    camera,
    renderer,
  };
};
