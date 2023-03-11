import * as Three from "three";
import * as Cannon from "../../node_modules/cannon-es/dist/cannon-es.cjs";

const SPHERE_RADIUS = 0.5;

export class CreateSphereFactory {
  constructor() {}

  public static builder(
    scene: Three.Scene,
    intersectionPoint: Three.Vector3,
    word: Cannon.World,
    groundPhysMat: Cannon.Material,
    mass,
    restitution,
    linearDamping
  ) {
    const sphereGeo = new Three.SphereGeometry(SPHERE_RADIUS, 30, 30);
    const sphereMat = new Three.MeshStandardMaterial({
      color: Math.random() * 0xffffff,
      metalness: 0.1,
      roughness: 0,
    });
    const sphereMesh = new Three.Mesh(sphereGeo, sphereMat);
    // sphereMesh.position.copy(intersectionPoint); -> meshs copy from body
    scene.add(sphereMesh);
    sphereMesh.castShadow = true;

    const spherePhysMat = new Cannon.Material();
    const sphereBody = new Cannon.Body({
      mass,
      shape: new Cannon.Sphere(SPHERE_RADIUS),
      position: new Cannon.Vec3(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z),
      material: spherePhysMat,
    });

    sphereBody.linearDamping = linearDamping;
    word.addBody(sphereBody);

    const planeSphereContactMat = new Cannon.ContactMaterial(groundPhysMat, spherePhysMat, {
      restitution,
    });
    word.addContactMaterial(planeSphereContactMat);

    return {
      sphereBody,
      sphereMesh,
      spherePhysMat,
    };
  }
}
