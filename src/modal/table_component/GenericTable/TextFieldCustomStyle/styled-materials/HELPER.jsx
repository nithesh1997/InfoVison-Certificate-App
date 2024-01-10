import { Typography } from "@mui/material";
import styled from "@emotion/styled";

export const HELPER = styled(Typography)`
  font-weight: 500;
  color: ${({ textColor }) => textColor || "#F9F9F9"};
  word-break: break-word;
`;
