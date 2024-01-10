import { Box } from "@mui/material";
import styled, { keyframes } from "styled-components";

const openMenu = keyframes`
  from {
    width: 52px;
  }

  to {
    width: 240px;
  }
`;

const closeMenu = keyframes`
  from {
    width: 240px;
  }

  to {
    width: 52px;
  }
`;

export const Styled = {
  Wrapper: styled(Box)`
    height: 100%;
    box-shadow: 4px 3px 10px rgb(0 0 0 / 0.2);
    background-color: ${({ $backgroundColor }) => $backgroundColor};
    background-image: url(${({ $backgroundImage }) => $backgroundImage});
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: 5% 105%;
    width: "240px";
    /* width: ${({ $isSideMenuOpened }) =>
      $isSideMenuOpened ? "240px" : "52px"}; */
    /* animation: ${({ $isSideMenuOpened }) =>
      $isSideMenuOpened ? openMenu : closeMenu}
      0.2s 0s alternate; */
  `,
};
