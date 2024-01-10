import { Box } from "@mui/material";
import styled, { keyframes } from "styled-components";

const openMenu = keyframes`
  from {
    width: 100%;
  }

  to {
    width: calc(100% - 240px);
  }
`;

const closeMenu = keyframes`
  from {
    width: calc(100% - 240px);
  }

  to {
    width: 100%;
  }
`;

export const Styled = {
  App: styled(Box)`
    & {
      height: 100vh;
      width: 100vw;
    }
  `,
  ContentWrapper: styled(Box)`
    height: calc(100% - 3rem);
    width: 100%;
    display: flex;
  `,
  MainWrapper: styled(Box)`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    animation-name: ${({ $isSideMenuOpened }) =>
      $isSideMenuOpened ? openMenu : closeMenu};
    animation-delay: 0ms;
    animation-duration: 200ms;
    animation-direction: alternate;
    animation-timing-function: linear;
    overflow: auto;
  `,
  Page: styled(Box)`
    & {
      width: 100%;
      height: calc(100% - 3%);
      padding: 0.85rem 1rem 1rem 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }
  `,
};
