import { Box } from "@mui/material";
import { styled } from "styled-components";

export const Styled = {
  Wrapper: styled(Box)`
    & {
      outline: ${process.env.NODE_ENV === "development"
        ? `1px solid #22222240`
        : "1px solid #22222200"};
      width: 100%;
      height: 92%;
      border-radius: 8px;
      padding: 0rem 0.6rem;
      overflow: hidden;
      overflow-y: scroll;

      &::-webkit-scrollbar {
        width: 6px;
        background-color: #f5f5f500;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #22222250;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-track {
        background-color: #f5f5f500;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-track-piece:end {
        background: transparent;
        margin-bottom: 2px;
      }

      &::-webkit-scrollbar-track-piece:start {
        background: transparent;
        margin-top: 2px;
      }
    }
  `,
};
