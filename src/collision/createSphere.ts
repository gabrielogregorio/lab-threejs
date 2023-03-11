import * as Three from "three";
import * as Cannon from "../../node_modules/cannon-es/dist/cannon-es.cjs";

const RADIUS_SPHERE = 2;

export class CreateSphereFactory {
  public static builder(scene: Three.Scene, world: Cannon.World) {
    const sphereGeo = new Three.SphereGeometry(RADIUS_SPHERE);
    const sphereMat = new Three.MeshBasicMaterial({
      color: 0x5555ff,
      wireframe: true,
    });
    const sphereMesh = new Three.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);

    const sphereBody = this.createPhisics();
    world.addBody(sphereBody);

    const updateCopy = () => {
      sphereMesh.position.copy(sphereBody.position);
      sphereMesh.quaternion.copy(sphereBody.quaternion);
    };

    return { sphereMesh, sphereBody, updateCopy };
  }

  private static createPhisics() {
    const body = new Cannon.Body({
      mass: 10,
      shape: new Cannon.Sphere(RADIUS_SPHERE),
      position: new Cannon.Vec3(0, 15, 0),
    });

    // air resistance
    body.linearDamping = 0.81;

    // angular velocity
    body.angularVelocity.set(0, 10, 0);

    // resistance angular
    body.angularDamping = 0.5;

    return body;
  }
}
