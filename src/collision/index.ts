import * as Three from "three";
import * as Cannon from "../../node_modules/cannon-es/dist/cannon-es.cjs";
import { CreateBoxFactory } from "./createBox";
import { CreateGroundFactory } from "./createPlane";
import { CreateSphereFactory } from "./createSphere";
import { initialSetup } from "./utils";

const { scene, camera, renderer } = initialSetup();

const world = new Cannon.World({
  gravity: new Cannon.Vec3(0, -9.81, 0),
});

const ground = CreateGroundFactory.builder(scene, world);
const box = CreateBoxFactory.builder(scene, world);
const sphere = CreateSphereFactory.builder(scene, world);

// to colision materials, friction between
const groundBoxContactMat = new Cannon.ContactMaterial(ground.materialColision, box.materialColision, {
  friction: 0.08, // FRICTION HEHE
  restitution: 0.1, // JUMPING ON TOUCH GROUND
});

world.addContactMaterial(groundBoxContactMat);

const timeStep = 1 / 60;

const animate = () => {
  world.step(timeStep, undefined, undefined);

  ground.updateCopy();
  box.updateCopy();
  sphere.updateCopy();

  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);
