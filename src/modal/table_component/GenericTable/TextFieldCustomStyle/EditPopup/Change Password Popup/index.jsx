import styled from "@emotion/styled";
import ChangePasswordSetup from "./ChangePasswordSetup";
import { GlobalModal } from "../styled-materials/GlobalModal";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";

function ChangePasswordPopup(props) {
  const [changePasswordPopup, setChangePasswordPopup] =
    props.changePasswordState;

  const handleClose = () => {
    setChangePasswordPopup((preState) => ({
      ...preState,
      status: false,
      userId: "",
      userName: "",
    }));
  };

  return (
    <StyledOverlayContentThatFadesIn>
      <GlobalModal
        open={changePasswordPopup.status}
        Content={
          <>
            <ChangePasswordSetup
              handleClose={(e) => handleClose()}
              changePasswordState={props.changePasswordState}
              changePasswordAction={props.changePasswordAction}
            />
          </>
        }
      />
    </StyledOverlayContentThatFadesIn>
  );
}

export default ChangePasswordPopup;

const StyledOverlayContentThatFadesIn = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: start;
  flex: 0 0 auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.5s ease-in;
  pointer-events: none;

  ${(props) => {
    if (props.hidden) {
      return `
        opacity: 1;
        pointer-events: all;
        transition: opacity 0.5s ease-out;
      `;
    }
  }}
`;
