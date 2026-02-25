import * as Bowser from "bowser";

export function getBrowserData() {
  return global.navigator ? Bowser.getParser(global.navigator.userAgent) : null;
}

export function isMobile() {
  return !!getBrowserData()?.parsedResult.platform.type.match(/mobile/);
}
