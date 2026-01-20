export function getVerticesWithDeep(object) {
  const vertices = [];
  const indexes = [];
  let indexOffset = 0;

  object.traverse((child) => {
    if (child.isMesh && child.geometry) {
      const geometry = child.geometry;

      const worldMatrix = child.matrixWorld;
      const positionAttr = geometry.attributes.position;

      for (let i = 0; i < positionAttr.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positionAttr, i);
        vertex.applyMatrix4(worldMatrix);
        vertices.push(vertex.x, vertex.y, vertex.z);
      }

      if (geometry.index) {
        const meshIndexes = geometry.index.array;
        for (let i = 0; i < meshIndexes.length; i++) indexes.push(meshIndexes[i] + indexOffset);
      } else for (let i = 0; i < positionAttr.count; i++) indexes.push(i + indexOffset);
      indexOffset += positionAttr.count;
    }
  });

  return {vertices, indexes};
}
