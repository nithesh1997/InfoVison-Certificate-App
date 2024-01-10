/* Style */
import { Styled } from "./UploadFile.style";

import { Trans, useTranslation } from "react-i18next";

/* SVG Icons */
import zipIcon from "../../assets/light-mode/zip-icon-import-file.svg";
import CodeBlock from "src/style/CodeBlock";
import getExtension from "src/utils/getExtension";
import { useRef } from "react";

export default function FileFormatError(props) {
  const fileInputRef = useRef(null);

  const { t } = useTranslation();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  return (
    <Styled.Container style={{ width: "320px" }}>
      <Styled.IconContainer>
        <Styled.UploadIcon>
          <img src={zipIcon} />
        </Styled.UploadIcon>
      </Styled.IconContainer>

      <Styled.InfoContainer>
        <Styled.InfoText color={props.palette.error.main}>
          <Trans
            i18nKey={
              "Common.Components.File Upload.File Format Error.File Info Text"
            }
          >
            The file format
            <CodeBlock>
              .{{ error: getExtension(props.fileState.file.name) }}
            </CodeBlock>{" "}
            is not allowed!
          </Trans>
        </Styled.InfoText>

        <Styled.InfoText
          style={{ fontSize: "0.8rem", fontFamily: "Fira Code Variable" }}
        >
          <Trans
            i18nKey={
              "Common.Components.File Upload.File Format Error.File Extention Text"
            }
          >
            Expected Format: <CodeBlock>.csr</CodeBlock>
          </Trans>{" "}
          or <CodeBlock>.txt</CodeBlock>
        </Styled.InfoText>
      </Styled.InfoContainer>

      <Styled.ActionButtonContainer>
        <input
          id="contained-button"
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          accept={props.supportedExtensions}
          onChange={props.uploadHandler}
        />

        <Styled.ActionButton variant="contained" onClick={handleButtonClick}>
          <label style={{ cursor: "pointer" }}>
            {t(
              "Common.Components.File Upload.Button Text.Select Different File Text",
            )}
          </label>
        </Styled.ActionButton>
      </Styled.ActionButtonContainer>
    </Styled.Container>
  );
}
