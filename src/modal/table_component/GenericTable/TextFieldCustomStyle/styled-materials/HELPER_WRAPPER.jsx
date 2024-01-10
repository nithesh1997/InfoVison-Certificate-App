import { Box } from "@mui/material";
import styled from "@emotion/styled";

export const HELPER_WRAPPER = styled(Box)`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 0.4rem;
  margin: 0.2rem 0;
  border: 0px solid;
  overflow-wrap: break-word;
  max-width: 100%;
  border-color: ${({ borderColor }) => borderColor || "#5b5b5b30"};
  background: ${({ backgroundColor }) =>
    backgroundColor.concat("06") || "#21212F"};
`;
