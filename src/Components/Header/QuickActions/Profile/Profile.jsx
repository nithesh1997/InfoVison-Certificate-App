import * as React from "react";
import { Box, CircularProgress, Menu, MenuItem, useTheme } from "@mui/material";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import captalize from "src/utils/captalize";
import { LogoutOutlined } from "@mui/icons-material";
import resetSession from "src/utils/resetSession";
import { Styled } from "./Profile.style";
import axios from "axios";
import Notify from "src/style/Notify";

const initNotifyState = { isDisplay: false, type: "", topic: "", message: "" };

const Profile = () => {
  const { palette } = useTheme();
  const userStore = useSelector((store) => store.user);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isLogoutDisabled, setIsLogoutDisabled] = React.useState(false);

  const [notifyState, setNotifyState] = React.useState(initNotifyState);

  const open = Boolean(anchorEl);

  const closeNotifyHandler = () => {
    setNotifyState(initNotifyState);
  };

  const handleClick = (/* event */) => {
    // setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setIsLogoutDisabled(true);

    axios({
      method: "post",
      url: "users/logout",
    })
      .then(() => {
        setIsLogoutDisabled(false);
        resetSession(navigate);
      })
      .catch((error) => {
        setIsLogoutDisabled(false);
        const payloadBuffer = String.fromCharCode.apply(
          null,
          new Uint8Array(error.response?.data ?? {}),
        );

        const payload = JSON.parse(payloadBuffer || "{}");

        setNotifyState({
          isDisplay: true,
          type: "error",
          topic: payload.error ?? `Error ${error.statusCode ?? "In App"}`,
          message: payload.message ?? error.message,
        });
      });
  };

  return (
    <Styled.Wrapper>
      <Box style={{ margin: "0rem 0.8rem" }}>
        <Styled.TypographyName>
          {captalize(userStore.userDisplayName)}
        </Styled.TypographyName>

        <Styled.TypographyRole>
          {captalize(userStore.role)}
        </Styled.TypographyRole>
      </Box>

      <Styled.IconButton
        onClick={handleClick}
        style={{
          margin: "0rem 0.8rem 0rem 0rem",
          primaryColor: palette.primary.main,
        }}
      >
        <PermIdentityOutlinedIcon color={"primary"} />
      </Styled.IconButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>
          <Styled.TypographyName>Profile</Styled.TypographyName>
        </MenuItem>

        <MenuItem disabled={isLogoutDisabled} onClick={handleLogout}>
          <Styled.TypographyName>Logout</Styled.TypographyName>
        </MenuItem>
      </Menu>

      <Styled.IconButton
        onClick={handleLogout}
        disabled={isLogoutDisabled}
        style={{
          margin: "0rem 0.2rem 0rem 0rem",
          primaryColor: palette.primary.main,
        }}
      >
        {isLogoutDisabled ? (
          <CircularProgress style={{ width: "100%", height: "100%" }} />
        ) : (
          <LogoutOutlined color={"primary"} />
        )}
      </Styled.IconButton>

      <Notify {...notifyState} closeHandler={closeNotifyHandler} />
    </Styled.Wrapper>
  );
};

export default Profile;
