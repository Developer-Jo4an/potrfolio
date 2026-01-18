export const MOUSE_DOWN = "mousedown";
export const MOUSE_MOVE = "mousemove";
export const MOUSE_LEAVE = "mouseleave";
export const MOUSE_ENTER = "mouseenter";
export const MOUSE_UP = "mouseup";

export const TOUCH_START = "touchstart";
export const TOUCH_MOVE = "touchmove";
export const TOUCH_END = "touchend";
export const TOUCH_CANCEL = "touchcancel";

export const RESIZE = "resize";
export const ORIENTATION_CHANGE = "orientationchange";

export const POINTER_DOWN = "pointerdown";
export const POINTER_MOVE = "pointermove";
export const POINTER_UP = "pointerup";
export const POINTER_UP_OUTSIDE = "pointerupoutside";

export const DRAG_START = "drag:start";
export const DRAG_MOVE = "drag:move";
export const DRAG_END = "drag:end";

export const START = [TOUCH_START, MOUSE_DOWN];
export const MOVE = [TOUCH_MOVE, MOUSE_MOVE];
export const END = [TOUCH_END, TOUCH_CANCEL, MOUSE_UP];


