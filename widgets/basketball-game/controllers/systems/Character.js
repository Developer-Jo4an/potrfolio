import System from "../../../../shared/scene/ecs/core/System";
import EventComponent from "../../../../shared/scene/ecs/base/components/EventComponent";
import Body from "../../../../shared/scene/ecs/rapier/components/Body";
import ThreeComponent from "../../../../shared/scene/ecs/three/components/ThreeComponent";
import GSAPTween from "../../../../shared/scene/ecs/base/components/tween/GSAPTween";
import Matrix4Component from "../../../../shared/scene/ecs/base/components/transform/Matrix4Component";
import State from "../../../../shared/scene/ecs/base/components/state/State";
import Mixer from "../../../../shared/scene/ecs/three/components/Mixer";
import Entity from "../../../../shared/scene/ecs/core/Entity";
import Orbit from "../components/Orbit";
import {clamp, random, upperFirst} from "lodash";
import {createAnimationFrame} from "../../../../shared/lib/browserApi/frames";
import returnCharacterToInitialPositionTween from "../../utils/animations/returnCharacterToInitialPositionTween";
import teleportActorToInitialPositionTween from "../../utils/animations/teleportActorToInitialPositionTween";
import extraLifeTrailTween from "../../utils/animations/extraLifeTrailTween";
import extraLifePulseTween from "../../utils/animations/extrLifePulseTween";
import add from "../../../../shared/scene/ecs/three/side-effects/add";
import gsap from "gsap";
import {CHARACTER} from "../../constants/character";
import {DRAG_END, DRAG_MOVE, DRAG_START} from "../../../../shared/constants/events/eventsNames";
import {CLEAR_HIT, COLLISION_START, LOSE, MISS, THROWN, WIN} from "../../constants/events";
import {GROUND} from "../../constants/ground";
import {TWEENS} from "../../constants/tweens";
import {ANIMATIONS, RING, RING_BODY, RING_GRID, RING_SHIELD, SENSOR} from "../../constants/ring";
import {UUIDS} from "../../constants/systems";
import {BASKETBALL, GAME} from "../../constants/game";
import {WIN as WIN_STATE, LOSE as LOSE_STATE} from "../../constants/stateMachine";
import {EXTRA_LIFE, X2} from "../../constants/boosters";
import {X2VIEW} from "../../constants/x2View";
import {PI2} from "../../../../shared/constants/trigonometry/trigonometry";

export default class Character extends System {

  uuid = UUIDS.character;

  helpers = {
    raycaster: new THREE.Raycaster()
  };

  updateMovement({eCharacter, eRing}) {
    const csEvent = eCharacter.getSome(EventComponent, DRAG_START, DRAG_MOVE, DRAG_END);

    if (!csEvent?.length) return;

    const {data: {cursor: current}} = csEvent[csEvent.length - 1];
    const cursor = new THREE.Vector2(current.normalizedX, current.normalizedY);
    const {storage: {camera}, helpers: {raycaster}} = this;
    const cBody = eCharacter.get(Body);
    const planeForIntersect = new THREE.Plane(new THREE.Vector3(0, 0, 1), cBody.object.translation().z);

    const intersectionPoint = new THREE.Vector3();
    raycaster.setFromCamera(cursor, camera);
    raycaster.ray.intersectPlane(planeForIntersect, intersectionPoint);

    const {storage: {mainSceneSettings: {character: {movement: {clamp: {x, y, z}}}}}} = this;

    const formattedIntersectPoint = {
      x: clamp(intersectionPoint.x, ...x),
      y: clamp(intersectionPoint.y, ...y),
      z: clamp(intersectionPoint.z, ...z)
    };

    cBody.object.setTranslation(formattedIntersectPoint);

    const lastEvent = csEvent[csEvent.length - 1];
    if (lastEvent.type === DRAG_END)
      this.tryThrow({eCharacter, eRing, csEvent});
  }

