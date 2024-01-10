import flush from "./flush";

export default function resetSession(navigate) {
  flush();
  navigate("/login");
}
