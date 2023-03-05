import * as Three from "three";

const textureLoader = new Three.TextureLoader();

type payloadRing = {
  innerRadius: number;
  outerRadius: number;
  texture: string;
};

export class CreateSphereFactory {
  radius: number;
  texture: string;
  position: number;
  ring: payloadRing;

  constructor(radius: number, texture: string, position: number, ring?: payloadRing) {
    this.radius = radius;
    this.texture = texture;
    this.position = position;
    this.ring = ring;
  }

  public build() {
    const sphereGeo = new Three.SphereGeometry(this.radius, 30, 30);
    const sphereMat = new Three.MeshStandardMaterial({
      map: textureLoader.load(this.texture),
    });
    const mesh = new Three.Mesh(sphereGeo, sphereMat);

    const obj = new Three.Object3D();

    if (this.ring) {
      const ringGeo = new Three.RingGeometry(this.ring.innerRadius, this.ring.outerRadius, 32);
      const ringMat = new Three.MeshBasicMaterial({
        map: textureLoader.load(this.ring.texture),
        side: Three.DoubleSide,
      });
      const ringMesh = new Three.Mesh(ringGeo, ringMat);
      obj.add(ringMesh);
      ringMesh.position.x = this.position;
      ringMesh.rotation.x = -0.5 * Math.PI;
    }
    obj.add(mesh);
    mesh.position.x = this.position;
    return { mesh, obj };
  }
}