  tryThrow({eCharacter, eRing, csEvent}) {
    const {storage: {mainSceneSettings: {character: {throw: {speed: {s}}}}}} = this;

    const startEvent = csEvent[0];
    const dragEvent = csEvent[csEvent.length - 2];
    const endEvent = csEvent[csEvent.length - 1];

    const isHasAllEvents = (
      startEvent.type === DRAG_START &&
      dragEvent?.type === DRAG_MOVE &&
      endEvent.type === DRAG_END
    );
    if (!isHasAllEvents) {
      this.returnCharacterToInitialPosition({eCharacter});
      return;
    }

    const isSwipeToDown = dragEvent.data.cursor.fromScreenY < endEvent.data.cursor.fromScreenY;
    if (isSwipeToDown) {
      this.returnCharacterToInitialPosition({eCharacter});
      return;
    }

    const throwData = this.calculateThrowData(eCharacter);

    const isCanThrow = throwData && throwData.speed >= s;
    if (!isCanThrow) {
      this.returnCharacterToInitialPosition({eCharacter});
      return;
    }

    const fullProps = {eCharacter, eRing, ...(throwData ?? {})};
    this.throwBall(fullProps);
  }

  calculateThrowData(eCharacter) {
    const {helpers: {raycaster}, storage: {camera}} = this;
    const [,
      {data: {cursor: drag}},
      {data: {cursor: end}}
    ] = eCharacter.getSome(EventComponent, DRAG_START, DRAG_MOVE, DRAG_END);

    if (drag.normalizedX === end.normalizedX && drag.normalizedY === end.normalizedY) return;

    const [d3Drag, d3End] = [drag, end].map(({normalizedX, normalizedY}) => {
      const intersectionPoint = new THREE.Vector3();
      const planeForIntersect = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      raycaster.setFromCamera(new THREE.Vector2(normalizedX, normalizedY), camera);
      raycaster.ray.intersectPlane(planeForIntersect, intersectionPoint);
      return intersectionPoint;
    });

    const distance = d3Drag.clone().sub(d3End).length();
    const duration = (end.timestamp - drag.timestamp) / 1000;
    const speed = distance / duration;

    return {distance, duration, drag, end, speed};
  }

  async returnCharacterToInitialPosition({eCharacter}) {
    const {
      storage: {
        gameSpace: {set},
        mainSceneSettings: {character: {startData: {position}}}
      }
    } = this;

    set(({characterMovement}) => {
      characterMovement.returnsBack = true;
    });

    const cBody = eCharacter.get(Body);

    const returnTween = returnCharacterToInitialPositionTween(cBody.object, position);
    const cTween = eCharacter.get(GSAPTween);
    cTween.add(returnTween);
    await new Promise(res => {
      returnTween.eventCallback("onComplete", () => {
        returnTween.delete(BASKETBALL);
        cTween.remove(returnTween.id);
        res();
      });
    });

    set(({characterMovement}) => {
      characterMovement.returnsBack = false;
    });
  }

  throwBall({eRing, eCharacter, drag, end, speed, distance, duration}) {
    const {storage: {gameSpace: {set}}} = this;

    const cBody = eCharacter.get(Body);

    cBody.object.setBodyType(RAPIER3D.RigidBodyType.Dynamic);

    set(({serviceData: {clearFunctions}, characterMovement}) => {
      clearFunctions.push(createAnimationFrame(() => {
        const target = eRing.get(Body).object.translation();
        const props = {eCharacter, drag, end, target, speed, distance, duration};
        const x = this.calculateX(props);
        const y = this.calculateY(props);
        const z = this.calculateZ(props);
        const time = this.calculateTime(x, y, z, target);
        const throwPoint = new THREE.Vector3(x, y, z);

        const {storage: {world, mainSceneSettings: {character: {throw: {angvel}}}}} = this;
        const bodyPosition = cBody.object.translation();
        const mass = cBody.object.mass();
        const vectorBetweenBallAndTarget = throwPoint.clone().sub(bodyPosition);
        const zeroV = new THREE.Vector3(
          vectorBetweenBallAndTarget.x / time,
          (vectorBetweenBallAndTarget.y - 0.5 * world.gravity.y * time ** 2) / time,
          vectorBetweenBallAndTarget.z / time
        );
        const impulse = zeroV.clone().multiplyScalar(mass);

        this.applyPhysicalPropertiesForThrow({impulse, angvel});
      }));

      characterMovement.thrown = true;
      const {eventBus} = this;
      eCharacter.add(new EventComponent({eventBus, type: THROWN}));
    });
  }

