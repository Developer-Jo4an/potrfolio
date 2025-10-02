export default function getDefaultState(stateMachine) {
  return Object.entries(stateMachine).find(([, {isDefault}]) => isDefault)[0];
}