import { IconButton, Tooltip, useTheme } from "@mui/material";
import styled, { keyframes } from "styled-components";

// Icons
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";

const ToggleSideMenu = (props) => {
  const { palette } = useTheme();

  return (
    <Tooltip
      enterDelay={800}
      title={`Press "${props.isSideMenuOpened ? "]" : "["}" to ${
        props.isSideMenuOpened ? "close" : "open"
      } the menu`}
    >
      <Styled.IconButton
        onClick={props.toggleSideMenu}
        style={{ isSideMenuOpened: props.isSideMenuOpened }}
        disableRipple
      >
        {props.isSideMenuOpened ? (
          <ArrowBackIosOutlinedIcon
            style={{ fontSize: "12px", color: palette.grey[900] }}
          />
        ) : (
          <ArrowForwardIosOutlinedIcon
            style={{ fontSize: "12px", color: palette.grey[900] }}
          />
        )}
      </Styled.IconButton>
    </Tooltip>
  );
};

export default ToggleSideMenu;

const openMenu = keyframes`
  from {
    left: 52px;
  }

  to {
    left: 240px;
  }
`;

const closeMenu = keyframes`
  from {
    left: 240px;
  }

  to {
    left: 52px;
  }
`;

const Styled = {
  IconButton: styled(IconButton)`
    width: 24px;
    height: 24px;
    background: #f4f3ee;
    border-radius: 50%;
    position: fixed;
    top: 74px;
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
    z-index: 1;
    left: calc(
      ${(props) => (props.style.isSideMenuOpened ? "240px" : "52px")} - 0.75rem
    );
    animation-name: ${({ style }) =>
      style.isSideMenuOpened ? openMenu : closeMenu};
    /* animation-delay: 0ms; */
    animation-duration: 200ms;
  `,
};
