import { styled } from "styled-components";
import { Box, MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";

const langs = {
  en: { nativeName: "English" },
  ta: { nativeName: "தமிழ்" },
};

const LanguageToggle = (props) => {
  const { i18n } = useTranslation();

  return (
    <Styled.Wrapper style={{ display: props.unlockPower }}>
      {/* <InputLabel id="toggle-language-selection"></InputLabel> */}
      <Styled.Select
        labelId="toggle-language"
        id="toggle-language-selection"
        value={i18n.resolvedLanguage}
        label="Language"
      >
        {Object.keys(langs).map((lang) => {
          return (
            <MenuItem
              key={lang}
              style={{
                fontWeight: i18n.resolvedLanguage === lang ? "bold" : "normal",
              }}
              type="submit"
              onClick={() => i18n.changeLanguage(lang)}
              value={lang}
            >
              {langs[lang]["nativeName"]}
            </MenuItem>
          );
        })}
      </Styled.Select>
    </Styled.Wrapper>
  );
};

export default LanguageToggle;

const Styled = {
  Wrapper: styled(Box)`
    height: 100%;
    width: 100px;
    display: grid;
    place-items: center;
  `,
  Select: styled(Select)`
    & {
      height: 1.6rem;
      padding: auto 0rem;
    }

    & .MuiSelect-select {
      font-size: 12px;
    }
  `,
};
