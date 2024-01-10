import { styled } from "styled-components";

const CodeBlock = ({ children, ...props }) => {
  return <Styled.Code {...props}>{children}</Styled.Code>;
};

export default CodeBlock;

const Styled = {
  Code: styled("code")`
    background: #bfbfbf30;
    color: #404040;
    font-family: "Fira Code Variable";
    font-size: 12px;
  `,
};
