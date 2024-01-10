import React from "react";
import { IconCircle } from "./IconCircle";
import { StyledCard } from "./Card.style";
import { StyledTypography } from "./Card.style";
import { styled } from "styled-components";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

export const Card = ({ label, translationMap, ...props }) => {
  const { t } = useTranslation();
  const rippleRef = React.useRef(null);

  const handleRippleStart = (event) => {
    rippleRef.current?.start(event);
  };

  const handleRippleStop = (event) => {
    rippleRef.current?.stop(event);
  };

  return (
    <StyledCard onMouseDown={handleRippleStart} onMouseUp={handleRippleStop}>
      <Styled.Container>
        <IconCircle>{props.children}</IconCircle>

        <StyledTypography variant="p">
          {(t(translationMap) ?? label) || "Action Button"}
        </StyledTypography>
      </Styled.Container>
    </StyledCard>
  );
};

const Styled = {
  Container: styled(Box)`
    display: flex;
    height: 80%;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding-top: 9.1%;
  `,
};
