import { Styled } from "./pageMeta.style";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { InitMenuState } from "src/Components/Navigation/InitMenuState";
// import stringSwapper from "src/utils/stringSwapper";

const PageMeta = () => {
  const { palette } = useTheme();
  const location = useLocation();

  const { t } = useTranslation();

  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    let findTitle = InitMenuState(t).find((e) =>
      e.path.includes(location.pathname.slice(1)),
    );
    setPageTitle(findTitle.name);
  }, [location.pathname]);

  // const pathNameHandler = (_path_) => {
  //   const path = `${_path_}`
  //     .split("-")
  //     .map((str) => (str ? stringSwapper(str) : "Home"))
  //     .map((str) => `${str[0].toLocaleUpperCase()}${str.slice(1)}`)
  //     .join(" ");

  //   return path;
  // };

  return (
    <Styled.Wrapper>
      <Styled.BreadCrumbsWrapper>
        <Styled.PageNameWrapper>
          <Styled.PageNameText color={palette.grey[900]}>
            {pageTitle}
          </Styled.PageNameText>
        </Styled.PageNameWrapper>

        <Styled.PageBreadCrumbsWrapper>
          <Styled.PageBreadCrumbsText color={palette.grey[600]}>
            {t("Common.Certificate Management Text")} &gt; {pageTitle}
          </Styled.PageBreadCrumbsText>
        </Styled.PageBreadCrumbsWrapper>
      </Styled.BreadCrumbsWrapper>
    </Styled.Wrapper>
  );
};

export default PageMeta;
