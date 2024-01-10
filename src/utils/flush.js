export default function flush() {
  const i18nextLngValue = localStorage.getItem("i18nextLng");

  sessionStorage.clear();
  localStorage.clear();

  localStorage.setItem("i18nextLng", i18nextLngValue);
}
