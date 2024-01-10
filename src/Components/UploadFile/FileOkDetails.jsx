/* Style */
import { Styled } from "./UploadFile.style";

import { Trans, useTranslation } from "react-i18next";

/* SVG Icons */
import zipIcon from "assets/light-mode/zip-icon-import-file.svg";
import { useRef } from "react";
import formatFileSize from "src/utils/formatFileSize";
import getExtension from "src/utils/getExtension";

function FileOkDetails(props) {
  const fileInputRef = useRef(null);
  const { disableBtn } = props;

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
        <Styled.InfoText
          color={props.palette.success.main}
          style={{ fontSize: "0.95rem", fontFamily: "Fira Code Variable" }}
        >
          <Trans
            i18nKey={
              "Common.Components.File Upload.File Ok Details.File Info Text"
            }
          >
            The {{ fileName: props.FilenameState }}.
            {{ extention: getExtension(props.fileState.file.name) }} is Selected
          </Trans>
        </Styled.InfoText>

        <Styled.InfoText
          style={{ fontSize: "0.9rem", fontFamily: "Fira Code Variable" }}
        >
          <Trans
            i18nKey={
              "Common.Components.File Upload.File Ok Details.File Size Text"
            }
          >
            File Size :{" "}
            {{ fileSize: formatFileSize(props.fileState.file.size) }}
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
          disabled={disableBtn}
          onClick={handleButtonClick}
        >
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

export default FileOkDetails;
