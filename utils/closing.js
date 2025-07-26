export const createId = () => {
  let id = 0;

  return {
    get() {
      return id;
    },
    next() {
      id++;
    }
  };
};