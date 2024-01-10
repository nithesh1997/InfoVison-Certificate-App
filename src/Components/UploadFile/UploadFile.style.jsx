import { Box, Button, Typography } from "@mui/material";
import { styled } from "styled-components";

export const Styled = {
  Wrapper: styled(Box)`
    width: 100%;
    height: 20rem;
    border: 3px;
    border-radius: 0.5em;
    border-style: dotted;
    border-color: ${(props) => (props.drag ? "#5C76B7" : "#eee")};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;
    word-break: break-all;
    margin: 0.5em auto;
    overflow: hidden;
    /* background: #ffa4c2; */
  `,
  Container: styled(Box)`
    width: 320px;
    height: 95%;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    background: #88888810;
  `,
  DragContainer: styled("div")`
    text-align: center;
    color: #ccc;
    font-weight: 600;
    padding: 10px;
    opacity: 0.6;
  `,
  IconContainer: styled(Box)`
    width: 100%;
    height: 6rem;
    display: grid;
    margin: -1.5rem 0;
    place-items: center;
    /* background: #ffd7e4; */
    /* background:red; */
  `,
  UploadIcon: styled(Box)`
    width: 4.2rem;
    height: 4.2rem;
    border-radius: 50%;
    display: grid;
    place-items: center;
  `,
  InfoContainer: styled(Box)`
    width: 100%;
    height: 6rem;
    display: grid;
    place-items: center;
    /* background: #fff0f5; */
  `,
  InfoText: styled(Typography)`
    font-weight: 600;
  `,
  ActionButtonContainer: styled(Box)`
    width: 100%;
    height: max-content;
    display: grid;
    place-items: center;
    padding: 0.1rem 0rem;
    /* background: #ffffff; */
  `,
  ActionButton: styled(Button)`
    text-transform: capitalize;
  `,
};
