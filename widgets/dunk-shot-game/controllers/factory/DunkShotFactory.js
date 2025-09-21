import Basket from "../entites/basket/Basket";
import Ball from "../entites/ball/Ball";
import Finish from "../entites/finish/Finish";
import Spike from "../entites/spike/Spike";
import MainContainer from "../entites/mainContainer/MainContainer";
import {Wall} from "../entites/wall/Wall";
import ShadowBall from "../entites/ball/ShadowBall";
import ShadowWall from "../entites/wall/ShadowWall";
import Aim from "../entites/aim/Aim";
import Clover from "../entites/clover/Clover";
import Factory from "../../../../shared/scene/factory/Factory";
import {defaultBehaviour} from "../../lib/behaviour/defaultBehaviour";
import {upperFirst} from "lodash";

class DunkShotFactory extends Factory {
  constructor(defaultProperties) {
    super();

    this.defaultProperties = defaultProperties;

    defaultBehaviour(this);
  }

  getItemByType(type, data) {
    const {defaultProperties: {eventBus}} = this;

    const storage = this.getStorage(type);

    const reusedItem = storage.pop();

    let totalItem;

    if (reusedItem) {
      reusedItem.activate(data);
      totalItem = reusedItem;
    } else
      totalItem = this[`create${upperFirst(type)}`]?.(data);

    eventBus.dispatchEvent({type: "item:created", itemData: {type, item: totalItem}});

    return totalItem;
  }


  /**
   * basket
   */
  createBasket(data) {
    const {defaultProperties} = this;
    return new Basket({...data, ...defaultProperties});
  }

  get baskets() {
    return this.getStorage("basket")?.activeItems ?? [];
  }

  get activeBasket() {
    const {baskets} = this;
    return baskets?.find(({status}) => status === "active");
  }

  get nextBasket() {
    const {baskets} = this;
    return baskets?.find(({status}) => status === "next");
  }

  get inactiveBaskets() {
    const {baskets} = this;
    return baskets?.filter(({status}) => status === "inactive");
  }

  get lastBasket() {
    const {baskets} = this;
    return baskets?.find(({isLast}) => isLast);
  }


  /**
   * ball
   */
  createBall(data) {
    const {defaultProperties} = this;
    return new Ball({...data, ...defaultProperties});
  }

  get ball() {
    return this.getStorage("ball")?.activeItems?.[0];
  }


  /**
   * finish
   */
  createFinish(data) {
    const {defaultProperties} = this;
    return new Finish({...data, ...defaultProperties});
  }

  get finish() {
    return this.getStorage("finish")?.activeItems?.[0];
  }


  /**
   * spike
   */
  createSpike(data) {
    const {defaultProperties} = this;
    return new Spike({...data, ...defaultProperties});
  }

  get spikes() {
    return this.getStorage("spike")?.activeItems ?? [];
  }

  get inactiveSpikes() {
    const {spikes} = this;
    return spikes?.filter(({status}) => status === "inactive");
  }

  get activeSpike() {
    const {spikes} = this;
    return spikes?.find(({status}) => status === "active");
  }


  /**
   * mainContainer
   */
  createMainContainer(data) {
    const {defaultProperties} = this;
    return new MainContainer({...data, ...defaultProperties});
  }

  get mainContainer() {
    return this.getStorage("mainContainer")?.activeItems?.[0];
  }


  /**
   * wall
   */
  createWall(data) {
    const {defaultProperties} = this;
    return new Wall({...data, ...defaultProperties});
  }

  get walls() {
    return this.getStorage("wall")?.activeItems;
  }


  /**
   * shadowBall
   */
  createShadowBall(data) {
    const {defaultProperties} = this;
    return new ShadowBall({...defaultProperties, ...data});
  }

  get shadowBall() {
    return this.getStorage("shadowBall")?.activeItems?.[0];
  }


  /**
   * shadowWall
   */
  createShadowWall(data) {
    const {defaultProperties} = this;
    return new ShadowWall({...defaultProperties, ...data});
  }

  get shadowWalls() {
    return this.getStorage("shadowWall")?.activeItems;
  }


  /**
   * aim
   */
  createAim(data) {
    const {defaultProperties} = this;
    return new Aim({...data, ...defaultProperties});
  }

  get aim() {
    return this.getStorage("aim")?.activeItems?.[0];
  }

  /**
   * clover
   */
  createClover(data) {
    const {defaultProperties} = this;
    return new Clover({...data, ...defaultProperties});
  }

  get clovers() {
    return this.getStorage("clover")?.activeItems;
  }
}

export const dunkShotFactory = new DunkShotFactory();
