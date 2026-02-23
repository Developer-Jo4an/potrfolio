import {Basket} from "../entites/Basket/Basket";
import {Ball} from "../entites/Ball/Ball";
import {Finish} from "../entites/Finish/Finish";
import {Spike} from "../entites/Spike/Spike";
import {MainContainer} from "../entites/MainContainer/MainContainer";
import {Wall} from "../entites/Wall/Wall";
import {ShadowBall} from "../entites/Ball/ShadowBall";
import {ShadowWall} from "../entites/Wall/ShadowWall";
import {Aim} from "../entites/Aim/Aim";
import {Wing} from "../entites/Wing/Wing";
import {Factory} from "@shared";
import {upperFirst} from "lodash";
import {setNecessaryListeners} from "../utils/setNecessaryListeners";
import {ACTIVE, INACTIVE, NEXT} from "../constants/statuses";

class DunkShotFactory extends Factory {
  constructor(data) {
    super(data);
  }

  setDefaultProperties(properties) {
    super.setDefaultProperties(properties);
    setNecessaryListeners(this);
  }

  getItemByType(type, data) {
    const storage = this.getStorage(type);

    const reusedItem = storage.pop();

    let totalItem;

    if (reusedItem) {
      reusedItem.activate(data);
      totalItem = reusedItem;
    } else totalItem = this[`create${upperFirst(type)}`]?.(data);

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
    return baskets?.find(({status}) => status === ACTIVE);
  }

  get nextBasket() {
    const {baskets} = this;
    return baskets?.find(({status}) => status === NEXT);
  }

  get inactiveBaskets() {
    const {baskets} = this;
    return baskets?.filter(({status}) => status === INACTIVE);
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
    return spikes?.filter(({status}) => status === INACTIVE);
  }

  get activeSpike() {
    const {spikes} = this;
    return spikes?.find(({status}) => status === ACTIVE);
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
   * wing
   */
  createWing(data) {
    const {defaultProperties} = this;
    return new Wing({...data, ...defaultProperties});
  }

  get wings() {
    return this.getStorage("wing")?.activeItems;
  }
}

export const factory = new DunkShotFactory();
