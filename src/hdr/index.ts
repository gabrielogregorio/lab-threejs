import * as Three from "three";
import * as Cannon from "../../node_modules/cannon-es/dist/cannon-es.cjs";
import { initialSetup } from "./utils";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
const { scene, camera, renderer } = initialSetup();

renderer.outputEncoding = Three.sRGBEncoding;
renderer.toneMapping = Three.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;

const hdrTextureUrl = new URL("./MR_INT-003_Kitchen_Pierre.hdr", import.meta.url);
const loader = new RGBELoader();
loader.load(hdrTextureUrl, (texture) => {
  texture.mapping = Three.EquirectangularReflectionMapping;
  scene.background = texture; // comment to ignore background and mantains environment
  // scene.environment = texture;

  const sphere = new Three.Mesh(new Three.SphereGeometry(1, 50, 50), new Three.MeshStandardMaterial());
  scene.add(sphere);

  const sphere2 = new Three.Mesh(
    new Three.SphereGeometry(1, 50, 50),
    new Three.MeshStandardMaterial({
      roughness: 0,
    })
  );
  scene.add(sphere2);
  sphere2.position.y = 3;

  const sphere3 = new Three.Mesh(
    new Three.SphereGeometry(1, 50, 50),
    new Three.MeshStandardMaterial({
      roughness: 0,
      metalness: 0.5,
    })
  );
  scene.add(sphere3);
  sphere3.position.y = 6;

  const sphere4 = new Three.Mesh(
    new Three.SphereGeometry(1, 50, 50),
    new Three.MeshStandardMaterial({
      roughness: 0,
      metalness: 1,
      color: 0x5555ee,
      envMap: texture,
    })
  );
  scene.add(sphere4);
  sphere4.position.y = 9;
});

const animate = (time) => {
  renderer.render(scene, camera);
};
renderer.setAnimationLoop(animate);
