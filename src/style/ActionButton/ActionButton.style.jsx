import { Button } from "@mui/material";
import { styled } from "styled-components";

export const Styled = {
  ActionButton: styled(Button)`
    &.MuiButton-root {
      height: 32px;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      text-align: center;
      text-transform: capitalize;
      border-radius: 4px;
      background: ${(props) =>
        props.backgroundColor === "primary"
          ? "#0094FD"
          : props.backgroundColor === "secondary"
          ? "#F0F0F0"
          : props.backgroundColor === "danger"
          ? "#FF3D3D"
          : null};
      color: ${(props) =>
        props.backgroundColor === "primary" ||
        props.backgroundColor === "danger"
          ? "#FFFFFF"
          : props.backgroundColor === "secondary"
          ? "#000000"
          : null};
      /* min-width: 38px; */
      padding: 8px 16px;
    }

    &.MuiButton-root:hover {
      background: ${(props) =>
        props.backgroundColor === "primary"
          ? "#0074C7"
          : props.backgroundColor === "secondary"
          ? "#EDEDF0"
          : props.backgroundColor === "danger"
          ? "#962A1A"
          : null};
      color: ${(props) =>
        props.backgroundColor === "primary" ||
        props.backgroundColor === "danger"
          ? "#FFFFFF"
          : props.backgroundColor === "secondary"
          ? "#000000"
          : null};
    }

    &.MuiButton-root.Mui-focusVisible {
      background: ${(props) =>
        props.backgroundColor === "primary"
          ? "#0094FD"
          : props.backgroundColor === "secondary"
          ? "#F0F0F0"
          : null};
      color: ${(props) =>
        props.backgroundColor === "primary"
          ? "#FFFFFF"
          : props.backgroundColor === "secondary"
          ? "#000000"
          : null};
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
};
