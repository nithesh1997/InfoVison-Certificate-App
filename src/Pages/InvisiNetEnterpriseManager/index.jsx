import { useSelector } from "react-redux";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import UploadFile from "src/Components/UploadFile";
import { Styled } from "src/style/FormStyling/Form.style";
import { ActionButton } from "src/style/ActionButton/ActionButton";
import { useCallback, useState } from "react";
import TooltipIconArrow from "src/style/TextField/TooltipIconArrow";
import axios from "axios";
import downloadFile from "src/utils/downloadFile";
import Notify from "src/style/Notify";
import { StyledSpinner } from "src/style/ButtonLoading/index.style";
import CustomizedSwitches from "src/Pages/Common/SwitchToggle";
import { Trans, useTranslation } from "react-i18next";
/* Forms */
import * as regex from "utils/RegularExpressions";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const initNotifyState = { isDisplay: false, type: "", topic: "", message: "" };
const initFileState = {
  file: {},
  isDisabled: false,
  isError: "",
  helperText: "",
};

const InvisiNetEnterpriseManager = () => {
  const [loading, setLoading] = useState(false);
  const [notifyState, setNotifyState] = useState(initNotifyState);
  const [flag, setFlag] = useState(false);

  const [fileState, setFileState] = useState(initFileState);
  const [stageState, setStageState] = useState("");

  const [isFilenameDisabled, setIsFilenameDisabled] = useState(true);
  const [isEditFilename, setIsEditFilename] = useState(false);
  const [filenameState, setFilenameState] = useState("");

  const [selectedOption, setSelectedOption] = useState("file");
  const [textareaValue, setTextareaValue] = useState("");

  const [clientFqdnState, setClientFqdnState] = useState("");

  const [disabled, setDisabled] = useState(false);

  const { t } = useTranslation();
  const CAConfigurationType = useSelector(
    ({ CAConfigurationType }) => CAConfigurationType,
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isValid, touchedFields },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    context: { CAConfigurationType },
    resolver: yupResolver(
      Yup.object().shape({
        customerName: Yup.string()
          .trim()
          .required(
            t("Common.Fields.Customer Name.Validations.Errors.Mandatory"),
          )
          .min(
            4,
            t(
              "Common.Fields.Customer Name.Validations.Errors.Must Atleast Character",
            ),
          )
          .max(
            64,
            t(
              "Common.Fields.Customer Name.Validations.Errors.Must Not Exceed Character",
            ),
          )
          .matches(
            regex.username,
            t(
              "Common.Fields.Customer Name.Validations.Errors.Alaphanumeric Character",
            ),
          ),
        clientFqdn: Yup.string().when(
          "$CAConfigurationType",
          ([CAConfigurationType], schema) => {
            CAConfigurationType === "Windows CA"
              ? schema.optional()
              : schema
                  .trim()
                  .required(
                    t("Common.Fields.Client Fqdn.Validations.Errors.Mandatory"),
                  )
                  .matches(
                    regex.FQDN,
                    t("Common.Fields.Client Fqdn.Validations.Errors.Invalid"),
                  );
          },
        ),
      }),
    ),
  });

  const closeNotifyHandler = () => {
    setNotifyState(initNotifyState);
  };

  const handleFormSubmit = (data) => {
    setLoading(true);
    setDisabled(true);

    const formData = new FormData();
    const textareaFile = new File([textareaValue], "certificate.csr", {
      type: "text/plain",
    });
    const finalCSRData =
      selectedOption === "file" ? fileState.file : textareaFile;

    formData.append("csr", finalCSRData);
    const certRequestPayload = {
      customerName: data.customerName,
      clientFqdn: data.clientFqdn,
    };

    if (CAConfigurationType === "Windows CA") {
      delete certRequestPayload.clientFqdn;
    }

    formData.append("certRequest", JSON.stringify(certRequestPayload));

    axios({
      method: "post",
      url: "/iem/certificate/download",
      data: formData,
      responseType: "arraybuffer",
    })
      .then((response) => {
        setLoading(false);
        setDisabled(false);
        resetFields();
        downloadFile(response);
      })
      .catch((error) => {
        setLoading(false);
        setDisabled(false);
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
  };

  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value);
  };

  const resetFields = useCallback(() => {
    setTextareaValue("");
    setFlag(true);
    reset();
  }, [reset]);

  const handleOnBlur = () => {
    if (!touchedFields?.clientFqdn) {
      let customerNameValue = getValues("customerName");
      if (
        customerNameValue.length > 3 &&
        customerNameValue.length < 65 &&
        regex.username.test(customerNameValue)
      ) {
        const clientFqdnData = getValues("customerName")?.trim().toLowerCase();
        const defaultClientFqdn = clientFqdnData
          ? `${clientFqdnData}.invisinet.com`
          : ``;
        setValue("clientFqdn", defaultClientFqdn);
        setClientFqdnState(defaultClientFqdn);
      }
    }
  };

  const isShrink =
    clientFqdnState && getValues("clientFqdn") ? { shrink: true } : {};

  return (
    <Styled.Wrapper>
      <form>
        <Styled.FormWrapper>
          <Controller
            control={control}
            name="customerName"
            render={({ field }) => (
              <TextField
                required
                {...field}
                defaultValue={""}
                disabled={disabled}
                variant="outlined"
                fullWidth
                id="customerName"
                name="customerName"
                label={t("Common.Fields.Customer Name.Title")}
                {...register("customerName")}
                error={errors.customerName?.message ?? null}
                helperText={errors.customerName?.message ?? null}
                onBlur={(e) => {
                  field.onBlur(e);
                  handleOnBlur();
                }}
                InputProps={{
                  sx: { height: 50 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <TooltipIconArrow
                        textContent={t("Common.Fields.Customer Name.Tool Tip")}
                      >
                        <IconButton>
                          <InfoOutlinedIcon size={"0.6em"} />
                        </IconButton>
                      </TooltipIconArrow>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {CAConfigurationType !== "Windows CA" ? (
            <Controller
              control={control}
              name="clientFqdn"
              render={({ field }) => (
                <TextField
                  {...field}
                  InputLabelProps={isShrink}
                  {...register("clientFqdn")}
                  defaultValue={""}
                  disabled={disabled}
                  id="client-fqdn"
                  name="clientFqdn"
                  label={t("Common.Fields.Client Fqdn.Title")}
                  required
                  fullWidth
                  variant="outlined"
                  error={!!errors.clientFqdn}
                  helperText={errors.clientFqdn?.message}
                  InputProps={{
                    sx: { height: 50 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <TooltipIconArrow
                          textContent={
                            <>
                              <p>
                                {t("Common.Fields.Client Fqdn.Tool Tip.Title")}
                              </p>

                              <ul style={{ paddingLeft: "1rem" }}>
                                <li style={{ margin: "0.2rem 0" }}>
                                  <Trans
                                    i18nKey={
                                      "Common.Fields.Client Fqdn.Tool Tip.List.Fqdn Example"
                                    }
                                    components={[
                                      <b key={"b"} />,
                                      <code key={"code"} />,
                                    ]}
                                  >
                                    Valid Fully Qualified Domain Name{" "}
                                    <b>(FQDN)</b> such as{" "}
                                    <code>invisinet.client-name.com</code>.
                                  </Trans>
                                </li>
                              </ul>
                            </>
                          }
                        >
                          <IconButton>
                            <InfoOutlinedIcon size={"0.6em"} />
                          </IconButton>
                        </TooltipIconArrow>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          ) : null}
        </Styled.FormWrapper>

        <Styled.SectionTitle>
          <Styled.labelText>
            {t("Common.Components.File Upload.Title")}
          </Styled.labelText>
          <CustomizedSwitches
            selectedField={{ selectedOption, setSelectedOption }}
          />
        </Styled.SectionTitle>
        {selectedOption === "file" ? (
          <UploadFile
            flagState={{ flag, setFlag }}
            fileManage={{ fileState, setFileState }}
            stage={{ stageState, setStageState }}
            filenameDisabledState={{
              isFilenameDisabled,
              setIsFilenameDisabled,
            }}
            disableBtn={disabled}
            editFilenameState={{ isEditFilename, setIsEditFilename }}
            filename={{ filenameState, setFilenameState }}
          />
        ) : (
          <Styled.StyledTextareaControl>
            <Styled.StyledTextarea
              minRows={15}
              maxRows={15}
              multiline
              disabled={disabled}
              aria-label={"Write Something..."}
              value={textareaValue}
              onChange={handleTextareaChange}
            />
          </Styled.StyledTextareaControl>
        )}

        <Styled.ButtonContainer>
          <ActionButton
            variant="outlined"
            backgroundColor=""
            buttonName={t("Common.Button Generic.Btn Reset")}
            onClick={resetFields}
            disabled={loading}
          />

          <ActionButton
            variant="contained"
            backgroundColor="primary"
            buttonName={
              loading ? (
                <StyledSpinner.Spinner size={20} />
              ) : (
                t("Common.Button Generic.Btn Submit")
              )
            }
            onClick={handleSubmit(handleFormSubmit)}
            disabled={
              loading ||
              !isValid ||
              (selectedOption === "file"
                ? !(stageState === "file-ok")
                : textareaValue.trim().length === 0)
            }
          />
        </Styled.ButtonContainer>
      </form>

      <Notify {...notifyState} closeHandler={closeNotifyHandler} />
    </Styled.Wrapper>
  );
};

export default InvisiNetEnterpriseManager;
