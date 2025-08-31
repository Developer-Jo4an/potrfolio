export const createId = () => {
  let id = 0;
  return () => id++;
};