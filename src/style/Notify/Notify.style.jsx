import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { styled } from "styled-components";

export const Styled = {
  Dialog: styled(Dialog)``,
  HeaderBox: styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.4em 0.4em;
    border-bottom: 0.2em solid rgba(2, 147, 254, 1);
    color: rgba(2, 147, 254, 1);
  `,
  CloseButton: styled(IconButton)`
    &:hover {
      background: #d6eeff60;
    }
  `,
  Topic: styled(Typography)`
    &.MuiTypography-root {
      color: ${(props) => (props.$type === "error" ? "crimson" : "#0094fd")};
      font-weight: 600;
      padding: 0 0 0 1rem;
    }
  `,
  Message: styled(DialogContentText)`
    font-size: 0.9rem;
    color: #111827;
    inset: inherit;
    overflow-wrap: break-word;
  `,
  Divider: styled(Divider)``,
  DialogContent: styled(DialogContent)`
    padding: 2rem 1.2rem;
    max-height: 400px;
    width: 400px;
  `,
  DialogActions: styled(DialogActions)``,
};
