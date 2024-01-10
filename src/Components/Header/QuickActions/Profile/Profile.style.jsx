import { Box, IconButton, MenuItem, Typography } from "@mui/material";
import styled from "styled-components";

export const Styled = {
  Wrapper: styled(Box)`
    height: 100%;
    width: max-content;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  IconButton: styled(IconButton)`
    width: 36px;
    height: 36px;
    outline: 0.4px solid ${({ style }) => style.primaryColor}50;
  `,
  TypographyName: styled(Typography)`
    font-size: 0.8rem;
    font-weight: 500;
    text-align: right;
    letter-spacing: 0.5px;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  `,
  TypographyRole: styled(Typography)`
    font-size: 0.6rem;
    font-weight: 500;
    text-align: right;
    color: #6d6875;
    letter-spacing: 0.5px;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  `,
  MenuItem: styled(MenuItem)`
    & {
      font-size: 0.8rem;
    }
  `,
};
