const isFalsy = (value) => (value === 0 ? false : !value);
export const cleanObject = (obj) => {
  let result = { ...obj };
  Object.keys(result).forEach((key) => {
    if (isFalsy(result[key])) {
      delete result[key];
    }
  });
  return result;
};
