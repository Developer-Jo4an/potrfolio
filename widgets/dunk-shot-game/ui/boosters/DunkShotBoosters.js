import cl from "classnames";
import {Button} from "../../../../shared/ui/button";
import {isNumber} from "lodash";
import useBoosters from "../../model/hooks/useBoosters";
import styles from "./DunkShotBoosters.module.scss";

export default function DunkShotBoosters({navRefs}) {
  const {boosters, onClick} = useBoosters({navRefs});

  return (
    <div className={styles.boosters}>
      {boosters?.map(({Icon, name, value, isActive, isDisabled}) => (
        <Button
          key={name}
          isDisabled={isDisabled || !value}
          className={cl(
            styles.booster,
            styles[name],
            {
              [styles.boosterInactive]: isDisabled || !value,
              [styles.boosterActive]: isActive
            }
          )}
          events={{onClick: () => onClick({value, name, isDisabled: isDisabled || !value})}}
        >
          <Icon/>
          {isNumber(value) && <div className={styles.boosterCount}>{value}</div>}
        </Button>
      ))}
    </div>
  );
}