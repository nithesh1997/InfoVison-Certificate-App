import { Styled } from "./Notify.style";
import { CloseRounded } from "@mui/icons-material";
import { ActionButton } from "../ActionButton/ActionButton";

export default function Notify(props) {
  return (
    <Styled.Dialog
      open={props.isDisplay}
      onClose={props.closeHandler}
      aria-labelledby="notify-user-topic"
      aria-describedby="notify-user-message"
    >
      <Styled.HeaderBox>
        <Styled.Topic $type={props.type}>{props.topic}</Styled.Topic>

        <Styled.CloseButton onClick={props.closeHandler}>
          <CloseRounded />
        </Styled.CloseButton>
      </Styled.HeaderBox>

      <Styled.DialogContent>
        <Styled.Message id="notify-user-message">
          {props.message}
        </Styled.Message>
      </Styled.DialogContent>

      <Styled.DialogActions>
        {props.backdoor ? (
          <ActionButton
            onClick={props.closeHandler}
            backgroundColor="primary"
            buttonName={"Redirect"}
          />
        ) : null}
      </Styled.DialogActions>
    </Styled.Dialog>
  );
}