  calculateX({drag, end, target}) {
    const {storage: {camera}, helpers: {raycaster}} = this;

    const [drag2d, end2d] = [drag, end].map(({normalizedX, normalizedY}) => {
      const intersectionPoint = new THREE.Vector3();
      const planeForIntersect = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      raycaster.setFromCamera(new THREE.Vector2(normalizedX, normalizedY), camera);
      raycaster.ray.intersectPlane(planeForIntersect, intersectionPoint);
      return new THREE.Vector2(intersectionPoint.x, -intersectionPoint.y);
    });

    const swipeVec = new THREE.Vector2(end2d.x - drag2d.x, end2d.y - drag2d.y);
    const directionBetweenVec = new THREE.Vector2(target.x - drag2d.x, target.z - drag2d.y);

    return swipeVec.setLength(directionBetweenVec.length()).x;
  }

  calculateY({speed, target}) {
    return this.calculateVerticalAxis({speed, axisValue: target.y});
  }

  calculateZ({speed, target}) {
    return this.calculateVerticalAxis({speed, axisValue: target.z});
  }

  calculateVerticalAxis({speed, axisValue}) {
    const {storage: {mainSceneSettings: {character: {throw: {speed: {s, m, l, xl}}}}}} = this;

    const balancedSpeed = clamp(speed, s, xl);

    if (balancedSpeed >= m && balancedSpeed <= l)
      return axisValue;
    else {
      const denominator = balancedSpeed < m ? m : l;
      return balancedSpeed / denominator * axisValue;
    }
  }

  calculateTime(x, y, z, target) {
    const {storage: {mainSceneSettings: {character: {throw: {duration}}}}} = this;
    const throwVector = new THREE.Vector3(x, y, z);
    const targetVector = new THREE.Vector3(target.x, target.y, target.z);
    const multiplier = throwVector.length() / targetVector.length();
    return duration * multiplier;
  }

  activateBooster({type, otherProps}) {
    const {storage: {gameSpace: {set}}} = this;
    set(({booster}) => booster.active = type);
    this[createActivateMethod(type)](otherProps);
  }

  [createActivateMethod(X2)]() {
    const {eventBus, storage: {scene, mainSceneSettings: {boosters: {[X2]: {count, velocity, offsetRadius}}}}} = this;
    const eGame = this.getFirstEntityByType(GAME);
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const eRing = this.getFirstEntityByType(RING);

    Array.from({length: count}).map(() => {
      const eX2 = new Entity({eventBus, type: X2VIEW}).init();

      const cThreeComponent = eX2.get(ThreeComponent);
      const x2View = cThreeComponent.threeObject = cThreeComponent.threeObject = this.getAsset(eX2, X2VIEW);
      this.addSideEffect({entity: eX2, effect: add, args: [scene, x2View]});

      const cOrbit = eX2.get(Orbit);
      cOrbit.center = eCharacter.get(Matrix4Component).position.clone();
      cOrbit.radius = eCharacter.get(Body).object.collider.shape.radius + offsetRadius;
      cOrbit.angle = Math.random() * PI2;
      cOrbit.angularVelocity = THREE.MathUtils.degToRad(random(velocity.min, velocity.max, true));
      cOrbit.normal = new THREE.Vector3(
        random(-1, 1, true),
        random(-1, 1, true),
        random(-1, 1, true)
      );
      cOrbit.tangent1 = cOrbit.normal.clone().cross(new THREE.Vector3(
        random(-1, 1, true),
        random(-1, 1, true),
        random(-1, 1, true)
      )).normalize();
      cOrbit.tangent2 = cOrbit.normal.clone().cross(cOrbit.tangent1).normalize();
    });

    this.updateX2View({eGame, eCharacter, eRing, deltaTime: 0});
  }

  async [createActivateMethod(EXTRA_LIFE)](
    {
      effectFreeSpaceRef: {current: effectFreeSpace},
      boostersRef: {current: {extraLife}},
      topMenuElementsRef: {current: {lifesIcon}}
    }
  ) {
    const {storage: {gameSpace: {set}}} = this;
    set(({booster, gameData}) => {
      booster.active = null;
      this.clearBoosterData();

      gameData.lifes++;
    });

    const isHasPrevTween = [
      TWEENS.extraLifeTrailTween,
      TWEENS.extraLifePulseTween
    ].some(tweenId => gsap.localTimeline.isExist(BASKETBALL, tweenId));

    if (isHasPrevTween) return;

    const extraLifeNode = extraLife.querySelector(`[data-image="menuImage"]`);
    const extraLideBounding = extraLifeNode.getBoundingClientRect();
    extraLifeTrailTween(extraLideBounding, effectFreeSpace);

    const lifesIconBounding = lifesIcon.getBoundingClientRect();
    extraLifePulseTween(lifesIconBounding, effectFreeSpace);
  }

