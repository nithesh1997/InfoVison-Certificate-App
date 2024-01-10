import React, { useState } from "react";
import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import { Box } from "@mui/material";

export const GlobalModal = ({ Content, ...props }) => {
  const [openModal, setOpenModal] = useState(true);
  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <Styled.Modal open={openModal} onClose={handleClose} {...props}>
      <Styled.Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          maxHeight: "35rem",
          overflowY: "scroll",
          backgroundColor: "#FFFFFF",
          border: "none",
          outline: "none",
          borderRadius: 2,
          // boxShadow:
          //   "0px 0.6px 1.8px rgba(0, 0, 0, 0.1), 0px 3.2px 7.2px rgba(0, 0, 0, 0.13)",
        }}
      >
        {Content}
      </Styled.Box>
    </Styled.Modal>
  );
};

const Styled = {
  Modal: styled(Modal)``,
  Box: styled(Box)``,
};

const BoxStyle = {
  width: "100%",
  height: "100%",
  backgroundColor: "#FFFFFF",
  border: "none",
  outline: "none",
  borderRadius: 2,
  boxShadow:
    "0px 0.6px 1.8px rgba(0, 0, 0, 0.1), 0px 3.2px 7.2px rgba(0, 0, 0, 0.13)",
};
