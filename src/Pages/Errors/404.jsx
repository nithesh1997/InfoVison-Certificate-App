import ErrorLogo from "src/assets/light-mode/404-not-found-icon.svg";
import { Styled } from "./Error.style";

function Error404({ error, t }) {
  return (
    <div>
      <Styled.Container component={"section"}>
        <Styled.Images>
          <Styled.ErrorLogo src={ErrorLogo} width={"180"} alt={"Error"} />
        </Styled.Images>

        <Styled.Number>
          {error.status} {error.statusText || error.message}
        </Styled.Number>

        <Styled.ErrorText>
          {t("Pages.Error Page.Error 404.Title")}
        </Styled.ErrorText>

        <Styled.StyledButton
          onClick={() => window.open("mailto:support@invisinet.com")}
        >
          {t("Pages.Error Page.Support Btn")}
        </Styled.StyledButton>
      </Styled.Container>
    </div>
  );
}

export default Error404;
