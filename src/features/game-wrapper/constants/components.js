//todo: поправить импорты x-нотацией
import {TopMenu} from "@entities/top-menu";
import {Background} from "@entities/game-background";
import {Loader} from "@shared";

export const ComponentTypes = {
  BACKGROUND: "background",
  TOP_MENU: "topMenu",
  LOADER: "loader"
};

export const components = {
  [ComponentTypes.BACKGROUND]: Background,
  [ComponentTypes.TOP_MENU]: TopMenu,
  [ComponentTypes.LOADER]: Loader
};