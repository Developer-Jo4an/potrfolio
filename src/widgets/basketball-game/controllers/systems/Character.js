import {Orbit} from "../components/Orbit";
import {
  Entity,
  System,
  Mixer,
  Matrix4Component,
  GSAPTween,
  ThreeComponent,
  Body,
  EventComponent,
  State,
  add,
  resetMatrix,
  getIsDebug,
  createAnimationFrame,
  DRAG_END,
  DRAG_MOVE,
  DRAG_START,
  PI2,
} from "@shared";
import {clamp, random, upperFirst} from "lodash";
import {returnCharacterToInitialPositionTween} from "../../utils/animations/returnCharacterToInitialPositionTween";
import {teleportActorToInitialPositionTween} from "../../utils/animations/teleportActorToInitialPositionTween";
import {extraLifeTrailTween} from "../../utils/animations/extraLifeTrailTween";
import {extraLifePulseTween} from "../../utils/animations/extrLifePulseTween";
import {x2ViewTween} from "../../utils/animations/x2ViewTween";
import {CHARACTER} from "../../constants/character";
import {CLEAR_HIT, COLLISION_START, GET_INFO, LOSE, MISS, THROWN, WIN} from "../../constants/events";
import {GROUND} from "../../constants/ground";
import {TWEENS} from "../../constants/tweens";
import {ANIMATIONS, RING, RING_BODY, RING_GRID, RING_SHIELD, SENSOR} from "../../constants/ring";
import {UUIDS} from "../../constants/systems";
import {BASKETBALL, GAME} from "../../constants/game";
import {LOSE as LOSE_STATE, WIN as WIN_STATE} from "../../constants/stateMachine";
import {EXTRA_LIFE, X2} from "../../constants/boosters";
import {X2VIEW} from "../../constants/x2View";

export class Character extends System {
  uuid = UUIDS.character;

  helpers = {raycaster: new THREE.Raycaster()};

  updateMovement({eCharacter, eRing}) {
    const csEvent = eCharacter.getSome(EventComponent, DRAG_START, DRAG_MOVE, DRAG_END);

    if (!csEvent?.length) return;

    const {
      data: {cursor: current},
    } = csEvent[csEvent.length - 1];
    const cursor = new THREE.Vector2(current.normalizedX, current.normalizedY);
    const {
      storage: {camera},
      helpers: {raycaster},
    } = this;
    const cBody = eCharacter.get(Body);
    const planeForIntersect = new THREE.Plane(new THREE.Vector3(0, 0, -1), cBody.object.translation().z);

    const intersectionPoint = new THREE.Vector3();
    raycaster.setFromCamera(cursor, camera);
    raycaster.ray.intersectPlane(planeForIntersect, intersectionPoint);

    const {
      storage: {
        mainSceneSettings: {
          character: {
            movement: {
              clamp: {x, y, z},
            },
          },
        },
      },
    } = this;

    const formattedIntersectPoint = {
      x: clamp(intersectionPoint.x, ...x),
      y: clamp(intersectionPoint.y, ...y),
      z: clamp(intersectionPoint.z, ...z),
    };

    cBody.object.setTranslation(formattedIntersectPoint);

    const lastEvent = csEvent[csEvent.length - 1];
    if (lastEvent.type === DRAG_END) this.tryThrow({eCharacter, eRing, csEvent});
  }

  tryThrow({eCharacter, eRing, csEvent}) {
    const {
      storage: {
        mainSceneSettings: {
          character: {
            throw: {dragEventCountForThrow, minSpeed},
          },
        },
      },
    } = this;

    const startEvent = csEvent[0];
    const dragEvents = csEvent.slice(1, csEvent.length - 1);
    const endEvent = csEvent[csEvent.length - 1];

    const isHasAllEvents =
      startEvent.type === DRAG_START &&
      dragEvents?.length === dragEventCountForThrow &&
      dragEvents.every(({type}) => type === DRAG_MOVE) &&
      endEvent.type === DRAG_END;
    if (!isHasAllEvents) {
      this.returnCharacterToInitialPosition({eCharacter});
      return;
    }

    const isSwipeToDown = dragEvents[0].data.cursor.fromScreenY < endEvent.data.cursor.fromScreenY;
    if (isSwipeToDown) {
      this.returnCharacterToInitialPosition({eCharacter});
      return;
    }

    const throwData = this.calculateThrowData(eCharacter);

    const isCanThrow = throwData && throwData.speed >= minSpeed;
    if (!isCanThrow) {
      this.returnCharacterToInitialPosition({eCharacter});
      return;
    }

    const fullProps = {eCharacter, eRing, ...(throwData ?? {})};
    this.throwBall(fullProps);
  }

