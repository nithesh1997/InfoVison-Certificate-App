import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Styled } from "./ConfigureCSR.style";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ActionButton } from "src/style/ActionButton/ActionButton";
import TooltipIconArrow, {
  TooltipIconDisable,
} from "src/style/TextField/TooltipIconArrow";
import { Trans, useTranslation } from "react-i18next";
import LazySpinner from "src/style/LazySpinner";
import React from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { CloseRounded } from "@mui/icons-material";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { ValidationSchema } from "./ConfigureCSR.validation";
import { StyledSpinner } from "src/style/ButtonLoading/index.style";
import Notify from "src/style/Notify";
import { Controller, useForm } from "react-hook-form";

const initNames = () => ({
  value: "",
  isDisabled: true,
});

const initNotifyState = { isDisplay: false, type: "", topic: "", message: "" };

export default function ConfigureCSR() {
  const [organizationUnitName, setOrganizationUnitName] =
    React.useState(initNames);
  const [notifyState, setNotifyState] = React.useState(initNotifyState);
  const [loading, setLoading] = React.useState(false);
  const [csrData, setCsrData] = React.useState({});
  const [disabled, setDisabled] = React.useState(false);
  const [initFormData, setInitFormData] = React.useState({});
  const {
    register,
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(ValidationSchema()),
    defaultValues: {
      organizationUnitName: "EPC",
      customerName: "",
      clientFqdnSuffix: "",
      countryName: "",
      state: "",
      locality: "",
      organizationName: "",
      emailAddress: "",
    },
  });

  const { t } = useTranslation();

  React.useEffect(() => {
    setDisabled(true);
    axios({
      method: "get",
      url: "/csr",
    })
      .then((response) => {
        setDisabled(false);
        const payload = response.data;
        if (Object.keys(payload).length) {
          const countryName = payload?.countryName;
          const stateName = payload?.stateName;
          const location = payload?.location;
          const organizationName = payload?.organizationName;
          const organizationUnitName = payload?.organizationUnitName;
          const emailAddress = payload?.emailAddress;
          const clientFqdnSuffix = payload?.userFqdnSuffix;
          setInitFormData({
            countryName,
            state: stateName,
            locality: location,
            organizationName,
            organizationUnitName,
            emailAddress,
            isBtnDisable: true,
            clientFqdnSuffix,
          });
          countryName && setValue("countryName", countryName);
          stateName && setValue("state", stateName);
          location && setValue("locality", location);
          organizationName && setValue("organizationName", organizationName);
          organizationUnitName &&
            setValue("organizationUnitName", organizationUnitName);
          emailAddress && setValue("emailAddress", emailAddress);
          setCsrData(payload);
          clientFqdnSuffix && setValue("clientFqdnSuffix", clientFqdnSuffix);
        }
      })
      .catch((error) => {
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
  }, []);

  const toggleOrganizatioUnitNameMode = (isEdit) => {
    setOrganizationUnitName((oldState) => ({
      ...oldState,
      isDisabled: !isEdit,
      value: !isEdit ? oldState.initialValue : oldState.value,
    }));
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);
    setDisabled(true);

    if (
      data.countryName !== initFormData.countryName ||
      data.emailAddress !== initFormData.emailAddress ||
      data.locality !== initFormData.locality ||
      data.organizationName !== initFormData.organizationName ||
      data.organizationUnitName !== initFormData.organizationUnitName ||
      data.state !== initFormData.state ||
      data.clientFqdnSuffix !== initFormData.clientFqdnSuffix
    ) {
      try {
        const requestData = {
          countryName: data.countryName,
          emailAddress: data.emailAddress,
          location: data.locality,
          organizationName: data.organizationName,
          organizationUnitName: data.organizationUnitName,
          stateName: data.state,
          userFqdnSuffix: data.clientFqdnSuffix,
        };
        if (!csrData?.id) {
          await axios
            .post(`/csr`, requestData)
            .then((response) => {
              setLoading(false);
              setDisabled(false);
              setNotifyState({
                isDisplay: true,
                type: "not-error",
                topic: `Success: ${response.status}`,
                message: "Configuration added successfully",
              });
            })
            .catch((res) => {
              setDisabled(false);
              setLoading(false);
              setNotifyState({
                isDisplay: true,
                type: "error",
                topic: `${res.response.data.error} - ${res.response.data.status}`,
                message: res.response.data.message,
              });
            });
        } else {
          await axios
            .put(`/csr/${csrData.id}`, requestData)
            .then((response) => {
              setLoading(false);
              setDisabled(false);
              setNotifyState({
                isDisplay: true,
                type: "not-error",
                topic: `Success: ${response.status}`,
                message: "Configuration updated successfully",
              });
            })
            .catch((res) => {
              setLoading(false);
              setDisabled(false);
              setNotifyState({
                isDisplay: true,
                type: "error",
                topic: `${res.response.data.error} - ${res.response.data.status}`,
                message: res.response.data.message,
              });
            });
        }
        setLoading(false);
      } catch (error) {
        console.error("An error occurred:", error);
        setLoading(false);
        setNotifyState({
          isDisplay: true,
          type: "error",
          topic: `${error.error} - ${error.status}`,
          message: error.message,
        });
      }
    } else {
      setLoading(false);
      setDisabled(false);
      setNotifyState({
        isDisplay: true,
        type: t(
          "Pages.Configure CSR Defaults.Prompt Message.Form Change To Proceed.Type",
        ),
        topic: t(
          "Pages.Configure CSR Defaults.Prompt Message.Form Change To Proceed.Topic",
        ),
        message: t(
          "Pages.Configure CSR Defaults.Prompt Message.Form Change To Proceed.Message",
        ),
      });
    }
  };

  const closeNotifyHandler = () => {
    setNotifyState(initNotifyState);
  };

  return (
    <>
      <Styled.MainContainer>
        <Styled.FloatContainer>
          <LazySpinner />
        </Styled.FloatContainer>

        <Styled.SectionTitle>
          {t("Pages.Configure CSR Defaults.Configure CSR Title")}
        </Styled.SectionTitle>
        <form>
          <>
            <Styled.RowContainer>
              <Controller
                control={control}
                name="customerName"
                render={({ field }) => (
                  <Styled.StyledTextField
                    {...field}
                    {...register("customerName")}
                    id="customer-name"
                    name="customerName"
                    label={t("Common.Fields.Customer Name.Title")}
                    defaultValue={""}
                    required
                    fullWidth
                    disabled
                    variant="filled"
                    InputProps={{
                      sx: { height: 50 },
                      endAdornment: (
                        <InputAdornment position="end">
                          <TooltipIconDisable>
                            <IconButton>
                              <InfoOutlinedIcon size={"0.6em"} />
                            </IconButton>
                          </TooltipIconDisable>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="clientFqdnSuffix"
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register("clientFqdnSuffix")}
                    disabled={disabled}
                    defaultValue={""}
                    id="client-fqdn"
                    name="clientFqdnSuffix"
                    label={t(
                      "Pages.Configure CSR Defaults.Client Fqdn Suffix.Title",
                    )}
                    required
                    fullWidth
                    variant="outlined"
                    error={!!errors.clientFqdnSuffix}
                    helperText={errors.clientFqdnSuffix?.message}
                    InputProps={{
                      sx: { height: 50 },
                      endAdornment: (
                        <InputAdornment position="end">
                          <TooltipIconArrow
                            textContent={
                              <>
                                <p>
                                  {t(
                                    "Pages.Configure CSR Defaults.Client Fqdn Suffix.Tool Tip.Title",
                                  )}
                                </p>

                                <ul style={{ paddingLeft: "1rem" }}>
                                  <li style={{ margin: "0.2rem 0" }}>
                                    <Trans
                                      i18nKey={
                                        "Common.Fields.Client Fqdn Suffix.Tool Tip.List.Fqdn Example"
                                      }
                                      components={[
                                        <b key={"b"} />,
                                        <code key={"code"} />,
                                      ]}
                                    >
                                      Valid Fully Qualified Domain Name{" "}
                                      <b>(FQDN)</b> Suffix such as{" "}
                                      <code>invisinet.com</code>.
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
                name="countryName"
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register("countryName")}
                    defaultValue={""}
                    id="country-name"
                    name="countryName"
                    label={t("Pages.Configure CSR Defaults.Country.Title")}
                    error={!!errors.countryName}
                    helperText={errors.countryName?.message}
                    disabled={disabled}
                    required
                    fullWidth
                    variant="outlined"
                    InputProps={{ sx: { height: 50 } }}
                  />
                )}
              />
            </Styled.RowContainer>

            <Styled.RowContainer>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register("state")}
                    defaultValue={""}
                    id="state"
                    name="state"
                    label={t(
                      "Pages.Configure CSR Defaults.State Or Providence.Title",
                    )}
                    error={!!errors.state}
                    helperText={errors.state?.message}
                    disabled={disabled}
                    required
                    fullWidth
                    variant="outlined"
                    InputProps={{ sx: { height: 50 } }}
                  />
                )}
              />

              <Controller
                control={control}
                name="locality"
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register("locality")}
                    defaultValue={""}
                    id="locality"
                    name="locality"
                    label={t(
                      "Pages.Configure CSR Defaults.Locality Name.Title",
                    )}
                    error={!!errors.locality}
                    helperText={errors.locality?.message}
                    disabled={disabled}
                    required
                    fullWidth
                    variant="outlined"
                    InputProps={{ sx: { height: 50 } }}
                  />
                )}
              />

              <Controller
                control={control}
                name="organizationName"
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register("organizationName")}
                    defaultValue={""}
                    id="organization-name"
                    name="organizationName"
                    label={t(
                      "Pages.Configure CSR Defaults.Organization Name.Title",
                    )}
                    error={!!errors.organizationName}
                    helperText={errors.organizationName?.message}
                    disabled={disabled}
                    required
                    fullWidth
                    variant="outlined"
                    InputProps={{ sx: { height: 50 } }}
                  />
                )}
              />
            </Styled.RowContainer>

            <Styled.RowContainer>
              <Controller
                control={control}
                name="organizationUnitName"
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register("organizationUnitName")}
                    id="organization-unit-name"
                    label={t(
                      "Pages.Configure CSR Defaults.Organization Unit Name.Title",
                    )}
                    fullWidth
                    variant="outlined"
                    disabled={organizationUnitName.isDisabled}
                    error={!!errors.organizationUnitName}
                    helperText={errors.organizationUnitName?.message}
                    InputProps={{
                      sx: { height: 50 },
                      endAdornment: (
                        <InputAdornment position="end">
                          {organizationUnitName.isDisabled === true ? (
                            <IconButton
                              onClick={() =>
                                toggleOrganizatioUnitNameMode(true)
                              }
                            >
                              <EditOutlinedIcon />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() =>
                                toggleOrganizatioUnitNameMode(false)
                              }
                              disabled={errors.organizationUnitName?.message}
                            >
                              <CloseRounded style={{ fontSize: "18px" }} />
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="emailAddress"
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register("emailAddress")}
                    defaultValue={""}
                    id="email-address"
                    name="emailAddress"
                    label={t(
                      "Pages.Configure CSR Defaults.Email Address.Title",
                    )}
                    error={!!errors.emailAddress}
                    helperText={errors.emailAddress?.message}
                    disabled={disabled}
                    fullWidth
                    variant="outlined"
                    InputProps={{ sx: { height: 50 } }}
                  />
                )}
              />
            </Styled.RowContainer>
          </>

          <Styled.ButtonContainer>
            <ActionButton
              variant="outlined"
              backgroundColor=""
              buttonName={t("Common.Button Generic.Btn Reset")}
              onClick={reset}
            />

            <ActionButton
              variant="contained"
              backgroundColor="primary"
              disabled={loading}
              buttonName={
                loading ? (
                  <StyledSpinner.Spinner size={20} />
                ) : (
                  t("Common.Button Generic.Btn Submit")
                )
              }
              onClick={disabled ? () => {} : handleSubmit(handleFormSubmit)}
            />
          </Styled.ButtonContainer>
        </form>
      </Styled.MainContainer>
      <Notify {...notifyState} closeHandler={closeNotifyHandler} />
    </>
  );
}
