// import { Sacred, Multiline, Dropdown } from ".";
import { Sacred } from "./Sacred";
import { Multiline } from "./Multiline";
import { Dropdown } from "./Dropdown";
import { PasswordInput } from "./PasswordInput";

export const AbstractSwitch = (props) => {
  switch (props.type) {
    case "text":
      return <Sacred {...props} />;
    case "multiline":
      return <Multiline {...props} />;
    case "dropdown-single":
      return <Dropdown {...props} />;
    case "dropdown-multiple":
      return <Dropdown {...props} />;
    case "dropdown-free-single":
      return <Dropdown {...props} />;
    case "dropdown-free-multiple":
      return <Dropdown {...props} />;
    case "password-field":
      return <PasswordInput {...props} />;
    default:
      return <Sacred {...props} />;
  }
};
