import styled from "@emotion/styled";
import { SACRED } from "./SACRED";

export const DATE_TIME = styled(SACRED)`
  &.MuiFormControl-root {
    max-width: 100%;
  }

  & .MuiInputLabel-outlined.MuiInputLabel-shrink {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
`;
