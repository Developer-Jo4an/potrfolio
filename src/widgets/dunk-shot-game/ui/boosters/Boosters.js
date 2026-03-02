import {useEffect} from "react";
import {Boosters as BoostersMenu} from "@entities/boosters";
import {APPLY, DISABLED, eventSubscription, Image} from "@shared";
import {MODES} from "@entities/bottom-menu";
import {useDunkShotStore} from "@widgets/dunk-shot-game/model/state-manager/dunkShotStore";
import {EXTRA_LIFE, WINGS, X2} from "../../controllers/constants/boosters";
import {WINGS as WINGS_STATE} from "../../controllers/constants/stateMachine";
import {BOOSTERS_SET_DISABLED} from "../../controllers/constants/events";
import content from "../../constants/content";

const {boosters: boostersContent} = content;

export function Boosters() {
  const {
    wrapper,
    setBoosters,
    gameData: {boosters},
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
            setBoosters({action: DISABLED, data: isDisabled});
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
      onClick: () => onClick({value, name: type, isDisabled: disabled}),
      isActive,
      isDisabled: disabled,
      img,
      value,
      child: (styles) => (
        <div className={styles.background}>
          <Image {...background} />
        </div>
      ),
      timeout,
    };
  });

  return <BoostersMenu list={boosterButtons} mod={MODES.ocean} />;
}
