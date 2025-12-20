// TODO: переделать в декоратор
export default class DebugRenderer {
  constructor({storage}) {
    this.storage = storage;

    this.update = this.update.bind(this);
  }

  get active() {
    return this._active ??= false;
  }

  set active(isActive) {
    if (isActive === this._active) {
      console.warn("isActive is equal this._active", `isActive: ${isActive}`);
      return;
    } else
      this._active = isActive;

    const {storage: {scene}, mesh} = this;
    if (isActive) {
      if (!mesh)
        this.mesh = this.initMesh();
      scene.add(this.mesh);
      this.update();
    } else {
      mesh && scene.remove(mesh);
      cancelAnimationFrame(this.frame);
      this.frame = null;
    }
  }

  initMesh() {
    const mesh = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({color: 0xffffff, vertexColors: true})
    );

    mesh.frustumCulled = false;

    return mesh;
  }

  update() {
    const {mesh, storage: {world}, active} = this;

    if (!active) return;

    const {vertices, colors} = world.debugRender();
    mesh.geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    mesh.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 4));

    this.frame = requestAnimationFrame(this.update);
  }
}