  [createActivateMethod(CLEAR_HIT)]() {
    const {
      storage: {
        gameSpace: {set},
        world,
        mainSceneSettings: {character: {throw: {angvel}}, boosters: {[CLEAR_HIT]: clearHit}}
      }
    } = this;

    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const eRing = this.getFirstEntityByType(RING);

    const eMatrix4Character = eCharacter.get(Matrix4Component);
    const eMatrix4Ring = eRing.get(Matrix4Component);

    const xDiff = eMatrix4Ring.position.x - eMatrix4Character.position.x;
    const yDiff = eMatrix4Ring.position.y - eMatrix4Character.position.y / 2;
    const zDiff = eMatrix4Ring.position.z - eMatrix4Character.position.z;

    const xV = xDiff / clearHit.time;
    const yV = (yDiff - ((world.gravity.y * clearHit.time ** 2) / 2)) / clearHit.time;
    const zV = zDiff / clearHit.time;

    const cBodyCharacter = eCharacter.get(Body);
    cBodyCharacter.object.setBodyType(RAPIER3D.RigidBodyType.Dynamic);

    set(
      ({serviceData: {clearFunctions}, characterMovement}) => {
        const impulse = new THREE.Vector3(xV, yV, zV).multiplyScalar(cBodyCharacter.object.mass());
        clearFunctions.push(createAnimationFrame(() => this.applyPhysicalPropertiesForThrow({impulse, angvel})));
        characterMovement.thrown = true;
        const {eventBus} = this;
        eCharacter.add(new EventComponent({eventBus, type: THROWN}));
      }
    );
  }

  clearBoosterData() {
    const esX2 = this.getEntitiesByType(X2VIEW)?.list ?? [];
    if (!!esX2.length) {
      while (esX2.length)
        esX2[0].destroy();
    }
  }

  updateX2View({eCharacter, deltaTime}) {
    const {storage: {gameSpace: {get}}} = this;
    const {booster} = get();
    if (booster.active !== X2) return;

    const center = eCharacter.get(Matrix4Component).position.clone();

    const esX2 = this.getEntitiesByType(X2VIEW).list;

    esX2.forEach(entity => {
      const cOrbit = entity.get(Orbit);
      cOrbit.center = center.clone();
      cOrbit.angle += cOrbit.angularVelocity * deltaTime;

      const {radius, angle, tangent1, tangent2} = cOrbit;

      const position = {
        x: center.x + radius * (Math.cos(angle) * tangent1.x + Math.sin(angle) * tangent2.x),
        y: center.y + radius * (Math.cos(angle) * tangent1.y + Math.sin(angle) * tangent2.y),
        z: center.z + radius * (Math.cos(angle) * tangent1.z + Math.sin(angle) * tangent2.z)
      };

      const cMatrix4Component = entity.get(Matrix4Component);
      cMatrix4Component.position = position;
    });
  }

  applyPhysicalPropertiesForThrow(
    {
      linvel = {x: 0, y: 0, z: 0},
      impulse = {x: 0, y: 0, z: 0},
      angvel = {x: 0, y: 0, z: 0}
    }) {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const cBody = eCharacter.get(Body);

    cBody.object.wakeUp();
    cBody.object.setLinvel(linvel);
    cBody.object.applyImpulse(impulse);
    cBody.object.setAngvel(angvel);
  }

