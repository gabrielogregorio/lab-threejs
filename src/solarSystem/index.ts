import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onResizeUpdatePerspective } from "./configs";
import { CreateSphereFactory } from "./factories/createSphere";
import {
  starsTexture,
  sunTexture,
  mercuryTexture,
  venusTexture,
  earthTexture,
  marsTexture,
  jupiterTexture,
  saturnTexture,
  saturnRingTexture,
  uranusTexture,
  uranusRingTexture,
  neptuneTexture,
  plutoTexture,
  earthMoonTexture,
} from "./textures";
import { updateSizeGameBySizeScreen } from "./utils";

const renderer = new Three.WebGLRenderer();

updateSizeGameBySizeScreen(renderer);

document.body.appendChild(renderer.domElement);

const scene = new Three.Scene();

const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(-90, 140, 140);

const orbit = new OrbitControls(camera, renderer.domElement);

orbit.update();

const ambientLight = new Three.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new Three.CubeTextureLoader();
scene.background = cubeTextureLoader.load([starsTexture, starsTexture, starsTexture, starsTexture, starsTexture, starsTexture]);

const textureLoader = new Three.TextureLoader();

const sunGeo = new Three.SphereGeometry(16, 30, 30);
const sunMat = new Three.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new Three.Mesh(sunGeo, sunMat);

const mercury = new CreateSphereFactory(3.2, mercuryTexture, 28).build();
const venus = new CreateSphereFactory(5.8, venusTexture, 44).build();
const earth = new CreateSphereFactory(6, earthTexture, 62).build();
const mars = new CreateSphereFactory(4, marsTexture, 78).build();
const jupiter = new CreateSphereFactory(12, jupiterTexture, 100).build();
const saturn = new CreateSphereFactory(10, saturnTexture, 138, { innerRadius: 10, outerRadius: 20, texture: saturnRingTexture }).build();
const uranus = new CreateSphereFactory(7, uranusTexture, 176, { innerRadius: 7, outerRadius: 12, texture: uranusRingTexture }).build();
const neptune = new CreateSphereFactory(7, neptuneTexture, 200).build();
const pluto = new CreateSphereFactory(2.8, plutoTexture, 216).build();

const earthMoon = new CreateSphereFactory(1, earthMoonTexture, 15).build();

scene.add(sun);
scene.add(mercury.obj);
scene.add(venus.obj);
scene.add(earth.obj);
scene.add(mars.obj);
scene.add(jupiter.obj);
scene.add(saturn.obj);
scene.add(uranus.obj);
scene.add(neptune.obj);
scene.add(pluto.obj);

earth.mesh.add(earthMoon.obj);

const pointLight = new Three.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

import * as dat from "dat.gui";
const gui = new dat.GUI();

const options = {
  speed: 1,
  reverse: false,
  stop: false,
};

gui.add(options, "speed", 0.01, 5);
gui.add(options, "reverse");
gui.add(options, "stop");

const animate = () => {
  const globalSpeed = options.reverse ? options.speed * -1 : options.speed;

  if (options.stop === false) {
    sun.rotateY(0.004 * globalSpeed);

    mercury.mesh.rotateY(0.004 * globalSpeed);
    venus.mesh.rotateY(0.02 * globalSpeed);
    earth.mesh.rotateY(0.02 * globalSpeed);
    mars.mesh.rotateY(0.018 * globalSpeed);
    jupiter.mesh.rotateY(0.04 * globalSpeed);
    saturn.mesh.rotateY(0.038 * globalSpeed);
    uranus.mesh.rotateY(0.03 * globalSpeed);
    neptune.mesh.rotateY(0.032 * globalSpeed);
    pluto.mesh.rotateY(0.008 * globalSpeed);
    earthMoon.mesh.rotateY(0.06 * globalSpeed);

    mercury.obj.rotateY(0.04 * globalSpeed);
    venus.obj.rotateY(0.015 * globalSpeed);
    earth.obj.rotateY(0.01 * globalSpeed);
    mars.obj.rotateY(0.008 * globalSpeed);
    jupiter.obj.rotateY(0.002 * globalSpeed);
    saturn.obj.rotateY(0.0009 * globalSpeed);
    uranus.obj.rotateY(0.0004 * globalSpeed);
    neptune.obj.rotateY(0.0001 * globalSpeed);
    pluto.obj.rotateY(0.00007 * globalSpeed);
    earthMoon.obj.rotateY(0.02 * globalSpeed);
  }
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

onResizeUpdatePerspective(camera, renderer);
