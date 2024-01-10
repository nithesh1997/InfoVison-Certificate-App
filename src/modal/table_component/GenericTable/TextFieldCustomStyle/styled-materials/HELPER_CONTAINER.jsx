import { Box } from "@mui/material";
import styled from "@emotion/styled";

export const HELPER_CONTAINER = styled(Box)`
  display: ${({ display }) => (display ? "grid" : "none")};
  box-sizing: border-box;
  word-wrap: break-word;
  top: 95%;
  width: 100%;
`;
