import ErrorLogo from "src/assets/light-mode/404-not-found-icon.svg";
import { Styled } from "./Error.style";

function Common({ error, t }) {
  return (
    <div>
      <Styled.Container component={"section"}>
        <Styled.Images>
          <Styled.ErrorLogo src={ErrorLogo} width={"95"} alt={"Error"} />
        </Styled.Images>

        <Styled.CrashPageErrorText>
          {t("Pages.Error Page.Error Boundary.Head")}
        </Styled.CrashPageErrorText>

        <Styled.CrashPageErrorDescription>
          {t("Pages.Error Page.Error Boundary.Content.Message Para")}
        </Styled.CrashPageErrorDescription>

        <Styled.CrashPageErrorDescription>
          {t("Pages.Error Page.Error Boundary.Content.Contact Support")}
        </Styled.CrashPageErrorDescription>

        <Styled.StyledButton
          onClick={() => window.open("mailto:support@invisinet.com")}
        >
          {t("Pages.Error Page.Support Btn")}
        </Styled.StyledButton>
      </Styled.Container>
    </div>
  );
}

export default Common;