  calculateThrowData(eCharacter) {
    const {
      helpers: {raycaster},
      storage: {camera},
    } = this;

    const cBody = eCharacter.get(Body);
    const {z} = cBody.object.translation();

    const dragEvents = eCharacter.getSome(EventComponent, DRAG_START, DRAG_MOVE, DRAG_END);

    const {
      data: {cursor: drag},
    } = dragEvents[1];
    const {
      data: {cursor: end},
    } = dragEvents[dragEvents.length - 1];

    if (drag.normalizedX === end.normalizedX && drag.normalizedY === end.normalizedY) return;

    const [drag3d, end3d] = [drag, end].map((cursor) => {
      const intersectionPoint = new THREE.Vector3();
      const planeForIntersect = new THREE.Plane(new THREE.Vector3(0, 0, 1), z);
      raycaster.setFromCamera(new THREE.Vector2(cursor.normalizedX, cursor.normalizedY), camera);
      raycaster.ray.intersectPlane(planeForIntersect, intersectionPoint);
      return (cursor.position3d = new THREE.Vector3(intersectionPoint.x, intersectionPoint.y, z));
    });

    const distance = drag3d.clone().sub(end3d).length();
    const duration = (end.timestamp - drag.timestamp) / 1000;
    const speed = distance / duration;

    return {distance, duration, drag, end, speed};
  }

  async returnCharacterToInitialPosition({eCharacter}) {
    const {
      storage: {
        gameSpace: {set},
        mainSceneSettings: {
          character: {
            startData: {position},
          },
        },
      },
    } = this;

    set(({characterMovement}) => {
      characterMovement.returnsBack = true;
    });

    const cBody = eCharacter.get(Body);

    const returnTween = returnCharacterToInitialPositionTween(cBody.object, position);
    const cTween = eCharacter.get(GSAPTween);
    cTween.add(returnTween);
    await new Promise((res) => {
      returnTween.eventCallback("onComplete", () => {
        returnTween.delete(BASKETBALL);
        cTween.remove(returnTween.vars.id);
        res();
      });
    });

    set(({characterMovement}) => {
      characterMovement.returnsBack = false;
    });
  }

  throwBall({eRing, eCharacter, drag, end, speed, distance, duration}) {
    const {
      storage: {
        gameSpace: {set},
      },
    } = this;

    const cBody = eCharacter.get(Body);

    cBody.object.setBodyType(RAPIER3D.RigidBodyType.Dynamic);

    set(({serviceData: {clearFunctions}, characterMovement}) => {
      clearFunctions.push(
        createAnimationFrame(() => {
          const target = eRing.get(Body).object.translation();
          const props = {eCharacter, drag, end, target, speed, distance, duration};
          const {x, y, z, time} = this.calculateBallTarget(props);
          const throwPoint = new THREE.Vector3(x, y, z);

          const {
            storage: {
              world,
              mainSceneSettings: {
                character: {
                  throw: {angvel},
                },
              },
            },
          } = this;
          const bodyPosition = cBody.object.translation();
          const mass = cBody.object.mass();
          const vectorBetweenBallAndTarget = throwPoint.clone().sub(bodyPosition);
          const zeroV = new THREE.Vector3(
            vectorBetweenBallAndTarget.x / time,
            (vectorBetweenBallAndTarget.y - 0.5 * world.gravity.y * time ** 2) / time,
            vectorBetweenBallAndTarget.z / time,
          );
          const impulse = zeroV.clone().multiplyScalar(mass);

          this.applyPhysicalPropertiesForThrow({impulse, angvel});
        }),
      );

      characterMovement.thrown = true;
      const {eventBus} = this;
      eCharacter.add(new EventComponent({eventBus, type: THROWN}));
    });
  }

