import * as Three from "three";
import * as Cannon from "../../node_modules/cannon-es/dist/cannon-es.cjs";
import { CreateSphereFactory } from "./createSphere";
import { setEnvironment } from "./environment";
import { makeRay } from "./sendRay";
import { initialSetup } from "./utils";

const { scene, camera, renderer } = initialSetup();
setEnvironment(scene);

const meshes: Three.Mesh<Three.SphereGeometry, Three.MeshStandardMaterial>[] = [];
const bodies: Cannon.Body[] = [];

const world = new Cannon.World({
  gravity: new Cannon.Vec3(0, -9.81, 0),
});

const groundGeo = new Three.PlaneGeometry(10, 10);
const groundMat = new Three.MeshStandardMaterial({
  color: 0xffffff,
  side: Three.DoubleSide,
});
const groundMesh = new Three.Mesh(groundGeo, groundMat);
scene.add(groundMesh);
groundMesh.receiveShadow = true;
const groundPhysMat = new Cannon.Material();
const groundBody = new Cannon.Body({
  type: Cannon.Body.STATIC,
  shape: new Cannon.Box(new Cannon.Vec3(5, 5, 0.001)),
  material: groundPhysMat,
});

import * as data from "dat.gui";
const gui = new data.GUI();

const options = {
  mass: 3,
  restitution: 0.2,
  linearDamping: 0.9999,
};

gui.add(options, "mass", 0.01, 10);
gui.add(options, "restitution", 0, 1);
gui.add(options, "linearDamping", 0, 1.0);

window.addEventListener("click", (event) => {
  const intersectionPoint = makeRay(event, camera, scene);
  const { sphereBody, sphereMesh } = CreateSphereFactory.builder(
    scene,
    intersectionPoint,
    world,
    groundPhysMat,
    options.mass,
    options.restitution,
    options.linearDamping
  );
  meshes.push(sphereMesh);
  bodies.push(sphereBody);
});

groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

const timeStep = 1 / 60;
const animate = () => {
  world.step(timeStep);

  groundMesh.position.copy(groundBody.position);
  groundMesh.quaternion.copy(groundBody.quaternion);

  meshes.map((item, index) => {
    item.position.copy(bodies[index].position as unknown as Three.Vector3);
    item.quaternion.copy(bodies[index].quaternion as unknown as Three.Quaternion);
  });

  renderer.render(scene, camera);
};
renderer.setAnimationLoop(animate);
