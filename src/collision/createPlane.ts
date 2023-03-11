import * as Three from "three";
import * as Cannon from "../../node_modules/cannon-es/dist/cannon-es.cjs";

export class CreateGroundFactory {
  public static builder(scene: Three.Scene, world: Cannon.World) {
    const groundGeo = new Three.PlaneGeometry(30, 30);
    const groundMat = new Three.MeshBasicMaterial({
      color: 0xffffff,
      side: Three.DoubleSide,
      wireframe: true,
    });
    const groundMesh = new Three.Mesh(groundGeo, groundMat);

    const phisics = this.createPhisics();

    scene.add(groundMesh);
    world.addBody(phisics.groundBody);

    const updateCopy = () => {
      groundMesh.position.copy(phisics.groundBody.position);
      groundMesh.quaternion.copy(phisics.groundBody.quaternion);
    };

    return { ground: groundMesh, phisics: phisics.groundBody, materialColision: phisics.materialColision, updateCopy };
  }

  private static createPhisics() {
    // material colition is optional
    const groundPhysMat = new Cannon.Material();

    const groundBody = new Cannon.Body({
      shape: new Cannon.Plane(new Cannon.Vec3(15, 1, 1)),
      // mass: 0,
      type: Cannon.Body.STATIC,
      material: groundPhysMat, // optional
    });

    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

    return { groundBody, materialColision: groundPhysMat };
  }
}
