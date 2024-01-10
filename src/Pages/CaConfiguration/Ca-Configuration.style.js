import {
  Box,
  Checkbox,
  CircularProgress,
  Typography,
  TextField,
} from "@mui/material";
import styled from "@emotion/styled";

export const Styled = {
  FloatContainer: styled(Box)`
    position: absolute;
    z-index: 1;
    background: rgba(0, 0, 0, 0);
    user-select: none;
    width: 100%;
    height: 100%;
    display: ${({ $display }) => ($display ? "inherit" : "none")};
  `,
  MainContainer: styled(Box)`
    position: relative;
    width: 100%;
    height: 100%;
  `,
  RowContainer: styled(Box)`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    padding: 1em 0 1em 0;
    gap: 2em;
    @media (max-width: 800px) {
      height: auto;
      display: grid;
      grid-auto-rows: 1fr;
      grid-template-columns: 1fr;
    }
  `,
  Input: styled(TextField)`
    & .MuiFormHelperText-root {
      font-size: 0.7rem;
    }
  `,

  SectionTitle: styled(Typography)`
    font-size: 14px;
    font-weight: 700;
    line-height: 17px;
    letter-spacing: 0em;
    text-align: left;
  `,
  Box: styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    border-radius: 0.25em;
  `,
  CheckBox: styled(Checkbox)`
    &.MuiCheckbox-root {
      flex-shrink: 0;
      padding: 0.25rem;
      margin: 0.5rem;
    }
    &:hover {
      background: transparent;
    }
    &.Mui-checked:hover {
      background: transparent;
    }

    & .MuiTouchRipple-child {
      background: transparent;
    }

    & .MuiSvgIcon-root {
      width: 1.3rem;
      height: 1.3rem;
    }

    & .MuiSvgIcon-root {
      fill: ${({ disabled }) =>
        disabled ? "#8A8A8A" : "rgba(2, 147, 254, 1)"};
    }
  `,
  ButtonContainer: styled(Box)`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    padding: 1rem 0 0 0;
    gap: 1rem;
  `,
  Spinner: styled(CircularProgress)``,
};
