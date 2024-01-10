export default function (filename) {
  const parts = filename.split(".");
  return parts.pop();
}
