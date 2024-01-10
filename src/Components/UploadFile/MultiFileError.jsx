/* Style */
import { Styled } from "./UploadFile.style";

import { Trans, useTranslation } from "react-i18next";

/* SVG Icons */
import zipIcon from "../../assets/light-mode/zip-icon-import-file.svg";
import CodeBlock from "src/style/CodeBlock";
import { useRef } from "react";
import CloudUploadMUI from "src/assets/light-mode/CloudUploadMUI";
import getExtension from "src/utils/getExtension";

export default function MultiFileError(props) {
  const fileInputRef = useRef(null);

  const { t } = useTranslation();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  return (
    <Styled.Container style={{ width: "320px" }}>
      {props.isDragActive ? (
        <Styled.DragContainer>
          <CloudUploadMUI />
          <p>
            {t("Common.Components.File Upload.Multi File Error.Drop File Text")}
          </p>
        </Styled.DragContainer>
      ) : (
        <>
          <Styled.IconContainer>
            <Styled.UploadIcon>
              <img src={zipIcon} />
            </Styled.UploadIcon>
          </Styled.IconContainer>

          <Styled.InfoContainer>
            <Styled.InfoText color={props.palette.error.main}>
              {t(
                "Common.Components.File Upload.Multi File Error.Multi File Not Allow",
              )}
            </Styled.InfoText>

            <Styled.InfoText
              style={{ fontSize: "0.8rem", fontFamily: "Fira Code Variable" }}
            >
              {/* Single File with <CodeBlock>.csr</CodeBlock> or{" "}
              <CodeBlock>.txt</CodeBlock> Format */}
              <Trans
                i18nKey={
                  "Common.Components.File Upload.Multi File Error.Single File Type"
                }
              >
                {/* Single File with <CodeBlock>.csr</CodeBlock> <CodeBlock>.txt</CodeBlock> Format */}
                Single File with <CodeBlock>.csr</CodeBlock>
                <CodeBlock>.txt</CodeBlock> Format
              </Trans>
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

            <Styled.ActionButton
              variant="contained"
              onClick={handleButtonClick}
            >
              <label style={{ cursor: "pointer" }}>
                {t(
                  "Common.Components.File Upload.Button Text.Select Different File Text",
                )}
              </label>
            </Styled.ActionButton>
          </Styled.ActionButtonContainer>
        </>
      )}
    </Styled.Container>
  );
}
