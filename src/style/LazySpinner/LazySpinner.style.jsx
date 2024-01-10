import { Box } from "@mui/material";
import styled, { keyframes } from "styled-components";

const breatheAnimation = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0.1;
  }
`;

export const Styled = {
  Wrapper: styled(Box)`
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  `,
  Container: styled(Box)`
    position: relative;
    background-color: #ffffff;
    width: 160px;
    height: 160px;
    box-sizing: border-box;
    border-radius: 10%;
  `,
  Logoimg: styled.img`
    color: #ffffff;
    animation: rotate2 2s steps(2) 0s infinite;
    @keyframes rotate2 {
      0% {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(240deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `,
  Deg4: styled(Box)`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
    height: 160px;
  `,
  Fin: styled(Box)`
    width: 4%;
    height: 18%;
    background: rgb(32, 31, 31);
    position: absolute;
    left: 49%;
    top: 43%;
    opacity: 0;
    border-radius: 50px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
    animation: ${breatheAnimation} 1s linear infinite;
    transform: rotate(${({ style }) => style.degree}deg) translate(0, -130%);
    animation-delay: ${({ style }) => style.delay}s;
  `,
};
