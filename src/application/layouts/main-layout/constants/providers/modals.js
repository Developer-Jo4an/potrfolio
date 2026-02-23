import {PauseModal} from "@entities/pause-modal";
import {GameEndModal} from "@entities/game-end-modal";

export const MODAL_NAMES = {
  pauseModal: "pauseModal",
  gameEndModal: "gameEndModal",
};

export const modals = {
  [MODAL_NAMES.pauseModal]: PauseModal,
  [MODAL_NAMES.gameEndModal]: GameEndModal,
};