  calculateBallTarget({eCharacter, drag, end, target}) {
    const {
      storage: {
        scene,
        mainSceneSettings: {
          character: {
            throw: {
              duration,
              vectorHelp,
              speedHelp,
              speedInterpolation,
              multiplier: [min, max],
            },
          },
        },
      },
    } = this;

    const [{position3d: drag3d}, {position3d: end3d}] = [drag, end];

    const vecBetween = new THREE.Vector3().copy(target).sub(drag3d);

    const flyVector = new THREE.Vector3(end3d.x - drag3d.x, 0, -(end3d.y - drag3d.y));
    flyVector.multiplyScalar(target.z / flyVector.z);
    flyVector.y = target.y - drag3d.y;
    flyVector.x /= vectorHelp;
    const idealSpeed = vecBetween.length() / duration;
    const distance = end3d.distanceTo(drag3d);
    const timeBetween = (end.timestamp - drag.timestamp) / 1000;
    const currentSpeed = distance / timeBetween;
    let multiplier;
    if (Math.abs(idealSpeed - currentSpeed) <= speedHelp) multiplier = 1;
    else {
      const diff = idealSpeed - currentSpeed;
      const help = diff / speedInterpolation;
      multiplier = (currentSpeed + help) / idealSpeed;
    }
    multiplier = clamp(multiplier, min, max);
    flyVector.multiplyScalar(multiplier);

    if (getIsDebug()) {
      [vecBetween, flyVector].forEach((vec, i) => {
        const helper = new THREE.ArrowHelper(
          vec.clone().normalize(),
          drag3d,
          vecBetween.length(),
          new THREE.Color(Math.random(), Math.random(), Math.random()),
        );
        this.addSideEffect({entity: eCharacter, effect: add, args: [scene, helper], name: `arrowHelper${i}`});
      });
    }

    const {x: totalX, y: totalY, z: totalZ} = flyVector.clone().add(drag3d);
    const time = duration * multiplier;

    return {x: totalX, y: totalY, z: totalZ, time};
  }

  activateBooster(type) {
    const {
      storage: {
        gameSpace: {set},
      },
    } = this;
    set(({booster}) => (booster.active = type));
    this[createActivateMethod(type)]();
  }

  [createActivateMethod(X2)]() {
    const {
      eventBus,
      storage: {
        scene,
        mainSceneSettings: {
          boosters: {
            [X2]: {count, velocity, offsetRadius},
          },
        },
      },
    } = this;
    const eGame = this.getFirstEntityByType(GAME);
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const eRing = this.getFirstEntityByType(RING);

    Array.from({length: count}).map(() => {
      const eX2 = new Entity({eventBus, type: X2VIEW}).init();

      const cThreeComponent = eX2.get(ThreeComponent);
      const x2View = (cThreeComponent.threeObject = cThreeComponent.threeObject = this.getAsset(eX2, X2VIEW));
      this.addSideEffect({entity: eX2, effect: add, args: [scene, x2View]});
      this.addSideEffect({entity: eX2, effect: resetMatrix, args: [x2View]});

      const cOrbit = eX2.get(Orbit);
      cOrbit.center = eCharacter.get(Matrix4Component).position.clone();
      cOrbit.radius = eCharacter.get(Body).object.collider.shape.radius + offsetRadius;
      cOrbit.angle = Math.random() * PI2;
      cOrbit.angularVelocity = THREE.MathUtils.degToRad(random(velocity.min, velocity.max, true));
      cOrbit.normal = new THREE.Vector3(random(-1, 1, true), random(-1, 1, true), random(-1, 1, true));
      cOrbit.tangent1 = cOrbit.normal
        .clone()
        .cross(new THREE.Vector3(random(-1, 1, true), random(-1, 1, true), random(-1, 1, true)))
        .normalize();
      cOrbit.tangent2 = cOrbit.normal.clone().cross(cOrbit.tangent1).normalize();
    });

    this.updateX2View({eGame, eCharacter, eRing, deltaTime: 0});
  }

