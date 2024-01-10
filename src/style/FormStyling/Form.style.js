import { Box, Typography, FormControl, TextareaAutosize } from "@mui/material";
import { styled } from "styled-components";

export const Styled = {
  Wrapper: styled(Box)`
    width: 100%;
    height: calc(100% - 0.8rem);
    margin-top: 0.8rem;
  `,
  FormWrapper: styled(Box)`
    width: 100%;
    height: 6rem;
    display: flex;
    justify-content: space-evenly;
    gap: 2rem;

    @media (max-width: 800px) {
      flex-direction: column;
      height: auto;
      justify-content: space-between;
    }
  `,
  ButtonContainer: styled(Box)`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    padding: 1em 0;
    gap: 1em;
  `,
  SectionTitle: styled(Typography)`
    font-size: 14px;
    font-weight: 700;
    line-height: 17px;
    letter-spacing: 0em;
    text-align: left;
    margin-bottom: 1rem;
    display: flex;

    @media (max-width: 800px) {
      margin-top: 2rem;
    }
  `,
  labelText: styled(Box)`
    margin-top: 5px;
    margin-right: 10px;
  `,

  StyledTextareaControl: styled(FormControl)`
    && {
      width: 100%;
    }
  `,
  StyledTextarea: styled(TextareaAutosize)`
    && {
      border: 1px solid #ccc;
      width: 55%;
      border-radius: 4px;
      max-width: 100%;
      padding: 10px;
      font-size: 0.8rem;
      line-height: 20px;
      color: ${(props) => (props.disabled ? "grey" : "black")};
    }
    &:focus {
      border: 1px solid #1187fc;
      outline: none;
    }
  `,
};
