import { IconButton, InputAdornment } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import UploadFile from "src/Components/UploadFile";
import { GenericTextField } from "src/style/TextField/TextField";
import { Styled } from "src/style/FormStyling/Form.style";
import { ActionButton } from "src/style/ActionButton/ActionButton";
import { useState } from "react";
import axios from "axios";
import TooltipIconArrow from "src/style/TextField/TooltipIconArrow";
import Notify from "src/style/Notify";

const initNotifyState = { isDisplay: false, type: "", topic: "", message: "" };

const TrustLevel = () => {
  const [customer, setCustomer] = useState("");
  const [customerNameError, setIsCustomerNameError] = useState(false);
  const [customerNameHelperText, setCustomerNameHelperText] = useState("");

  const [fqdn, setFqdn] = useState("");
  const [isFqdnError, setIsFqdnError] = useState(false);
  const [fqdnHelperText, setFqdnHelperText] = useState("");

  // file uploading State
  const [fileState, setFileState] = useState({
    file: {},
    isDisabled: false,
    isError: "",
    helperText: "",
  });
  const [stageState, setStageState] = useState("");

  const [isFilenameDisabled, setIsFilenameDisabled] = useState(true);
  const [isEditFilename, setIsEditFilename] = useState(false);
  const [filenameState, setFilenameState] = useState("");

  const [flag, setFlag] = useState(false);
  const [notifyState, setNotifyState] = useState(initNotifyState);

  const closeNotifyHandler = () => {
    setNotifyState(initNotifyState);
  };

  const customerNameBlurHandler = (event) => {
    validateCustomerName(event.target.value);
  };

  const validateCustomerName = (value) => {
    const validateName = value.trim();
    const regexName = new RegExp(/^[A-Za-z]+$/);
    const regexFullname = new RegExp(/^[A-Za-z]+\s[A-Za-z ]+$/);
    const regexTestName = !regexName.test(validateName);
    const regexTestFullname = !regexFullname.test(validateName);

    if (validateName.length < 1) {
      setIsCustomerNameError(true);
      setCustomerNameHelperText("Customer name is a mandatory field");
      return true;
    } else if (regexTestName && regexTestFullname) {
      setIsCustomerNameError(true);
      setCustomerNameHelperText(
        "Customer name accepts Alphanumeric characters only",
      );
      return true;
    } else {
      setIsCustomerNameError(false);
      setCustomerNameHelperText("");
      return false;
    }
  };

  const validatefqdn = (value) => {
    const FQDN_PATTERN = new RegExp(
      /^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*(?:\.[a-zA-Z]{2,6})$/,
    );

    const regexTestFqdn = !FQDN_PATTERN.test(value.trim());

    if (value.length < 1) {
      setIsFqdnError(true);
      setFqdnHelperText(" FQDN is a mandatory field");
      return true;
    } else if (regexTestFqdn) {
      setIsFqdnError(true);
      setFqdnHelperText(
        "Plese enter a valid FQDN (Fully Qualified Domain Name)",
      );
    } else {
      setIsFqdnError(false);
      setFqdnHelperText("");
      return false;
    }
  };

  const fqdnBlurHandler = (event) => {
    validatefqdn(event.target.value);
  };

  function sumbitHandler() {
    if (!customerNameError && !isFqdnError && fileState.file.name) {
      axios({
        method: "post",
        url: `${window.location.origin}/certificate/download/trustlevel`,
        data: {
          customerName: customer,
          fqdn: fqdn,
          csr: {
            name: fileState.file.name,
            lastModified: fileState.file.lastModified,
            size: fileState.file.size,
          },
        },
      })
        .then(({ data }) => data)
        .catch((error) => {
          const payloadBuffer = String.fromCharCode.apply(
            null,
            new Uint8Array(error.response?.data ?? {}),
          );
          const payload = JSON.parse(payloadBuffer || "{}");

          setNotifyState({
            isDisplay: true,
            type: "error",
            topic: payload.error ?? `Error ${error.statusCode ?? "In App"}`,
            message: payload.message ?? error.message,
          });
        });
    } else {
      alert("🚨 - Please fill all the fields");
    }
  }

  function resetHandler() {
    setFlag(true);

    // coustomer input reset
    setCustomer("");
    setIsCustomerNameError(false);
    setCustomerNameHelperText("");

    // fqdn input reset
    setFqdn("");
    setIsFqdnError(false);
    setFqdnHelperText("");
  }

  return (
    <Styled.Wrapper>
      <Styled.FormWrapper>
        <GenericTextField
          variant="outlined"
          id="customer-name"
          name="customer-name"
          label="Customer Name"
          onFocus={() => {
            setCustomerNameHelperText("");
            setIsCustomerNameError(false);
          }}
          error={customerNameError}
          helperText={customerNameHelperText}
          onBlur={customerNameBlurHandler}
          // label="Customer Name"
          value={customer}
          onChange={(e) => {
            setCustomer(e.target.value);
          }}
          required
          fullWidth
          InputProps={{
            sx: { height: 50 },
            endAdornment: (
              <InputAdornment position="end">
                <TooltipIconArrow textContent="Do not add any spaces. The tool will not break and your certificate will be generated but not displayed to you.">
                  <IconButton>
                    <InfoOutlinedIcon size={"0.6em"} />
                  </IconButton>
                </TooltipIconArrow>
              </InputAdornment>
            ),
          }}
        />

        <GenericTextField
          variant="outlined"
          id="fqdn"
          name="fqdn"
          label="Fully Qualified Domain Name"
          required
          fullWidth
          onChange={(e) => setFqdn(e.target.value)}
          onBlur={fqdnBlurHandler}
          error={isFqdnError}
          helperText={fqdnHelperText}
          onFocus={() => {
            setFqdnHelperText("");
            setIsFqdnError(false);
          }}
          value={fqdn}
          InputProps={{
            sx: { height: 50 },
            endAdornment: (
              <InputAdornment position="end">
                <TooltipIconArrow textContent="If there is no FQDN just add hostname.customer here.">
                  <IconButton>
                    <InfoOutlinedIcon size={"0.6em"} />
                  </IconButton>
                </TooltipIconArrow>
              </InputAdornment>
            ),
          }}
        />
      </Styled.FormWrapper>
      <Styled.SectionTitle>Import CSR or Text File</Styled.SectionTitle>
      <UploadFile
        flagState={{ flag, setFlag }}
        fileManage={{ fileState, setFileState }}
        stage={{ stageState, setStageState }}
        filenameDisabledState={{ isFilenameDisabled, setIsFilenameDisabled }}
        editFilenameState={{ isEditFilename, setIsEditFilename }}
        filename={{ filenameState, setFilenameState }}
      />
      <Styled.ButtonContainer>
        <ActionButton
          variant="outlined"
          backgroundColor=""
          buttonName="Reset"
          disabled={false}
          onClick={resetHandler}
        />
        <ActionButton
          variant="contained"
          backgroundColor="primary"
          buttonName="Submit"
          disabled={customer && fqdn && fileState.file.name ? false : true}
          onClick={sumbitHandler}
        />
      </Styled.ButtonContainer>

      <Notify {...notifyState} closeHandler={closeNotifyHandler} />
    </Styled.Wrapper>
  );
};

export default TrustLevel;
