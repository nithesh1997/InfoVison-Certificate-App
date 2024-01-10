import { Styled } from "./ActionButton.style";

const initProps = {
  variant: "contained",
  //disabled: true,
  // onClick: () => alert("The Button Action is not configured..!"),
};

export const ActionButton = ({ buttonName, backgroundColor, ...props }) => {
  return (
    <>
      <Styled.ActionButton
        backgroundColor={backgroundColor}
        buttonName={buttonName}
        {...initProps}
        {...props}
        style={{ width: props.width ? props.width : "98" }}
      >
        {buttonName || "Action Button"}
      </Styled.ActionButton>
    </>
  );
};
