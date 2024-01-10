import { Grid } from "@mui/material";
import styled from "styled-components";

export const Styled = {
  Wrapper: styled(Grid)`
    height: 100%;
    overflow-y: auto;
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 1rem;

    @media only screen and (max-width: 480px) {
      grid-template-columns: 1fr;
    }

    @media (min-width: 481px) and (max-width: 767px) {
      grid-template-columns: 1fr 1fr;
    }
  `,
};
