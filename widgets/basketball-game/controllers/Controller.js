import ThreeController from "../../../shared/scene/controllers/three/ThreeController";
import getIsDebug from "../../../shared/lib/debug/debug";
import {analysis} from "../../../shared/scene/analytics/Analytics";
import {UPDATE_DECORATOR_FIELD} from "../../../shared/scene/constants/decorators/names";
import eventSubscription from "../../../shared/lib/events/eventListener";
import {UPDATED} from "../../../shared/scene/constants/events/names";
import {RESIZE} from "../../../shared/constants/events/eventsNames";
import global from "../../../shared/constants/global/global";

export default class Controller extends ThreeController {
  constructor() {
    super(...arguments);

    this.onUpdated = this.onUpdated.bind(this);
    this.onResized = this.onResized.bind(this);
  }

  async init() {
    await super.init();
    this.initEvents();
    const {decorators} = this;
    const updateDecorator = decorators[UPDATE_DECORATOR_FIELD];
    updateDecorator.startUpdate();
    this.initCube();
  }

  initCube() {
    const {scene, camera} = this;

    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    const geometry = new global.THREE.BoxGeometry(1, 1, 1);
    const material = new global.THREE.MeshStandardMaterial({color: 0xff0000});
    const mesh = this.mesh = new global.THREE.Mesh(geometry, material);
    scene.add(mesh);

    const light = new global.THREE.AmbientLight(0xffffff);
    scene.add(light);

    const directional = new global.THREE.DirectionalLight(0xffffff, 2.5);
    directional.position.set(5, 5, 5);
    directional.target = mesh;
    scene.add(directional);
  }

  initEvents() {
    const {eventBus} = this;

    eventSubscription({
      target: eventBus,
      callbacksBus: [
        {event: UPDATED, callback: this.onUpdated},
        {event: RESIZE, callback: this.onResized}
      ]
    });
  }

  onUpdated({deltaTime}) {
    super.onUpdated(...arguments);

    const {mesh} = this;
    const {rotation} = mesh;
    mesh.rotation.set(
      rotation.x + deltaTime,
      rotation.y + deltaTime,
      rotation.z + deltaTime
    );
  }

  onResized() {
    super.onResized(...arguments);
  }

  reset() {
    getIsDebug() && analysis.logStatistics();
  }
}