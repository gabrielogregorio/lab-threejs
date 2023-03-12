import * as Three from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as Cannon from "../../node_modules/cannon-es/dist/cannon-es.cjs";
import { initialSetup } from "./utils";

const { scene, camera, renderer } = initialSetup();
renderer.shadowMap.enabled = true;

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

const ambientLight = new Three.AmbientLight(0xeeff11, 1);
scene.add(ambientLight);

scene.background = new Three.Color(0xffffff);

const spotLight = new Three.SpotLight(0xeeff11);
spotLight.angle = 0.8;
spotLight.position.set(2, 5, 0);
scene.add(spotLight);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

const slHelper = new Three.SpotLightHelper(spotLight);
scene.add(slHelper);

const groundGeo = new Three.PlaneGeometry(20, 20);
const groundMat = new Three.MeshStandardMaterial({
  color: 0xdddddd,
});
const groundMesh = new Three.Mesh(groundGeo, groundMat);
groundMesh.rotateX(-Math.PI / 2);
groundMesh.position.y = -0.5;
scene.add(groundMesh);
groundMesh.receiveShadow = true;

let mixer;
let stag;
let clips;
const modelUrl = new URL("./Alpaca.gltf", import.meta.url);
const assetLoader = new GLTFLoader();
assetLoader.load(
  modelUrl.href,
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.3, 0.3, 0.3);
    // scene.add(model);
    stag = model;
    // const clips = gltf.animations;
    clips = gltf.animations;

    // model.castShadow = true;
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

// const sphereMesh = new Three.Mesh(
//   new Three.SphereGeometry(0.4, 8, 8),
//   new Three.MeshBasicMaterial({
//     wireframe: false,
//     color: 0x9933ee,
//   })
// );
// sphereMesh.castShadow = true;
const objects = [];
const mixers = [];
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

window.addEventListener("mousedown", () => {
  intersects.forEach((intersect) => {
    console.log(scene.children.length);

    if (objectAlredyExistsInPosition(objects, highlightMesh)) {
      return;
    }
    if (intersect.object.name === groundName) {
      const stagClone = SkeletonUtils.clone(stag);
      // stagClone.material.color = new Three.Color(Math.random() * 0xffffff);
      stagClone.position.copy(highlightMesh.position);
      scene.add(stagClone);
      objects.push(stagClone);
      highlightMesh.material.color.setHex(0xff0000);

      const localMixer = new Three.AnimationMixer(stagClone);
      const clip = Three.AnimationClip.findByName(clips, "Idle_2");
      const action = localMixer.clipAction(clip);
      action.play();
      mixers.push(localMixer);
    }
  });
});

const clock = new Three.Clock();
const animate = (time) => {
  // highlightMesh.material.opacity = 1 + Math.sin(time / 120);

  // objects.forEach((item) => {
  //   item.rotation.x = time / 1000;
  //   item.rotation.y = time / 1000;
  //   item.rotation.z = 0.5 + 0.5 * Math.abs(Math.sign(time / 1000));
  // });

  const delta = clock.getDelta();
  mixers.forEach((mixerLocal) => {
    mixerLocal.update(delta);
  });

  renderer.render(scene, camera);
};
renderer.setAnimationLoop(animate);
