import {upperFirst} from "lodash";

export function getPluginType(type) {
  return `plugin${upperFirst(type)}`;
}

export function getPlugin(type, plugins) {
  const pluginType = getPluginType(type);
  return plugins[pluginType];
}

export function generate(type, plugins, ...args) {
  const plugin = getPlugin(type, plugins);
  return plugin.generate(...args);
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
