import { Styled } from "./pageContent.style";

const PageContent = (props) => {
  return <Styled.Wrapper>{props.children}</Styled.Wrapper>;
};

export default PageContent;
