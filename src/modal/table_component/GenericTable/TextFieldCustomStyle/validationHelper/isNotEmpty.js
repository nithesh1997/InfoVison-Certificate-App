export function isNotEmpty(value) {
  return typeof value === "number" ||
    typeof value === "boolean" ||
    (typeof value === "string" ? value.length : false)
    ? true
    : false;
}
