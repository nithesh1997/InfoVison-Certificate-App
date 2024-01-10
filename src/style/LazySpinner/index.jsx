import { Styled } from "./LazySpinner.style";
import spinnerLogo from "assets/light-mode/spinner_logo.svg";

function LazySpinner() {
  return (
    <Styled.Wrapper>
      <Styled.Container>
        <Styled.Deg4>
          <Styled.Logoimg src={spinnerLogo} height={74} alt={"InvisiNet"} />
        </Styled.Deg4>
      </Styled.Container>

      {/* <Styled.Container>   
        <Styled.Fin style={{ degree: 0, delay: 0 }} />
        <Styled.Fin style={{ degree: 30, delay: -0.9167 }} />
        <Styled.Fin style={{ degree: 60, delay: -0.833 }} />
        <Styled.Fin style={{ degree: 90, delay: -0.7497 }} />
        <Styled.Fin style={{ degree: 120, delay: -0.667 }} />
        <Styled.Fin style={{ degree: 150, delay: -0.5837 }} />
        <Styled.Fin style={{ degree: 180, delay: -0.5 }} />
        <Styled.Fin style={{ degree: 210, delay: -0.4167 }} />
        <Styled.Fin style={{ degree: 240, delay: -0.333 }} />
        <Styled.Fin style={{ degree: 270, delay: -0.2497 }} />
        <Styled.Fin style={{ degree: 300, delay: -0.167 }} />
        <Styled.Fin style={{ degree: 330, delay: -0.0833 }} />
      </Styled.Container> */}
    </Styled.Wrapper>
  );
}

export default LazySpinner;
