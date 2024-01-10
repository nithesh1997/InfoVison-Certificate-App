import { Button, FormControl, CircularProgress } from "@mui/material";
import styled from "@emotion/styled";
import { Close } from "@mui/icons-material";
import { GenericButton } from "../GenericButton/GenericButton";

export const Styled = {
  StyledContainer: styled.div`
    background-color: rgb(255, 255, 255);
    width: 100%;
    border-radius: 0.75em;
    margin: 0.5em 0 0 0;
  `,

  StyledMainDivComponent: styled.div`
    bottom: 0;
    z-index: 1050;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    width: 50rem;
    background-color: #fff;
    background-clip: padding-box;
    outline: 0;
    border-radius: 0.75em;
    transition: transform 0.3s ease-in-out;
  `,

  HeaderDivComponent: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1rem;
    padding-left: 1.5rem;
    border-bottom: 2px;
    border-bottom: 0.2em solid rgba(2, 147, 254, 1);
    opacity: "0.95";
    padding-top: "16px";
    padding-bottom: "12px";
    color: black;
  `,

  StyledCloseIconComponent: styled(Close)`
    padding: 0.25em;
    margin: -0.5rem -0.5rem -0.5rem auto;
    color: rgb(0, 0, 0);
    cursor: pointer;
    box-sizing: content-box;
    width: 1em;
    height: 1em;
    border: 0px;
    border-radius: 0.25rem;
    opacity: 0.5;
    display: flex;
  `,

  StyledH5Component: styled.h5`
    & {
      /* font-family: "Montserrat", sans-serif; */
    }
    font-size: 1rem;
    margin-top: 0;
    margin-bottom: 0;
    font-weight: 700;
    line-height: 1.5;
    color: rgba(2, 147, 254, 1);
  `,

  BodyDivComponent: styled.div`
    padding: 1rem 1.5rem;
    overflow-y: auto;
    /* font-family: Montserrat; */
    max-height: 30rem;
  `,

  StyledErrorDivComponent: styled.div`
    color: #ef4444;
    margin-bottom: 12px;
    margin: 0.2rem;
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    min-height: 20px;
  `,

  StyledFooterDivComponent: styled.div`
    display: flex;
    justify-content: center;
    padding-top: 1em;
    gap: 10px;
  `,

  Spinner: styled(CircularProgress)``,

  StyledFormContainer: styled.form`
    margin-top: 1rem;
  `,

  StyledFormDivComponent: styled.div`
    margin-bottom: 1.5rem;
    margin-top: 1rem;
  `,
};
