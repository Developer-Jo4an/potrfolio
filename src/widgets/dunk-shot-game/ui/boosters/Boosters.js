import {useEffect} from "react";
import {APPLY, DISABLED, eventSubscription, Image} from "@shared";
import {useDunkShotStore} from "@widgets/dunk-shot-game/model/state-manager/dunkShotStore";
import {EXTRA_LIFE, WINGS, X2} from "@widgets/dunk-shot-game/constants/boosters";
import {WINGS as WINGS_STATE} from "@widgets/dunk-shot-game/constants/stateMachine";
import {BOOSTERS_SET_DISABLED} from "@widgets/dunk-shot-game/constants/events";
import content from "@widgets/dunk-shot-game/constants/content";
import styles from "./Boosters.module.scss";
import {BottomMenu, MODES} from "@features/bottom-menu";

const {boosters: boostersContent} = content;

export function Boosters() {
  const {
    wrapper,
    setDunkShotBoosters,
    gameData: {boosters},
  } = useDunkShotStore();

  const boosterCallbacks = {
    [EXTRA_LIFE]() {
      setDunkShotBoosters({action: APPLY, data: EXTRA_LIFE});
    },
    [X2]() {
      setDunkShotBoosters({action: APPLY, data: X2});
    },
    [WINGS]() {
      setDunkShotBoosters({action: APPLY, data: WINGS});
      wrapper.state = WINGS_STATE;
    },
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
            setDunkShotBoosters({action: DISABLED, data: isDisabled});
          },
        },
      ],
    });
  }, [wrapper]);

  const boosterButtons = boostersContent?.map(({type, timeout, background, img}) => {
    const {isDisabled, isActive, value} = boosters?.find(({name}) => name === type) ?? {};
    const disabled = isDisabled || !value;

    return {
      id: type,
      className: styles.booster,
      onClick: () => onClick({value, name: type, isDisabled: disabled}),
      isDisabled: disabled,
      img: {...img, className: styles[img.className]},
      value: value,
      child: (
        <div className={styles[background.className]}>
          <Image src={background.src} />
        </div>
      ),
      timeout,
    };
  });

  return <BottomMenu buttons={boosterButtons} mod={MODES.ocean} />;
}
