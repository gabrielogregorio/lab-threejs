import * as Three from "three";
import * as Cannon from "../../node_modules/cannon-es/dist/cannon-es.cjs";

const sizeBox = {
  width: 1,
  height: 1,
  depth: 1,
};

export class CreateBoxFactory {
  public static builder(scene: Three.Scene, world: Cannon.World) {
    const boxGeo = new Three.BoxGeometry(sizeBox.width, sizeBox.height, sizeBox.depth);
    const boxMat = new Three.MeshBasicMaterial({
      color: 0x5500ff,
      wireframe: true,
    });
    const boxMesh = new Three.Mesh(boxGeo, boxMat);
    scene.add(boxMesh);

    const boxBody = this.createPhisics();
    world.addBody(boxBody.boxBody);

    const updateCopy = () => {
      boxMesh.position.copy(boxBody.boxBody.position);
      boxMesh.quaternion.copy(boxBody.boxBody.quaternion);
    };

    return { boxMesh, boxBody: boxBody.boxBody, materialColision: boxBody.boxPhysMat, updateCopy };
  }

  private static createPhisics() {
    // optional - friction between materials
    const boxPhysMat = new Cannon.Material();

    const boxBody = new Cannon.Body({
      mass: 1,
      shape: new Cannon.Box(new Cannon.Vec3(sizeBox.width / 2, sizeBox.height / 2, sizeBox.depth / 2)),
      position: new Cannon.Vec3(1, 20, 0),
      material: boxPhysMat, //optional
    });

    return { boxBody, boxPhysMat };
  }
}
