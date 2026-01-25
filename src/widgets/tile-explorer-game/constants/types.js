import {State} from "@shared";
import {Game} from "../controllers/components/Game";
import {STATE_MACHINE} from "./stateMachine";
import {GAME} from "./game";

export const types = {
  [GAME]: {components: [{Class: State, props: {states: STATE_MACHINE}}, {Class: Game}]}
};
