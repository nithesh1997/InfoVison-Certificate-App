import { styled } from "styled-components";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";

export const Styled = {
  ScreenWrapper: styled(Box)`
    height: 100vh;
    width: 100vw;
    background-color: #065196;
    background-image: url(${({ $backgroundImage }) => $backgroundImage});
    background-repeat: no-repeat;
    background-size: cover;
    display: grid;
    place-items: center;
  `,
  FormWrapper: styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 400px;
    background: #fff;
    height: 550px;
    padding: 1rem;
    border-radius: 0.6rem;
    box-shadow: 0rem 0.1rem 0.3rem 0rem #fff;
  `,
  FormTitle: styled(Typography)`
    font-size: 1.5rem;
    font-weight: 500;
  `,
  ImageBanner: styled(Box)``,
  TextFieldWrapper: styled(Box)`
    width: 100%;
    height: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  `,
  Input: styled(TextField)`
    & .MuiFormHelperText-root {
      font-size: 0.7rem;
    }
  `,
  LinkWrapper: styled(Box)`
    display: flex;
    width: 100%;
    justify-content: flex-end;
  `,
  ButtonWrapper: styled(Box)`
    /* position: relative; */
    /* margin-top: 4em; */
  `,
  LoginButton: styled(Button)`
    &.MuiButton-root {
      width: 368px;
      height: 50px;
      font-size: 1rem;
      font-weight: 600;
      text-align: center;
      text-transform: capitalize;
      border-radius: 4px;
      padding: 8px 16px;
    }

    &.MuiButton-root:hover {
      background: "#0074C7";
      color: #ffffff;
    }

    &.MuiButton-root.Mui-focusVisible {
      background: "#0094FD";
      color: "#FFFFFF";
    }

    &.MuiButton-root.Mui-disabled {
      background: #f0f0f0;
      border: 1px solid #f0f0f0;
      color: #a6a6a6;
    }

    & .MuiTouchRipple-child {
      background: #67bcfa;
    }
  `,
  SpanCaps: styled.span`
    color: #333;
    vertical-align: text-bottom;
    padding-left: 5px;
    text-transform: capitalize;
  `,
  Choices: styled(Box)`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  WarningWrapper: styled(Box)`
    align-self: flex-start;
    width: 100%;
    display: flex;
    align-items: center;
    color: #ff8067;
    visibility: ${(props) => (props.$isWarn ? "inherit" : "hidden")};
  `,
  Spinner: styled(CircularProgress)``,
};
