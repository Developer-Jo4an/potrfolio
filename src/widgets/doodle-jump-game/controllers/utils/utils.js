import {upperFirst} from "lodash";

export function getPluginType(type) {
  return `plugin${upperFirst(type)}`;
}

export function initPlugins(system, pluginsList, props) {
  const pluginsData = pluginsList.map(([type, Plugin]) => ({
    type: getPluginType(type),
    Plugin,
  }));

  system.plugins = pluginsData.reduce((acc, {type, Plugin}) => {
    acc[type] = new Plugin(props);
    return acc;
  }, {});
}
