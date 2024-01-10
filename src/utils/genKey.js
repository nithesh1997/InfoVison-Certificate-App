export default function (id) {
  const _ = Math.random().toString(16).slice(2).toLocaleUpperCase();
  const __ = id?.toLocaleUpperCase() ?? "";

  return `${_}${__}`;
}
