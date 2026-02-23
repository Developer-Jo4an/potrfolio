import {useEffect} from "react";
import {APPLY, DISABLED, eventSubscription, Image} from "@shared";
import {useDunkShotStore} from "@widgets/dunk-shot-game/model/state-manager/dunkShotStore";
import {EXTRA_LIFE, WINGS, X2} from "../../controllers/constants/boosters";
import {WINGS as WINGS_STATE} from "../../controllers/constants/stateMachine";
import {BOOSTERS_SET_DISABLED} from "../../controllers/constants/events";
import content from "../../controllers/constants/content";
import styles from "./Boosters.module.scss";
import {BottomMenu, MODES} from "@entities/bottom-menu";

const {boosters: boostersContent} = content;

export function Boosters() {
  const {
    wrapper,
    setBoosters,
    gameData: {boosters}
  } = useDunkShotStore();

  const boosterCallbacks = {
    [EXTRA_LIFE]() {
      setBoosters({action: APPLY, data: EXTRA_LIFE});
    },
    [X2]() {
      setBoosters({action: APPLY, data: X2});
    },
    [WINGS]() {
      setBoosters({action: APPLY, data: WINGS});
      wrapper.state = WINGS_STATE;
    }
  };

  const onClick = ({value, name, isDisabled}) => {
    if (value && !isDisabled) boosterCallbacks[name]();
  };

  useEffect(() => {
    if (!wrapper) return;

    const {eventBus} = wrapper;

    return eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: BOOSTERS_SET_DISABLED,
          callback({isDisabled}) {
            setBoosters({action: DISABLED, data: isDisabled});
          }
        }
      ]
    });
  }, [wrapper]);

  const boosterButtons = boostersContent?.map(({type, timeout, background, img}) => {
    const {isDisabled, isActive, value} = boosters?.find(({name}) => name === type) ?? {};
    const disabled = isDisabled || !value;

    return {
      id: type,
      className: styles.booster,
      onClick: () => onClick({value, name: type, isDisabled: disabled}),
      isActive,
      isDisabled: disabled,
      img: {...img, className: styles[img.className]},
      value: value,
      child: (
        <div className={styles[background.className]}>
          <Image src={background.src}/>
        </div>
      ),
      timeout
    };
  });

  return <BottomMenu buttons={boosterButtons} mod={MODES.ocean}/>;
}
