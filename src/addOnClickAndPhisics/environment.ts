import * as Three from "three";

export const setEnvironment = (scene: Three.Scene) => {
  const ambientLight = new Three.AmbientLight(0x333333);
  scene.add(ambientLight);

  const directionalLight = new Three.DirectionalLight(0xffffff, 0.8);
  scene.add(directionalLight);
  directionalLight.position.set(0, 50, 0);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
};
