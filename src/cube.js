import * as THREE from "three";

export const addCube = (x, y, z, color) => {
  let geometry = new THREE.BoxGeometry();
  let material = new THREE.MeshBasicMaterial({ color });
  let cube = new THREE.Mesh(geometry, material);

  cube.position.z = z;
  cube.position.y = y;
  cube.position.x = x;
  return cube;
};
