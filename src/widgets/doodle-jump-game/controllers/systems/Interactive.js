import {Input} from "../components/Input";
import {InputActions} from "../constants/inputActions";
import {Events} from "../constants/events";
import {System, RIGHT, LEFT, isMobile, getEventPosition, eventSubscription} from "@shared";

export class Interactive extends System {
  static ActionKeyCodes = {
    [InputActions.RIGHT]: [68, 39],
    [InputActions.LEFT]: [65, 37],
  };

  constructor() {
    super(...arguments);

    this.initInteractiveEvents = this.initInteractiveEvents.bind(this);
    this.resetActions = this.resetActions.bind(this);
  }

  async initializationLevelSelect() {
    await this.initInteractiveEvents();
  }

  async initInteractiveEvents() {
    const {
      storage: {
        stage,
        renderer,
        serviceData: {clearFunctions},
      },
    } = this;

    stage.eventMode = "static";
    stage.hitArea = renderer.screen;

    const {cInput} = this.getCharacterInfo();

    const interactiveArray = [
      {func: this.initGyroscope, process: Input.Processes.GYROSCOPE},
      {func: this.initTaps, process: Input.Processes.TAP},
      {func: this.initKeyboard, process: Input.Processes.KEYBOARD},
    ];

    for (const {func, process} of interactiveArray) {
      const isConnected = await func.call(this);
      if (isConnected) {
        cInput.process = process;
        break;
      }
    }

    const clear = eventSubscription({
      callbacksBus: [{event: "blur", callback: this.resetActions}],
    });

    clearFunctions.push(() => {
      stage.eventMode = "passive";
      stage.hitArea = null;

      clear();
    });

    this.clearSomeEvents();
  }

  async initKeyboard() {
    if (isMobile()) return false;

    const {
      storage: {
        stage,
        serviceData: {clearFunctions},
      },
      eventBus,
    } = this;

    const actions = {
      down: (e) => {
        e.preventDefault();
        this.toggleAction(Events.ACTIVATE_ACTION, e);
      },
      up: (e) => {
        e.preventDefault();
        this.toggleAction(Events.DEACTIVATE_ACTION, e);
      },
      onClick: (e) => {
        e.preventDefault();
        const {x, y} = getEventPosition(e);
        eventBus.dispatchEvent({type: Events.CLICK, x, y});
      },
    };

    clearFunctions.push(
      eventSubscription({
        callbacksBus: [
          {event: "keydown", callback: actions.down},
          {event: "keyup", callback: actions.up},
          {target: stage, event: "pointertap", callback: actions.onClick},
        ],
      }),
    );

    return true;
  }

  async initGyroscope() {
    if (!isMobile() || !global.DeviceOrientationEvent) return false;

    if (DeviceOrientationEvent.requestPermission) {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== "granted") return false;
      } catch {
        return false;
      }
    }

    const {
      eventBus,
      storage: {
        stage,
        serviceData: {clearFunctions},
      },
    } = this;

    const {
      cPhysics,
      cInput,
      settings: {
        speed: {
          gyroscope: {multiplier},
        },
      },
    } = this.getCharacterInfo();

    const actions = {
      onChangeOrientation: (e) => {
        e.preventDefault();
        const {gamma} = e;
        this.resetActions();
        gamma > 0 ? (cInput.right = true) : (cInput.left = true);
        cPhysics.speedX = gamma * multiplier;
      },
      onClick: (e) => {
        e.preventDefault();
        const {x, y} = getEventPosition(e);
        eventBus.dispatchEvent({type: Events.CLICK, x, y});
      },
    };

    clearFunctions.push(
      eventSubscription({
        callbacksBus: [
          {event: "deviceorientation", callback: actions.onChangeOrientation},
          {target: stage, event: "pointertap", callback: actions.onClick},
        ],
      }),
    );

    return true;
  }

  async initTaps() {
    if (!isMobile()) return false;

    const {
      storage: {
        serviceData: {clearFunctions},
      },
    } = this;

    const touchData = {};

    const actions = {
      start: (e) => {
        for (const {identifier} of e.changedTouches) {
          const {clientX} = e.changedTouches?.[0] ?? {clientX: 0};
          const action = clientX >= global.innerWidth / 2 ? InputActions.RIGHT : InputActions.LEFT;
          const keyCode = (touchData[identifier] = Interactive.ActionKeyCodes[action][0]);
          this.toggleAction(Events.ACTIVATE_ACTION, {keyCode});
        }
      },
      end: (e) => {
        for (const {identifier} of e.changedTouches) {
          const keyCode = touchData[identifier];
          if (!!keyCode) {
            this.toggleAction(Events.DEACTIVATE_ACTION, {keyCode});
            delete touchData[identifier];
          }
        }
      },
    };

    const callbacksBus = [
      {event: "touchstart", callback: actions.start},
      {event: ["touchend", "touchcancel"], callback: actions.end},
    ];

    clearFunctions.push(eventSubscription({callbacksBus}));

    return true;
  }

  clearSomeEvents() {
    const {
      storage: {
        serviceData: {clearFunctions},
      },
    } = this;

    const disable = (e) => e.preventDefault();

    clearFunctions.push(
      eventSubscription({
        callbacksBus: [{event: ["contextmenu", "copy"], callback: disable}],
      }),
    );
  }

  toggleAction(eventType, {keyCode}) {
    const {cInput} = this.getCharacterInfo();

    const isRight = Interactive.ActionKeyCodes[InputActions.RIGHT].includes(keyCode);
    const isLeft = Interactive.ActionKeyCodes[InputActions.LEFT].includes(keyCode);

    let action;
    if (isRight) action = InputActions.RIGHT;
    if (isLeft) action = InputActions.LEFT;

    if (!action) return;

    const necessaryFieldValue = action === InputActions.RIGHT ? cInput.right : cInput.left;

    if (
      (eventType === Events.ACTIVATE_ACTION && necessaryFieldValue) ||
      (eventType === Events.DEACTIVATE_ACTION && !necessaryFieldValue)
    )
      return;

    const necessaryField = {
      [InputActions.RIGHT]: RIGHT,
      [InputActions.LEFT]: LEFT,
    }[action];

    cInput[necessaryField] = eventType === Events.ACTIVATE_ACTION;
  }

  resetActions() {
    const {cInput} = this.getCharacterInfo();
    cInput.right = false;
    cInput.left = false;
  }
}