  async [createActivateMethod(EXTRA_LIFE)]() {
    const {
      storage: {
        eventBus,
        gameSpace: {set},
      },
    } = this;

    const result = {};
    eventBus.dispatchEvent({type: GET_INFO, result});
    const {
      effectFreeSpaceRef: {current: effectFreeSpace},
      boostersRef: {
        current: {extraLife},
      },
      topMenuElementsRef: {
        current: {lifesIcon},
      },
    } = result;

    set(({booster, gameData}) => {
      booster.active = null;
      this.clearBoosterData();

      gameData.lifes++;
    });

    const isHasPrevTween = [TWEENS.extraLifeTrailTween, TWEENS.extraLifePulseTween].some((tweenId) =>
      gsap.localTimeline.isExist(BASKETBALL, tweenId),
    );

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
        mainSceneSettings: {
          character: {
            throw: {angvel},
          },
          boosters: {[CLEAR_HIT]: clearHit},
        },
      },
    } = this;

    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const eRing = this.getFirstEntityByType(RING);

    const eMatrix4Character = eCharacter.get(Matrix4Component);
    const eMatrix4Ring = eRing.get(Matrix4Component);

    const xDiff = eMatrix4Ring.position.x - eMatrix4Character.position.x;
    const yDiff = eMatrix4Ring.position.y - eMatrix4Character.position.y / 2;
    const zDiff = eMatrix4Ring.position.z - eMatrix4Character.position.z;

    const xV = xDiff / clearHit.time;
    const yV = (yDiff - (world.gravity.y * clearHit.time ** 2) / 2) / clearHit.time;
    const zV = zDiff / clearHit.time;

    const cBodyCharacter = eCharacter.get(Body);
    cBodyCharacter.object.setBodyType(RAPIER3D.RigidBodyType.Dynamic);

    set(({serviceData: {clearFunctions}, characterMovement}) => {
      const impulse = new THREE.Vector3(xV, yV, zV).multiplyScalar(cBodyCharacter.object.mass());
      clearFunctions.push(createAnimationFrame(() => this.applyPhysicalPropertiesForThrow({impulse, angvel})));
      characterMovement.thrown = true;
      const {eventBus} = this;
      eCharacter.add(new EventComponent({eventBus, type: THROWN}));
    });
  }

  animateX2View() {
    const {
      storage: {
        mainSceneSettings: {
          boosters: {
            [X2]: {angularVelocity},
          },
        },
        eventBus,
        camera,
      },
      helpers: {raycaster},
    } = this;

    const esX2 = this.getEntitiesByType(X2VIEW)?.list ?? [];

    const result = {};
    eventBus.dispatchEvent({type: GET_INFO, result});
    const {
      effectFreeSpaceRef: {current: freeSpace},
      topMenuElementsRef: {
        current: {scoreIcon},
      },
    } = result;
    const bounding = scoreIcon.getBoundingClientRect();
    const point = new THREE.Vector2(
      ((bounding.x + bounding.width / 2) / global.innerWidth) * 2 - 1,
      -((bounding.y + bounding.height / 2) / global.innerHeight) * 2 + 1,
    );

    esX2.forEach((entity) => {
      const cMatrix4Component = entity.get(Matrix4Component);
      const cGSAPTween = entity.get(GSAPTween);

      const plane = new THREE.Plane(new THREE.Vector3(0, 0, -1), cMatrix4Component.z);
      raycaster.setFromCamera(point, camera);
      const target = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, target);

      const tween = x2ViewTween(cMatrix4Component, target, bounding, freeSpace, angularVelocity, () => {
        entity.destroy();
      });

      cGSAPTween.add(tween);
    });
  }

  clearBoosterData() {
    const esX2 = this.getEntitiesByType(X2VIEW)?.list ?? [];
    if (!!esX2.length && !esX2.some((entity) => entity.get(GSAPTween).has(TWEENS.x2ViewTween))) {
      while (esX2.length) esX2[0].destroy();
    }
  }

  updateX2View({eCharacter, deltaTime}) {
    const {
      storage: {
        mainSceneSettings: {
          boosters: {
            [X2]: {angularVelocity},
          },
        },
        gameSpace: {get},
      },
    } = this;
    const {booster} = get();
    if (booster.active !== X2) return;

    const center = eCharacter.get(Matrix4Component).position.clone();

    const esX2 = this.getEntitiesByType(X2VIEW).list;

    if (esX2.some((entity) => entity.get(GSAPTween).has(TWEENS.x2ViewTween))) return;

    esX2.forEach((entity) => {
      const cMatrix4Component = entity.get(Matrix4Component);

      const cOrbit = entity.get(Orbit);
      cOrbit.center = center.clone();
      cOrbit.angle += cOrbit.angularVelocity * deltaTime;

      const {radius, angle, tangent1, tangent2} = cOrbit;

      cMatrix4Component.position = {
        x: center.x + radius * (Math.cos(angle) * tangent1.x + Math.sin(angle) * tangent2.x),
        y: center.y + radius * (Math.cos(angle) * tangent1.y + Math.sin(angle) * tangent2.y),
        z: center.z + radius * (Math.cos(angle) * tangent1.z + Math.sin(angle) * tangent2.z),
      };

      const addedAngle = THREE.MathUtils.degToRad(angularVelocity) * deltaTime;
      cMatrix4Component.rotation = {
        x: cMatrix4Component.rotation.x + addedAngle,
        y: cMatrix4Component.rotation.y + addedAngle,
        z: cMatrix4Component.rotation.z + addedAngle,
      };
    });
  }

  applyPhysicalPropertiesForThrow({
    linvel = {x: 0, y: 0, z: 0},
    impulse = {x: 0, y: 0, z: 0},
    angvel = {x: 0, y: 0, z: 0},
  }) {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const cBody = eCharacter.get(Body);

    cBody.object.wakeUp();
    cBody.object.setLinvel(linvel);
    cBody.object.applyImpulse(impulse);
    cBody.object.setAngvel(angvel);
  }

  checkCollisionWithRing({eCharacter}) {
    const {
      storage: {
        gameSpace: {set},
      },
    } = this;

    const collisions = eCharacter.getSome(EventComponent, COLLISION_START);
    const isHasCollisionWithRing = collisions.some(({data: {collider}}) =>
      [RING_BODY, RING_SHIELD, RING_GRID].includes(collider.userData.id),
    );
    if (isHasCollisionWithRing) set(({characterMovement}) => (characterMovement.isCollisionWithRing = true));
  }

  checkCollisionWithSensor({eCharacter, eRing}) {
    const {
      storage: {
        gameSpace: {get, set},
      },
    } = this;
    const gameSpace = get();

    const collisions = eCharacter.getSome(EventComponent, COLLISION_START);

    const isHasCollisionWithSensor = collisions.some(({data: {collider}}) => collider.userData.id === SENSOR);
    if (!isHasCollisionWithSensor || gameSpace.characterMovement.isCollisionWithSensor) return;

    const isCollisionWithRing = gameSpace.characterMovement.isCollisionWithRing;
    if (!isCollisionWithRing) {
      const {eventBus} = this;
      eCharacter.add(new EventComponent({eventBus, type: CLEAR_HIT}));
    }

    const isActiveBoosterX2 = gameSpace.booster.active === X2;
    set(({gameData}) => {
      gameData.score += (1 + Number(!isCollisionWithRing)) * (isActiveBoosterX2 ? 2 : 1);
      gameData.story.push(true);
      !isCollisionWithRing && gameData.pureCount++;
    });

    const cRingMixer = eRing.get(Mixer);
    const action = cRingMixer.mixer.clipAction(cRingMixer.animations[ANIMATIONS.grid]);
    cRingMixer.mixer.update(0);
    cRingMixer.mixer.setTime(0);
    action.setLoop(THREE.LoopOnce);
    action.stop();
    action.play();

    if (isActiveBoosterX2) this.animateX2View();

    set(({characterMovement}) => (characterMovement.isCollisionWithSensor = true));
  }

  checkCollisionWithGround({eCharacter}) {
    const {
      storage: {
        gameSpace: {get, set},
      },
    } = this;

    const collisions = eCharacter.getSome(EventComponent, COLLISION_START);

    const isHasCollisionWithGround = collisions.some(({data: {entity}}) => entity.type === GROUND);
    if (!isHasCollisionWithGround) return;

    const gameSpace = get();

    const isTruthCondition =
      gameSpace.booster.active !== CLEAR_HIT || gameSpace.characterMovement.isCollisionWithSensor;
    if (!isTruthCondition) return;

    const cTween = eCharacter.get(GSAPTween);
    if (cTween.has(TWEENS.teleportOnInitialPosition)) return;

    const {
      storage: {
        mainSceneSettings: {
          character: {
            startData: {position, rotation},
          },
        },
      },
    } = this;
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

        set(({characterMovement, booster}) => {
          booster.active = null;
          this.clearBoosterData();

          characterMovement.thrown = false;

          gameSpace.characterMovement.isFlewSensor = false;

          characterMovement.isCollisionWithRing = false;
          characterMovement.isCollisionWithSensor = false;
        });
      },
      () => {
        cTween.remove(teleportTween.vars.id);
      },
    );

    cTween.add(teleportTween);
  }

  checkCollision({eGame, eCharacter, eRing}) {
    const {
      storage: {
        gameSpace: {get},
      },
    } = this;

    const gameSpace = get();

    if (!gameSpace.characterMovement.thrown) return;

    this.checkCollisionWithRing(...arguments);
    this.checkCollisionWithSensor(...arguments);
    this.checkCollisionWithGround(...arguments);
  }

  updateFlight({eCharacter, eRing}) {
    const {
      storage: {
        gameSpace: {get, set},
      },
    } = this;

    const gameSpace = get();

    if (!gameSpace.characterMovement.thrown) return;

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
      set(({gameData}) => {
        gameData.lifes--;
        gameData.story.push(false);
      });
    }
  }

  checkOnEnd({eCharacter, eGame}) {
    const {
      storage: {
        gameSpace: {get},
      },
    } = this;

    const gameSpace = get();

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
    this.updateFlight(fullProps);
    this.checkOnEnd(fullProps);
  }
}

function createActivateMethod(type) {
  return `activateBooster${upperFirst(type)}`;
}
