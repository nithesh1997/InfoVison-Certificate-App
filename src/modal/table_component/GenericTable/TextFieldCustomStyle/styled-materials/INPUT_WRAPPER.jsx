import { Box } from "@mui/material";
import styled from "@emotion/styled";

export const INPUT_WRAPPER = styled(Box)`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 4px;
  width: 100%;
  height: 100%;
  margin: 0;

  & .MuiFormControl-root {
    width: 100%;
  }
`;
