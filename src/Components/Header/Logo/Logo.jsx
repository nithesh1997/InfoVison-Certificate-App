import { useNavigate } from "react-router-dom";
import { Styled } from "./logo.style";
import BrandIconText from "assets/light-mode/brand-logo-icon-text.svg";

const Logo = () => {
  const navigate = useNavigate();

  return (
    <Styled.Wrapper disableRipple onClick={() => navigate("/")}>
      <img style={{ width: "160px" }} src={BrandIconText} />
    </Styled.Wrapper>
  );
};

export default Logo;
