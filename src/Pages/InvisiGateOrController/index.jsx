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

const InvisiGateOrController = () => {
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

  const [dnsError, setDnsError] = useState("");
  const [ipError, setIpError] = useState("");

  const [disabled, setDisabled] = useState(false);

  const { t } = useTranslation();
  const CAConfigurationType = useSelector(
    ({ CAConfigurationType }) => CAConfigurationType,
  );

  const dnsSchema = Yup.array().of(
    Yup.string().test({
      test: (value) => {
        let isValid = regex.FQDN.test(value);
        return isValid;
      },
    }),
  );

  const ipSchema = Yup.array().of(
    Yup.string().test({
      test: (value) => {
        let isValid = regex.IPv4.test(value) || regex.IPv6.test(value);
        return isValid;
      },
    }),
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
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
        customSanDNS: Yup.string().when(
          "$CAConfigurationType",
          ([CAConfigurationType], schema) => {
            if (CAConfigurationType === "Windows CA") {
              return schema.optional();
            } else {
              return schema
                .trim()
                .required(
                  t(
                    "Pages.Invisigate Or Controller.Custom SAN DNS.Validations.Errors.Mandatory",
                  ),
                )
                .test({
                  test: async (value) => {
                    const dnsPairs = value
                      ?.split(",")
                      .filter((value) => value.trim())
                      .map((value) => value.trim());

                    try {
                      const validPairs = await dnsSchema.validate(dnsPairs);
                      setDnsError("");
                      return validPairs?.length > 0;
                    } catch (error) {
                      setDnsError(
                        t(
                          "Pages.Invisigate Or Controller.Custom SAN DNS.Validations.Errors.Invalid",
                          { dns: dnsPairs[error.message.match(/\d+/)[0]] },
                        ),
                      );
                      return false;
                    }
                  },
                });
            }
          },
        ),
        customSanIP: Yup.string().when(
          "$CAConfigurationType",
          ([CAConfigurationType], schema) => {
            if (CAConfigurationType === "Windows CA") {
              return schema;
            } else {
              return schema.trim().test({
                test: async (value) => {
                  const ipPairs = value
                    ?.split(",")
                    .filter((value) => value.trim())
                    .map((value) => value.trim());

                  try {
                    const validPairs =
                      value.trim().length === 0 ||
                      (await ipSchema.validate(ipPairs));
                    setIpError("");
                    return value.trim().length === 0 || validPairs?.length > 0;
                  } catch (error) {
                    setIpError(
                      t(
                        "Pages.Invisigate Or Controller.Custom SAN IP.Validations.Errors.Invalid",
                        { ip: ipPairs[error.message.match(/\d+/)[0]] },
                      ),
                    );
                    return false;
                  }
                },
              });
            }
          },
        ),
      }),
    ),
    defaultValues: {
      customerName: "",
      customSanDNS: "",
      customSanIP: "",
    },
  });

  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value);
  };

  const closeNotifyHandler = () => {
    setNotifyState(initNotifyState);
  };

  const handleFormSubmit = (data) => {
    function customSanDomain(dns, ip) {
      const DNS_LIST = [...dns]
        .filter((value) => value.trim())
        .map((value) => value.trim());

      const IP_LIST = [...ip]
        .filter((value) => value.trim())
        .map((value) => value.trim());

      const result = [];
      const maxLength = Math.max(DNS_LIST.length, IP_LIST.length);

      for (let index = 0; index < maxLength; index++) {
        if (index < DNS_LIST.length) {
          result.push(`DNS: ${DNS_LIST[index].trim()}`);
        }
        if (index < IP_LIST.length) {
          result.push(`IP: ${IP_LIST[index].trim()}`);
        }
      }

      return result.join(", ");
    }

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
      customSAN: customSanDomain(
        data.customSanDNS ? data.customSanDNS.split(",") : [],
        data.customSanIP ? data.customSanIP.split(",") : [],
      ),
    };

    if (CAConfigurationType === "Windows CA") {
      delete certRequestPayload.customSAN;
    }

    formData.append("certRequest", JSON.stringify(certRequestPayload));

    axios({
      method: "post",
      url: "/invisigate/certificate/download",
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

  const handleSetValue = (value) => {
    setValue(value.target.name, value.target.value);
  };

  const resetFields = useCallback(() => {
    setTextareaValue("");
    setFlag(true);
    reset();
  }, [reset]);

  return (
    <Styled.Wrapper>
      <form>
        <div style={{ height: "5rem" }}>
          <Controller
            control={control}
            name="customerName"
            render={({ field }) => (
              <TextField
                {...field}
                {...register("customerName")}
                defaultValue={""}
                required
                variant="outlined"
                fullWidth
                id="customername"
                name="customerName"
                disabled={disabled}
                label={t("Common.Fields.Customer Name.Title")}
                error={errors.customerName?.message ?? null}
                helperText={errors.customerName?.message ?? null}
                onChange={handleSetValue}
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
        </div>

        {CAConfigurationType !== "Windows CA" ? (
          <Styled.FormWrapper>
            <Controller
              control={control}
              name="customSanDNS"
              render={({ field }) => (
                <TextField
                  required
                  {...field}
                  {...register("customSanDNS")}
                  defaultValue={""}
                  variant="outlined"
                  fullWidth
                  disabled={disabled}
                  id="customSanDNS"
                  name="customSanDNS"
                  label={t(
                    "Pages.Invisigate Or Controller.Custom SAN DNS.Title",
                  )}
                  error={dnsError || errors.customSanDNS?.message}
                  helperText={dnsError || errors.customSanDNS?.message}
                  onChange={handleSetValue}
                  InputProps={{
                    sx: { height: 50 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <TooltipIconArrow
                          textContent={
                            <>
                              <p>
                                <Trans
                                  i18nKey={
                                    "Pages.Invisigate Or Controller.Custom SAN DNS.Tool Tip.Titile"
                                  }
                                >
                                  Supported SAN Tags:
                                  <br />
                                  <b>DNS - for FQDN or hostname</b>
                                </Trans>
                              </p>
                              <ul style={{ paddingLeft: "1rem" }}>
                                <li style={{ margin: "0.2rem 0" }}>
                                  <Trans
                                    i18nKey={
                                      "Pages.Invisigate Or Controller.Custom SAN DNS.Tool Tip.Example"
                                    }
                                  >
                                    e.g. company.example.com <br />
                                    e.g. company.one.com, company.two.com
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

            <Controller
              control={control}
              name="customSanIP"
              render={({ field }) => (
                <TextField
                  {...field}
                  {...register("customSanIP")}
                  defaultValue={""}
                  variant="outlined"
                  fullWidth
                  id="customSanIP"
                  name="customSanIP"
                  disabled={disabled}
                  label={t(
                    "Pages.Invisigate Or Controller.Custom SAN IP.Title",
                  )}
                  error={ipError || errors.customSanIP?.message}
                  helperText={ipError || errors.customSanIP?.message}
                  onChange={handleSetValue}
                  InputProps={{
                    sx: { height: 50 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <TooltipIconArrow
                          textContent={
                            <>
                              <p>
                                <Trans
                                  i18nKey={
                                    "Pages.Invisigate Or Controller.Custom SAN IP.Tool Tip.Titile"
                                  }
                                >
                                  Supported SAN Tags:
                                  <br />
                                  <b>IP - for IPv4 or IPv6</b>
                                </Trans>
                              </p>
                              <ul style={{ paddingLeft: "1rem" }}>
                                <li style={{ margin: "0.2rem 0" }}>
                                  <Trans
                                    i18nKey={
                                      "Pages.Invisigate Or Controller.Custom SAN IP.Tool Tip.Example"
                                    }
                                  >
                                    e.g. 255.255.255.255
                                    <br />
                                    e.g. 255.255.255.255, 8.8.8.8
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
          </Styled.FormWrapper>
        ) : null}

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
            buttonName="Reset"
            onClick={resetFields}
            disabled={loading}
          />

          <ActionButton
            variant="contained"
            backgroundColor="primary"
            buttonName={
              loading ? <StyledSpinner.Spinner size={20} /> : "Submit"
            }
            disabled={
              loading ||
              !isValid ||
              (selectedOption === "file"
                ? !(stageState === "file-ok")
                : textareaValue.trim().length === 0)
            }
            onClick={handleSubmit(handleFormSubmit)}
          />
        </Styled.ButtonContainer>
      </form>

      <Notify {...notifyState} closeHandler={closeNotifyHandler} />
    </Styled.Wrapper>
  );
};

export default InvisiGateOrController;
