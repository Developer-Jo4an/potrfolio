import {GameEndModal} from "../../../../features/game-end-modal";
import {PauseModal} from "../../../../features/pause-modal";

export const MODAL_NAMES = {pauseModal: "pauseModal", gameEndModal: "gameEndModal"};

export const modals = {[MODAL_NAMES.pauseModal]: PauseModal, [MODAL_NAMES.gameEndModal]: GameEndModal};
