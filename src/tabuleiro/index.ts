import * as Three from "three";
import * as Cannon from "../../node_modules/cannon-es/dist/cannon-es.cjs";
import { initialSetup } from "./utils";

const { scene, camera, renderer } = initialSetup();

const planeMesh = new Three.Mesh(
  new Three.PlaneGeometry(20, 20),
  new Three.MeshBasicMaterial({
    color: 0xdddddd,
    side: Three.DoubleSide,
    wireframe: false,
    visible: false,
  })
);
const groundName = "ground";

planeMesh.rotateX(-Math.PI / 2);
planeMesh.name = groundName;
scene.add(planeMesh);

const highlightMesh = new Three.Mesh(
  new Three.PlaneGeometry(1, 1),
  new Three.MeshBasicMaterial({
    side: Three.DoubleSide,
    transparent: true,
  })
);
highlightMesh.rotateX(-Math.PI / 2);
highlightMesh.position.set(0.5, 0, 0.5);
scene.add(highlightMesh);

const mousePosition = new Three.Vector2();
const raycaster = new Three.Raycaster();
let intersects;

const objectAlredyExistsInPosition = (objectsLocal, highlightMeshLocal) => {
  return objectsLocal.find(
    (item) => item.position.x === highlightMeshLocal.position.x && item.position.z === highlightMeshLocal.position.z
  );
};

window.addEventListener("mousemove", (event) => {
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mousePosition, camera);
  intersects = raycaster.intersectObjects(scene.children);

  intersects.forEach((intersect) => {
    if (intersect.object.name === groundName) {
      const highlightPos = new Three.Vector3().copy(intersect.point).floor().addScalar(0.5);
      highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
    }

    if (objectAlredyExistsInPosition(objects, highlightMesh)) {
      highlightMesh.material.color.setHex(0xff0000);
    } else {
      highlightMesh.material.color.setHex(0x00ff00);
    }
  });
});

const sphereMesh = new Three.Mesh(
  new Three.SphereGeometry(0.4, 4, 2),
  new Three.MeshBasicMaterial({
    wireframe: true,
    color: 0xff3311,
  })
);

const objects = [];

window.addEventListener("mousedown", () => {
  intersects.forEach((intersect) => {
    console.log(scene.children.length);

    if (objectAlredyExistsInPosition(objects, highlightMesh)) {
      return;
    }
    if (intersect.object.name === groundName) {
      const sphereClone = sphereMesh.clone();
      sphereClone.position.copy(highlightMesh.position);
      scene.add(sphereClone);
      objects.push(sphereClone);
      highlightMesh.material.color.setHex(0xff0000);
    }

    console.log;
  });
});

const animate = (time) => {
  // highlightMesh.material.opacity = 1 + Math.sin(time / 120);

  objects.forEach((item) => {
    item.rotation.x = time / 1000;
    item.rotation.y = time / 1000;
    item.rotation.z = 0.5 + 0.5 * Math.abs(Math.sign(time / 1000));
  });

  renderer.render(scene, camera);
};
renderer.setAnimationLoop(animate);
