import { Styled } from "./TextField.style";

const initProps = {
  id: "",
  label: "",
  type: "",
  disable: "",
  // value: "",
};

export const GenericTextField = (props) => {
  return (
    <>
      <Styled.TextField {...initProps} {...props} />
    </>
  );
};
