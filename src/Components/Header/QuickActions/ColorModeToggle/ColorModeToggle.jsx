import { useSelector, useDispatch } from "react-redux";
import { styled } from "styled-components";
import { Box } from "@mui/material";
import { toggle } from "./colorModeToggleSlice";

const ColorModeToggle = (props) => {
  const colorModeStore = useSelector((store) => store.colorMode);
  const dispatch = useDispatch();

  const handleChange = () => {
    dispatch(toggle());
  };

  return (
    <Styled.Wrapper style={{ display: props.unlockPower }}>
      <button onClick={handleChange}>{colorModeStore}</button>
    </Styled.Wrapper>
  );
};

export default ColorModeToggle;

const Styled = {
  Wrapper: styled(Box)`
    height: 100%;
    width: 54px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  `,
};
