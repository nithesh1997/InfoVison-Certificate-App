import { Styled } from "./quickActions.style";
// import ColorModeToggle from "./ColorModeToggle/ColorModeToggle";
// import LanguageToggle from "./LanguageToggle/LanguageToggle";
// import Notification from "./Notification/Notification";
import Profile from "./Profile/Profile";

const QuickActions = () => {
  return (
    <Styled.Wrapper>
      {/* <ColorModeToggle /> */}
      {/* <LanguageToggle /> */}
      {/* <Notification /> */}

      <Profile />
    </Styled.Wrapper>
  );
};

export default QuickActions;
