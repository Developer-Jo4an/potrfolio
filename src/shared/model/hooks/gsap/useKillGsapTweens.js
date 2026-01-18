import {useEffect} from "react";

export default function useKillGsapTweens(tweens) {
  useEffect(() => () => {
    for (const key in tweens.current)
      tweens.current[key]?.kill();
  }, []);
};
