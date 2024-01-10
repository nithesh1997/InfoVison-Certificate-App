/* Style */
import { Styled } from "./UploadFile.style";

import { Trans, useTranslation } from "react-i18next";

/* SVG Icons */
import zipIcon from "assets/light-mode/zip-icon-import-file.svg";
import { useRef } from "react";
import formatFileSize from "src/utils/formatFileSize";

export default function FileSizeError(props) {
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
          {t("Common.Components.File Upload.File Size Error.File Info Text")}
        </Styled.InfoText>

        <Styled.InfoText
          style={{ fontSize: "0.8rem", fontFamily: "Fira Code Variable" }}
        >
          <Trans
            i18nKey={
              "Common.Components.File Upload.File Size Error.Upload File Size"
            }
          >
            Uploaded File Size:{" "}
            {{ fileSize: formatFileSize(props.fileState.file.size) }}
          </Trans>
        </Styled.InfoText>

        <Styled.InfoText
          style={{ fontSize: "0.8rem", fontFamily: "Fira Code Variable" }}
        >
          {t("Common.Components.File Upload.File Size Error.Size Limit")}
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
          <label style={{ cursor: "pointer" }}>Select Different File</label>
        </Styled.ActionButton>
      </Styled.ActionButtonContainer>
    </Styled.Container>
  );
}
