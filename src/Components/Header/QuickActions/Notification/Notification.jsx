import { styled } from "styled-components";
import IconButton from "@mui/material/IconButton";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Box } from "@mui/material";

const Notification = (props) => {
  return (
    <Styled.Wrapper style={{ display: props.unlockPower }}>
      <Styled.IconButton aria-label="notification">
        <NotificationsNoneOutlinedIcon />
      </Styled.IconButton>
    </Styled.Wrapper>
  );
};

export default Notification;

const Styled = {
  Wrapper: styled(Box)`
    height: 100%;
    width: 54px;
    display: grid;
    place-items: center;
  `,
  IconButton: styled(IconButton)`
    width: 40px;
    height: 40px;
  `,
};
