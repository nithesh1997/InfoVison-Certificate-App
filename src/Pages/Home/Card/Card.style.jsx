import { Box, Card, Typography } from "@mui/material";
import styled from "styled-components";

export const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "10px",
  position: "relative",
  cursor: "pointer",
  background: "#ffffff",
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxShadow: "0px 0px 30px #eeeeee",

  "&:hover": {
    boxShadow: "0em 0em 1.7em rgba(0, 0, 0, 0.1) ",
  },
}));

export const StyledIconCircle = styled(Box)`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background-color: #e9f6ff;
  box-sizing: border-box;

  img {
    width: 50%;
    height: 50%;
  }
`;

export const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const StyledTypography = styled(Typography)`
  margin-top: 2rem;
  font-weight: 600;
`;
