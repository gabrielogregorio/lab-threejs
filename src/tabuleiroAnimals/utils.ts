import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const initialSetup = () => {
  const renderer = new Three.WebGLRenderer({
    antialias: true,
  });

  renderer.shadowMap.enabled = true;

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const scene = new Three.Scene();
  const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  const orbit = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 20, -30);
  orbit.update();

  const grid = new Three.GridHelper(20, 20);
  scene.add(grid);

  const helper = new Three.AxesHelper(30);
  scene.add(helper);

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
