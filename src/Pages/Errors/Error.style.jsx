import { Button, Box, Typography } from "@mui/material";
import styled from "styled-components";

export const Styled = {
  Container: styled(Box)``,
  StyledButton: styled(Button)`
    background: #018ff6;
    color: #ffffff;
    width: 150px;
    margin: 1em 0 0 0;
    text-transform: capitalize;
    padding: 0.6em 1em;
    font-size: 0.85em;
    letter-spacing: 1px;

    &:hover {
      background: #0b5ed7;
    }
  `,
  Images: styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  ErrorLogo: styled("img")`
    height: 100px;
    padding: 2em 0 0 0;
    margin: 0 0 0 1em;
  `,
  Number: styled(Typography)`
    font-style: normal;
    font-weight: 400;
    font-size: 2.1rem;
    line-height: 70px;
    color: #404040;
  `,
  ErrorText: styled(Typography)`
    font-style: normal;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 1px;
    line-height: 20px;
    color: #000;
    text-align: center;
    max-width: 100%;
  `,
  CrashPageErrorText: styled(Typography)`
    font-style: normal;
    font-weight: 400;
    font-size: 1.5rem;
    line-height: 70px;
    color: #404040;
  `,
  CrashPageErrorDescription: styled(Typography)`
    font-style: normal;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 1px;
    line-height: 20px;
    color: #000;
    text-align: center;
    max-width: 100%;
    padding-bottom: 1em;
  `,
};
