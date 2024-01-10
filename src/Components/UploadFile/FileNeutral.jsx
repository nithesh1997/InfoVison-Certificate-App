/* Style */
import { Styled } from "./UploadFile.style";

import { Trans, useTranslation } from "react-i18next";

/* SVG Icons */
import uploadIcon from "../../assets/light-mode/upload-icon.svg";
import CodeBlock from "src/style/CodeBlock";
import { useRef } from "react";
import CloudUploadMUI from "src/assets/light-mode/CloudUploadMUI";

export default function FileNeutral(props) {
  const fileInputRef = useRef(null);

  const { t } = useTranslation();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  return (
    <Styled.Container>
      {props.isDragActive ? (
        <Styled.DragContainer>
          <CloudUploadMUI />
          <p>{t("Common.Components.File Upload.Active Drop")}</p>
        </Styled.DragContainer>
      ) : (
        <>
          <Styled.IconContainer>
            <Styled.UploadIcon>
              <img src={uploadIcon} />
            </Styled.UploadIcon>
          </Styled.IconContainer>

          <Styled.InfoContainer>
            <Styled.InfoText>
              <Trans
                i18nKey={"Common.Components.File Upload.File Neutral.File Type"}
              >
                Drop the <CodeBlock>.csr</CodeBlock>
                <CodeBlock>.txt</CodeBlock> file
              </Trans>
            </Styled.InfoText>

            <Styled.InfoText>
              {t("Common.Components.File Upload.File Neutral.Size Limit")}
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
                  "Common.Components.File Upload.Button Text.Select File Text",
                )}
              </label>
            </Styled.ActionButton>
          </Styled.ActionButtonContainer>
        </>
      )}
    </Styled.Container>
  );
}
