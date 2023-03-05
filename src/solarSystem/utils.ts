import * as Three from "three";

export const updateSizeGameBySizeScreen = (renderer: Three.WebGLRenderer) => {
  renderer.setSize(window.innerWidth, window.innerHeight);
};
