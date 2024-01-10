/* Styles */
import { Styled } from "./UploadFile.style";
import { Box, Button, IconButton, InputAdornment } from "@mui/material";
import { GenericTextField } from "src/style/TextField/TextField";

/* Icons */
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

/* Utilities */
import getExtension from "src/utils/getExtension";

export default function FileOk(props) {
  const [isFilenameDisabled, setIsFilenameDisabled] = props.IsFilenameDisabled;
  const [isEditFileName, setIsEditFileName] = props.IsEditFilename;
  const [filenameState, setFilenameState] = props.FilenameState;

  const handleClickToggleEdit = () => {
    setIsEditFileName((oldState) => !oldState);
    setIsFilenameDisabled((oldState) => !oldState);
  };

  const handleClickToggleCancel = () => {
    setIsEditFileName((oldState) => !oldState);
    setIsFilenameDisabled((oldState) => !oldState);
    setFilenameState(() => {
      const filename = props.fileState.file.name.split(".");

      return filename.slice(0, filename.length - 1).join(".");
    });
  };

  const handleFilenameChange = (event) => {
    setFilenameState(event.target.value);
  };

  const handleBlur = () => {};

  const handleFocus = () => {};

  return (
    <Styled.Container style={{ padding: "1rem" }}>
      <GenericTextField
        fullWidth
        label="Filename"
        helperText=""
        disabled={isFilenameDisabled}
        value={filenameState}
        onChange={handleFilenameChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {isEditFileName ? (
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "4rem",
                  }}
                >
                  <IconButton
                    aria-label="toggle edit icon"
                    onClick={handleClickToggleEdit}
                    edge="end"
                    size="small"
                  >
                    <DoneOutlinedIcon />
                  </IconButton>

                  <IconButton
                    aria-label="toggle edit icon"
                    onClick={handleClickToggleCancel}
                    edge="end"
                    size="small"
                  >
                    <CancelOutlined />
                  </IconButton>
                </Box>
              ) : (
                <IconButton
                  aria-label="toggle edit icon"
                  onClick={handleClickToggleEdit}
                  edge="end"
                >
                  <EditOutlinedIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />

      <GenericTextField
        fullWidth
        label="Extension"
        helperText=""
        disabled
        value={`.${getExtension(props.fileState.file.name)}`}
      />

      <Button variant="outlined" onClick={() => props.setStageState("")}>
        Go Back
      </Button>
    </Styled.Container>
  );
}
