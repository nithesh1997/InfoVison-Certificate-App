import { styled } from "styled-components";

function NavLogoSVG({ imageLogo }) {
  return <Styled.SVGImage src={imageLogo} height={"21px"} width={"21px"} />;
}

export default NavLogoSVG;

const Styled = {
  SVGImage: styled("img")`
    width: 1.4rem;
    height: 1.4rem;
    stroke: #eee;
  `,
};
