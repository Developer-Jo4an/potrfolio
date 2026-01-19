import {BaseDecorator} from "../base/BaseDecorator";

export class DebugRenderer extends BaseDecorator {

  _isActive = false;

  constructor(data) {
    super(data);

    this.update = this.update.bind(this);
  }

  get isActive() {
    return this._isActive;
  }

  set isActive(isActive) {
    if (isActive === this._isActive) {
      console.warn("isActive is equal this._isActive", `isActive: ${isActive}`);
      return;
    } else
      this._isActive = isActive;
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
    const {mesh, storage: {world}} = this;

    const {vertices, colors} = world.debugRender();
    mesh.geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    mesh.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 4));

    this.frame = requestAnimationFrame(this.update);
  }
}