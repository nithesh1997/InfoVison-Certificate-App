import { useState } from "react";
import { PASSWORD_INPUT } from "../styled-materials/variants/PASSWORD_INPUT";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

export const PasswordInput = (props) => {
  const [toggleIcon, setToggleIcon] = useState(false);

  return (
    <PASSWORD_INPUT
      required
      {...props}
      type={toggleIcon ? "text" : "password"}
      InputProps={{
        autoComplete: "off",
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setToggleIcon((preState) => !preState)}
              disabled={props.disabled}
            >
              {toggleIcon ? (
                <VisibilityOutlinedIcon
                  style={{ color: props.disabled ? "grey" : "#333" }}
                />
              ) : (
                <VisibilityOffOutlinedIcon
                  style={{ color: props.disabled ? "grey" : "#333" }}
                />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
