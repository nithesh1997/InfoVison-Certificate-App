export default (value) => {
  if (value) {
    return `${value[0].toLocaleUpperCase()}${value.slice(1)}`;
  } else {
    return value;
  }
};
