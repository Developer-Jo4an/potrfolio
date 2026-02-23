export function getNextState(states, currentState) {
  let nextState = states[currentState]?.nextState ?? states[currentState]?.availableStates[0];
  if (!nextState) {
    const keys = Object.keys(states);
    nextState = keys[Math.min(keys.indexOf(currentState) + 1, keys.length - 1)];
  }
  return nextState;
}

export function changeState(states, prevState, newState) {
  const {availableStates} = states[prevState];
  return availableStates.includes(newState) ? newState : prevState;
}

export function getDefaultState(stateMachine) {
  return Object.entries(stateMachine).find(([, {isDefault}]) => isDefault)[0];
}
