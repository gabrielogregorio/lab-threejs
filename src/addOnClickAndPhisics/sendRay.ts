import * as Three from "three";
import * as Cannon from "../../node_modules/cannon-es/dist/cannon-es.cjs";
import { CreateSphereFactory } from "./createSphere";

const mouse = new Three.Vector2();
const intersectionPoint = new Three.Vector3();
const planeNormal = new Three.Vector3();
const plane = new Three.Plane();
const rayCaster = new Three.Raycaster();

export const makeRay = (event, camera: Three.Camera, scene: Three.Scene) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);

  rayCaster.setFromCamera(mouse, camera);

  rayCaster.ray.intersectPlane(plane, intersectionPoint);

  return intersectionPoint;
};
