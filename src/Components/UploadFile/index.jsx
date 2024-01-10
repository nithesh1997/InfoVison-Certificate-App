import * as React from "react";

/* Styles */
import { Styled } from "./UploadFile.style";
import { useDropzone } from "react-dropzone";

/* Icons */
import { Box, useTheme } from "@mui/material";

/* Components */
import FileSizeError from "./FileSizeError";
import FileNeutral from "./FileNeutral";
import FileFormatError from "./FileFormatError";

/* Utilities */
import getExtension from "src/utils/getExtension";
import FileOkDetails from "./FileOkDetails";
import MultiFileError from "./MultiFileError";

const supportedExtensions = ["csr", "txt"];

const extractFilename = (name) => {
  const filename = name.split(".");
  return filename.slice(0, filename.length - 1).join(".");
};

const initFileState = () => {
  return {
    file: {},
    isDisabled: false,
    isError: "",
    helperText: "",
  };
};

const initStageState = () => {
  return "";
};

const UploadFile = (props) => {
  const { palette } = useTheme();

  const { flag, setFlag } = props.flagState;
  const { fileState, setFileState } = props.fileManage;
  const { stageState, setStageState } = props.stage;
  const { filenameState, setFilenameState } = props.filename;
  const { disableBtn } = props;

  const onDrop = React.useCallback((acceptedFiles) => {
    if (acceptedFiles.length == 1) {
      const choosenFilesData = {
        target: {
          files: acceptedFiles,
        },
      };

      uploadHandler(choosenFilesData);
    } else {
      setStageState("multi-file-error");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  const uploadHandler = (event) => {
    const file = event.target.files[0];
    const extension = getExtension(file.name);

    if (event.target.files.length) {
      setFileState((oldState) => ({
        ...oldState,
        file,
      }));

      setFilenameState(extractFilename(file.name));
    }

    if (!(supportedExtensions.indexOf(extension) !== -1)) {
      setStageState("file-format-error");
    } else if (file.size > 62914560) {
      setStageState("file-size-error");
    } else {
      setStageState("file-ok");
    }
  };

  React.useEffect(() => {
    if (flag) {
      setFileState(initFileState);
      setStageState(initStageState);
      setFilenameState("");
      setFlag(false);
    }
  }, [flag, setFileState, setFilenameState, setFlag, setStageState]);

  return (
    <Box {...getRootProps()}>
      <Styled.Wrapper drag={isDragActive}>
        {stageState === "file-ok" ? (
          <FileOkDetails
            FilenameState={filenameState}
            palette={palette}
            fileState={fileState}
            supportedExtensions={supportedExtensions}
            uploadHandler={uploadHandler}
            stageState={stageState}
            disableBtn={disableBtn}
          />
        ) : stageState === "file-format-error" ? (
          <FileFormatError
            palette={palette}
            fileState={fileState}
            supportedExtensions={supportedExtensions}
            uploadHandler={uploadHandler}
            stageState={stageState}
          />
        ) : stageState === "multi-file-error" ? (
          <MultiFileError
            palette={palette}
            fileState={fileState}
            supportedExtensions={supportedExtensions}
            uploadHandler={uploadHandler}
            stageState={stageState}
            isDragActive={isDragActive}
          />
        ) : stageState === "file-size-error" ? (
          <FileSizeError
            palette={palette}
            fileState={fileState}
            supportedExtensions={supportedExtensions}
            uploadHandler={uploadHandler}
            stageState={stageState}
          />
        ) : (
          <FileNeutral
            palette={palette}
            fileState={fileState}
            supportedExtensions={supportedExtensions}
            uploadHandler={uploadHandler}
            stageState={stageState}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
          />
        )}
      </Styled.Wrapper>
    </Box>
  );
};

export default UploadFile;
