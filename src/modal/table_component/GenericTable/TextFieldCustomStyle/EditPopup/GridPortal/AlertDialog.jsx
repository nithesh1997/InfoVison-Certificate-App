import { Divider } from "@mui/material";
import { Button } from "@mui/material";
import { Dialog } from "@mui/material";
import { DialogActions } from "@mui/material";
import { DialogContent } from "@mui/material";
import { DialogContentText } from "@mui/material";
import { DialogTitle } from "@mui/material";
import React from "react";
import styled from "@emotion/styled";
import { GenericButton } from "../GenericButton/GenericButton";

export default function AlertDialog({
  open,
  setOpen,
  contentTitle,
  contentText,
  contentInfo,
  handleAgree,
  agreeTitle,
  handleDisagree,
  disagreeTitle,
  divider = true,
  isred,
  loader,
}) {
  return (
    <DialogBox
      open={open}
      onClose={setOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      disableBackdropClick
    >
      <ModalTitle id="alert-dialog-title">{contentTitle}</ModalTitle>
      <DialogContent style={{ width: "400px", overflowWrap: "break-word" }}>
        <ModalText id="alert-dialog-description">{contentText}</ModalText>
        <Divider
          style={{ margin: "0.5rem 0", display: divider ? "auto" : "none" }}
        />
      </DialogContent>
      <DialogActions>
        {disagreeTitle && (
          <GenericButton
            onClick={handleDisagree}
            backgroundColor="secondary"
            buttonName={disagreeTitle}
            disabled={false}
          />
        )}

        {isred ? (
          <GenericButton
            onClick={() => handleAgree()}
            backgroundColor="primary"
            buttonName={agreeTitle}
            disabled={false || loader}
          />
        ) : (
          <GenericButton
            onClick={() => handleAgree()}
            backgroundColor="primary"
            buttonName={agreeTitle}
            disabled={false || loader}
          />
        )}
      </DialogActions>
    </DialogBox>
  );
}

const DialogBox = styled(Dialog)`
  /* font-family: "Montserrat"; */
`;

const DialogButton = styled(Button)`
  /* font-family: "Montserrat"; */
  font-size: 0.8rem;
  /* font-family: "Montserrat", sans-serif; */
  text-transform: capitalize;
  border: 0.1em solid rgba(2, 147, 254, 1);
  color: rgba(2, 147, 254, 1);
  &:hover {
    background: rgba(2, 147, 254, 0.1);
  }
`;

const AgreeButton = styled(Button)`
  /* font-family: "Montserrat"; */
  font-size: 0.8rem;
  /* font-family: "Montserrat", sans-serif; */
  text-transform: capitalize;
  border: 0.1em solid rgba(237, 20, 61, 1);
  color: rgba(237, 20, 61, 1);

  &:hover {
    background: rgba(237, 20, 61, 0.1);
    border: 0.1em solid rgba(237, 20, 61, 1);
  }
`;

const ModalTitle = styled(DialogTitle)`
  & .MuiTypography-h5 {
    /* font-family: "Montserrat"; */
    font-size: 0.5rem;

    font-weight: 400;
  }
`;

const ModalText = styled(DialogContentText)`
  /* font-family: "Montserrat"; */
  margin-top: 1.2rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #111827;
`;

const ModalTextInfo = styled(DialogContentText)`
  /* font-family: "Montserrat"; */
  font-size: 0.6rem;
  font-weight: 500;
  color: #111827;
`;
