import {gameCard} from "../../content/gameCard";
import usePlatformerStore from "../../stateManager/platformerStore";

export const modalConstructor = () => {
  return ({modalType, props = {}}) => ({
    gamePreviewModal({game}) {
      const {img} = gameCard[game.id];

      return {
        isCloseOnBackground: true,
        props: {
          topImage: {src: img},
          title: game.title,
          description: game.description,
          buttons: [
            {
              text: "Играть",
              isDisposable: true,
              events: {
                onClick: () => {
                  const {getGameSettings} = usePlatformerStore.getState();
                  getGameSettings();
                }
              },
              modals: [{action: "close", options: {id: "active"}}]
            },
            {
              text: "Закрыть",
              isDisposable: true,
              modals: [{action: "close", options: {id: "active"}}]
            }
          ]
        }
      };
    }
  })[modalType]?.(props);
};