export default function (bytes) {
  const BYTE = 1024;
  const DECIMAL = 2;
  const KILOBYTE = BYTE;
  const MEGABYTE = BYTE * BYTE * BYTE;
  const GIGABYTE = BYTE * BYTE * BYTE * BYTE;

  if (bytes < KILOBYTE) {
    return bytes + " B";
  } else if (bytes < MEGABYTE) {
    return (bytes / KILOBYTE).toFixed(DECIMAL) + " KB";
  } else if (bytes < GIGABYTE) {
    return (bytes / MEGABYTE).toFixed(DECIMAL) + " MB";
  } else {
    return (bytes / GIGABYTE).toFixed(DECIMAL) + " GB";
  }
}
