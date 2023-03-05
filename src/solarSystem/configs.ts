import * as Three from "three";
import { updateSizeGameBySizeScreen } from "./utils";

export const onResizeUpdatePerspective = (
  camera: Three.PerspectiveCamera,
  renderer: Three.WebGLRenderer
) => {
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    updateSizeGameBySizeScreen(renderer);
  });
};
