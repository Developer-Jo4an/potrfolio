export function playAnimationOnce({spine, name, loop = false, pause = false, reverse = false}) {
  return new Promise((resolve) => {
    const entry = spine.state.setAnimation(0, name, loop);
    spine.state.timeScale = +!pause;
    entry.reverse = reverse;

    const handler = (trackEntry) => {
      if (trackEntry === entry) {
        spine.state.removeListener(listener);
        resolve();
      }
    };

    const listener = {
      complete: handler,
      end: handler,
    };

    spine.state.addListener(listener);
  });
}
