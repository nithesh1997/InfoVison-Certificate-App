import * as M from "@mui/material";
import styled from "@emotion/styled";

export const PASSWORD_FIELD = styled(M.TextField)`
  & .MuiOutlinedInput-input {
    padding: 1.2rem;
    border-radius: 4px;
    background: ${({ backgroundColor }) => backgroundColor};
  }

  & .MuiOutlinedInput-input:hover {
    padding: 1.2rem;
    border-radius: 4px;
    background: ${({ backgroundColorOnHover }) => backgroundColorOnHover};
  }

  & .MuiOutlinedInput-root.Mui-focused .MuiInputBase-input {
    padding: 1.2rem;
    border-radius: 4px;
    background: ${({ backgroundColorOnFocus }) => backgroundColorOnFocus};
  }

  & .MuiFormLabel-root {
    color: ${({ labelColor }) => labelColor};
  }

  & .MuiInputLabel-root {
    color: ${({ labelColor }) => labelColor};
  }

  /* todo: Unable to apply these styles */
  & .MuiFormLabel-root:hover {
    color: ${({ labelColorOnHover }) => labelColorOnHover};
  }

  & .MuiInputLabel-root:hover {
    color: ${({ labelColorOnHover }) => labelColorOnHover};
  }
  /* todo: Unable to apply these styles */

  & .MuiFormLabel-root.Mui-focused {
    color: ${({ labelColorOnFocus }) => labelColorOnFocus};
  }

  & .MuiInputLabel-root.Mui-focused {
    border-color: ${({ labelColorOnFocus }) => labelColorOnFocus};
  }

  & .MuiInputLabel-outlined {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 80%;
  }

  & .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border-color: ${({ borderColor }) => borderColor};
    border-width: 1px;
  }

  & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: ${({ borderColorOnHover }) => borderColorOnHover};
    border-width: 1px;
  }

  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${({ borderColorOnFocus }) => borderColorOnFocus};
    border-width: 1px;
  }

  & .MuiInputLabel-outlined.MuiInputLabel-shrink {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
`;
