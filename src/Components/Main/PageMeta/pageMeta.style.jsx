import { Box, Typography } from "@mui/material";
import { styled } from "styled-components";

export const Styled = {
  Wrapper: styled(Box)`
    & {
      width: 100%;
      height: 6%;
      border-radius: 8px;
      padding: 0.2rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  `,
  BreadCrumbsWrapper: styled(Box)`
    & {
      width: max-content;
      height: 100%;
      border-radius: 8px;
      padding: 0rem 0.4rem;
    }
  `,
  PageNameWrapper: styled(Box)`
    & {
    }
  `,
  PageNameText: styled(Typography)`
    & {
      font-size: 0.9rem;
      font-weight: 800;
      line-height: 1.1rem;
    }
  `,
  PageBreadCrumbsWrapper: styled(Box)`
    & {
    }
  `,
  PageBreadCrumbsText: styled(Typography)`
    & {
      font-family: "Fira Code Variable";
      font-size: 0.68rem;
      font-weight: 500;
    }
  `,
};
