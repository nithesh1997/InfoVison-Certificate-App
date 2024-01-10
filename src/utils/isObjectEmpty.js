const isObjectEmpty = (_object) => {
  const properties = Object.keys(_object);

  return Boolean(properties.length ?? 0);
};

export default isObjectEmpty;
