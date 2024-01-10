import { Box } from "@mui/material";
import { styled } from "styled-components";

export const Styled = {
  Wrapper: styled(Box)`
    height: 3rem;
    width: 100%;
    padding: 0.3rem;
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  `,
  Container: styled(Box)`
    height: 100%;
    width: 100%;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
  `,
};
