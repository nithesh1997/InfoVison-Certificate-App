import { styled } from "styled-components";
import { Box, ButtonBase, Typography } from "@mui/material";

export const Styled = {
  NavigationListWrapper: styled(Box)`
    height: max-content;
    width: 100%;
    border-radius: 4px;
    padding: 0.4rem 0.2rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  `,
  ButtonBase: styled(ButtonBase)`
    width: 100%;
    background-color: ${(props) =>
      props.$isSelected ? props.$backgroundColor : ""};

    :hover {
      background-color: ${(props) => props.$backgroundColor};
    }
  `,
  MenuWrapper: styled(Box)`
    height: 2.6rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  IconWrapper: styled(Box)`
    height: 2.4rem;
    width: 2.4rem;
    display: grid;
    place-items: center;
    margin-left: 0.4rem;
    border-radius: 50%;
  `,
  MenuTextWrapper: styled(Box)`
    height: 100%;
    width: 152px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    display: ${(props) => (props.$isSideMenuOpened ? "auto" : "none")};
  `,
  AccordionWrapper: styled(Box)`
    height: 27px;
    width: 27px;
    display: grid;
    place-items: center;
    display: ${(props) => (props.$isSideMenuOpened ? "auto" : "none")};
    visibility: ${(props) => (props.$isSubMenu ? "auto" : "hidden")};
  `,
  MenuText: styled(Typography)`
    font-size: 0.8rem;
    font-weight: ${(props) => (props.$isSelected ? 500 : 400)};
  `,
};
