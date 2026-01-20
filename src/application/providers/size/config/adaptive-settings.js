export const LANDSCAPE = "landscape";
export const PORTRAIT = "portrait";
export const DESKTOP = "desktop";
export const MOBILE = "mobile";

const MAX_MOBILE_SIZE = {width: 450, height: 1000};

export function onResize() {
  const {innerWidth: width, innerHeight: height} = window;
  const {documentElement} = document;

  documentElement.style.setProperty("--app-width", `${width}px`);
  documentElement.style.setProperty("--app-height", `${height}px`);

  const device = getDevice(width, height);
  documentElement.setAttribute("data-device", device);

  return {width, height, device};
}

export function getDevice(width, height) {
  const orientation = width > height ? LANDSCAPE : PORTRAIT;
  switch (orientation) {
    case PORTRAIT: {
      return width > MAX_MOBILE_SIZE.width || height > MAX_MOBILE_SIZE.height
        ? createDeviceName(DESKTOP, orientation)
        : createDeviceName(MOBILE, orientation);
    }
    case LANDSCAPE: {
      return width > MAX_MOBILE_SIZE.height || height > MAX_MOBILE_SIZE.width
        ? createDeviceName(DESKTOP, orientation)
        : createDeviceName(MOBILE, orientation);
    }
  }
}

export function createDeviceName(platform, orientation) {
  return `${platform}-${orientation}`;
}
