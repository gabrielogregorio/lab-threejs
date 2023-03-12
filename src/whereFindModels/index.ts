import * as Three from "three";
import * as Cannon from "../../node_modules/cannon-es/dist/cannon-es.cjs";
import { initialSetup } from "./utils";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
const { scene, camera, renderer } = initialSetup();

const fileUrl = new URL("./Donkey.gltf", import.meta.url);

const directionalLight = new Three.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);
directionalLight.position.set(10, 11, 7);

const ambientLight = new Three.AmbientLight(0xededed, 0.8);
scene.add(ambientLight);

import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const gui = new dat.GUI();
const assetLoader = new GLTFLoader();

const options = {
  color: 0x717171,
};
assetLoader.load(
  fileUrl.href,
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    console.log(model);
    console.log(model.getObjectByName("Cube_1"));

    gui.addColor(options, "color").onChange((newColor) => {
      // get names and default color in threejs editor
      model.getObjectByName("Cube_1").material.color.setHex(newColor);
    });
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

const animate = () => {
  renderer.render(scene, camera);
};
renderer.setAnimationLoop(animate);
