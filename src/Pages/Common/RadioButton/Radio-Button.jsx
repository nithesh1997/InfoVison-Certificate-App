import * as Mat from "@mui/material";
import styled from "@emotion/styled";

export const Radio = ({
  labelName = "",
  value = "",
  disabled = false,
  ...props
}) => {
  return (
    <>
      {" "}
      <Mat.FormControlLabel
        label={labelName}
        value={value}
        control={
          <StyledRadio
            disabled={disabled}
            style={{ color: disabled ? "#BABABA" : "#1976d2" }}
            {...props}
          />
        }
      />
    </>
  );
};

const StyledRadio = styled(Mat.Radio)``;
