import { Box, Typography } from "@mui/material";
import { styled } from "styled-components";

export const Styled = {
  Wrapper: styled(Box)`
    & {
      height: 3%;
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 1rem;
      box-shadow: 0 -1px 10px 1px rgba(0, 0, 0, 0.2);
    }
  `,
  Text: styled(Typography)`
    font-size: 0.6rem;
    font-weight: 600;
  `,
  Version: styled(Typography)`
    font-family: "Fira Code Variable";
    font-size: 0.6rem;
    font-weight: 600;
    margin: 0rem 0.2rem;

    &::before {
      content: "v";
    }
  `,
};
