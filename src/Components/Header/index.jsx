/* Components */
import Logo from "./Logo/Logo";
import QuickActions from "./QuickActions/QuickActions";

/* Style */
import { Styled } from "./header.style";

const Header = () => {
  return (
    <Styled.Wrapper>
      <Styled.Container>
        <Logo />

        <QuickActions />
      </Styled.Container>
    </Styled.Wrapper>
  );
};

export default Header;