  checkCollision({eGame, eCharacter, eRing}) {
    const {storage: {gameSpace: {set, get}}} = this;

    const gameSpace = get();

    if (!gameSpace.characterMovement.thrown) return;

    const collisions = eCharacter.getSome(EventComponent, COLLISION_START);

    const isHasCollisionWithRing = collisions.some(({data: {collider}}) => [RING_BODY, RING_SHIELD, RING_GRID].includes(collider.userData.id));
    if (isHasCollisionWithRing)
      set(({characterMovement}) => characterMovement.isCollisionWithRing = true);

    const isHasCollisionWithSensor = collisions.some(({data: {collider}}) => collider.userData.id === SENSOR);
    if (isHasCollisionWithSensor) {
      if (!gameSpace.characterMovement.isCollisionWithSensor) {
        if (!gameSpace.characterMovement.isCollisionWithRing) {
          const {eventBus} = this;
          eCharacter.add(new EventComponent({eventBus, type: CLEAR_HIT}));
        }

        set(({gameData}) => {
          gameData.score += 1 + Number(!gameSpace.characterMovement.isCollisionWithRing);
        });

        const cRingMixer = eRing.get(Mixer);
        const action = cRingMixer.mixer.clipAction(cRingMixer.animations[ANIMATIONS.grid]);
        cRingMixer.mixer.update(0);
        cRingMixer.mixer.setTime(0);
        action.setLoop(THREE.LoopOnce);
        action.stop();
        action.play();
      }

      set(({characterMovement}) => characterMovement.isCollisionWithSensor = true);
    }

    const isHasCollisionWithGround = collisions.some(({data: {entity}}) => entity.type === GROUND);
    if (isHasCollisionWithGround && (gameSpace.booster.active !== CLEAR_HIT || gameSpace.characterMovement.isCollisionWithSensor)) {
      const cTween = eCharacter.get(GSAPTween);
      if (!cTween.has(TWEENS.teleportOnInitialPosition)) {
        const {storage: {mainSceneSettings: {character: {startData: {position, rotation}}}}} = this;
        const cThreeComponent = eCharacter.get(ThreeComponent);
        const cBody = eCharacter.get(Body);

        const teleportTween = teleportActorToInitialPositionTween(
          cThreeComponent.threeObject,
          () => {
            cBody.object.setBodyType(RAPIER3D.RigidBodyType.KinematicPositionBased);
            cBody.object.setLinvel({x: 0, y: 0, z: 0});
            cBody.object.setAngvel({x: 0, y: 0, z: 0});
            cBody.object.setTranslation(position);
            cBody.object.setRotation(new THREE.Quaternion().setFromEuler(new THREE.Euler().setFromVector3(rotation)));
          }
        );
        cTween.add(teleportTween);
        teleportTween.eventCallback("onComplete", () => {
          teleportTween.delete(BASKETBALL);
          cTween.remove(teleportTween.id);
          set(({characterMovement, booster}) => {
            booster.active = null;
            this.clearBoosterData();

            characterMovement.thrown = false;

            gameSpace.characterMovement.isFlewSensor = false;

            characterMovement.isCollisionWithRing = false;
            characterMovement.isCollisionWithSensor = false;
          });
        });
      }
    }

    const cCharacterBody = eCharacter.get(Body);
    const cRingBody = eRing.get(Body);
    const characterPosition = cCharacterBody.object.translation();
    const characterLinvel = cCharacterBody.object.linvel();
    const ringSensorPosition = cRingBody.object.collider.sensor.translation();
    if (
      characterLinvel.y < 0 &&
      characterPosition.y <= ringSensorPosition.y - cCharacterBody.object.collider.shape.radius &&
      !gameSpace.characterMovement.isFlewSensor &&
      !gameSpace.characterMovement.isCollisionWithSensor
    ) {
      const {eventBus} = this;
      eCharacter.add(new EventComponent({eventBus, type: MISS}));
      gameSpace.characterMovement.isFlewSensor = true;
      set(({gameData}) => gameData.lifes--);
    }

    const cState = eGame.get(State);

    const isWin = gameSpace.gameData.score >= gameSpace.gameData.target;
    if (isWin && cState.state !== WIN_STATE) {
      const {eventBus} = this;
      eCharacter.add(new EventComponent({eventBus, type: WIN}));
      return;
    }

    const isLose = gameSpace.gameData.lifes <= 0;
    if (isLose && cState.state !== LOSE_STATE) {
      const {eventBus} = this;
      eCharacter.add(new EventComponent({eventBus, type: LOSE}));
      return;
    }
  }

  update() {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const eRing = this.getFirstEntityByType(RING);
    const eGame = this.getFirstEntityByType(GAME);
    const fullProps = {eGame, eCharacter, eRing, ...arguments[0]};
    this.updateMovement(fullProps);
    this.updateX2View(fullProps);
    this.checkCollision(fullProps);
  }
}

function createActivateMethod(type) {
  return `activateBooster${upperFirst(type)}`;
}