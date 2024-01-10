import styled from "@emotion/styled";
import { SACRED } from "./SACRED";

export const MULTILINE = styled(SACRED)`
  & .MuiInputBase-root {
    padding: 0;
    width: "100%";
  }

  & .MuiInputBase-input {
    max-height: 8em;
    overflow: scroll;
  }
`;
