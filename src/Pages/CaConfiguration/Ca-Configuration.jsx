import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Styled } from "./Ca-Configuration.style";
import LazySpinner from "src/style/LazySpinner";
import { ActionButton } from "src/style/ActionButton/ActionButton";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Radio } from "../Common/RadioButton/Radio-Button";
import { ValidationSchema } from "./Ca-Configuration.validation";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Notify from "src/style/Notify";
import { setType } from "./CAConfiguration.slice";
import decryptAES from "src/utils/DecryptAES";
import encryptAES from "src/utils/encryptAES";

const PRIVATE_KEY = "Private Key";
const WINDOWS_CA = "Windows CA";
const initNotifyState = { isDisplay: false, type: "", topic: "", message: "" };

function CaConfiguration() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const CAConfigurationType = useSelector(
    ({ CAConfigurationType }) => CAConfigurationType,
  );

  const [notifyState, setNotifyState] = React.useState(initNotifyState);
  const [isOpenPopup, setIsOpenPopup] = React.useState(true);
  const [isGetWindowsCAFormData, setIsGetWindowsCAFormData] =
    React.useState(true);
  const [isFormActionDisabled, setIsFormActionDisabled] = React.useState(false);
  const [isTriggerSpinner, setIsTriggerSpinner] = React.useState(true);
  const [selectedValue, setSelectedValue] = React.useState(PRIVATE_KEY);
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(ValidationSchema()),
    context: { selectedValue },
    defaultValues: {
      id: "",
      host: "",
      /* CAName: "", */ // No Longer Needed
      username: "",
      password: "",
      domain: "",
      /* workStation: "", */ // No Longer Needed
    },
  });

  const [showPassword, setShowPassword] = React.useState(false);

  const [warning, setWarning] = React.useState(false);

  const closeNotifyHandler = () => {
    setNotifyState(initNotifyState);
  };

  const onKeyDown = (keyEvent) => {
    if (keyEvent.getModifierState("CapsLock")) {
      setWarning(true);
    } else {
      setWarning(false);
    }
  };

  const buttonForLoginRef = React.useRef(null);

  const resetFields = React.useCallback(() => {
    reset();
  }, [reset]);

  const toggleViewPassword = (isEye) => {
    setShowPassword(isEye);
  };

  function handleRadio(value) {
    setSelectedValue((oldState) => {
      return value === oldState ? oldState : value;
    });
  }

  const submitHandler = (data, e) => {
    e.preventDefault();
    setLoading(true);

    const requestPayload =
      selectedValue === PRIVATE_KEY
        ? { id: getValues("id"), type: selectedValue }
        : {
            id: getValues("id"),
            type: selectedValue,
            host: getValues("host"),
            /* caName: getValues("CAName"), */ // No Longer Needed
            username: getValues("username"),
            password: getValues("password"),
            domain: getValues("domain"),
            /* workstation: getValues("workStation"), */ // No Longer Needed
          };

    // Update CA Configuration
    axios({
      method: getValues("id") ? "put" : "post",
      url: `certificateconfig/${getValues("id") || ""}`,
      data: requestPayload,
    })
      .then((response) => {
        const payload = response.data;
        setLoading(false);
        setNotifyState({
          isDisplay: true,
          type: "not-error",
          topic: `Success: ${response.status}`,
          message: `Configuration ${
            getValues("id") ? "Updated" : "Added"
          } Successfully.`,
        });
      })
      .catch(({ response }) => {
        setLoading(false);

        setNotifyState({
          isDisplay: true,
          type: "error",
          topic: `${response.data.error}: ${response.status}`,
          message: response.data.message,
        });
      });
  };

  React.useEffect(() => {
    // Fetch CA Configuration
    if (isGetWindowsCAFormData) {
      axios({
        method: "get",
        url: "/certificateconfig",
      })
        .then((response) => {
          const payload = response.data;

          setIsTriggerSpinner(false);

          dispatch(setType(payload.type ?? PRIVATE_KEY));

          setValue("id", payload.id ?? "");
          setSelectedValue(payload.type ?? "");
          setValue("host", payload.host ?? "");
          /* setValue("CAName", payload.caName ?? ""); */ // No Longer Needed
          setValue("username", payload.username ?? "");
          setValue("password", decryptAES(payload.password) ?? "");
          setValue("domain", payload.domain ?? "");
          /* setValue("workStation", payload.workstation ?? ""); */ // No Longer Needed
        })
        .catch(({ response }) => {
          setLoading(false);
          setIsTriggerSpinner(false);

          setNotifyState({
            isDisplay: true,
            type: "error",
            topic: `${response.data.error}: ${response.status}`,
            message: response.data.message,
          });
        });
    }

    return () => {
      setIsGetWindowsCAFormData(false);
    };
  }, [dispatch, isGetWindowsCAFormData, setValue]);

  React.useEffect(() => {
    dispatch(setType(selectedValue));
  }, [dispatch, selectedValue]);

  return (
    <Styled.MainContainer>
      {isTriggerSpinner ? (
        <Styled.FloatContainer $display={isTriggerSpinner}>
          <LazySpinner />
        </Styled.FloatContainer>
      ) : (
        <>
          <Styled.SectionTitle>
            {t("Pages.Certificate Authority Configuration.Title")}
          </Styled.SectionTitle>

          <br />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              textTransform: "uppercase",
            }}
          >
            <Typography sx={{ fontWeight: 500, textTransform: "capitalize" }}>
              {t("Pages.Certificate Authority Configuration.Toggle Title")}
            </Typography>

            <Radio
              labelName={t(
                "Pages.Certificate Authority Configuration.Private Key Label",
              )}
              value={PRIVATE_KEY}
              checked={selectedValue === PRIVATE_KEY}
              onClick={() => handleRadio(PRIVATE_KEY)}
              name="radio-buttons"
              inputProps={{ "aria-label": PRIVATE_KEY }}
            />

            <Radio
              labelName={t(
                "Pages.Certificate Authority Configuration.Windows CA Label",
              )}
              value={WINDOWS_CA}
              checked={selectedValue === WINDOWS_CA}
              onClick={() => handleRadio(WINDOWS_CA)}
              name="radio-buttons"
              inputProps={{ "aria-label": WINDOWS_CA }}
            />
          </Box>

          <br />

          <form>
            <Box
              sx={{ display: selectedValue === WINDOWS_CA ? "auto" : "none" }}
            >
              <Typography sx={{ fontSize: "0.75rem" }}>
                {t(
                  "Pages.Certificate Authority Configuration.Windows CA Form.Note To User",
                )}
              </Typography>
              <br />

              <Styled.RowContainer>
                <Controller
                  control={control}
                  name="host"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      id="host"
                      label={t(
                        "Pages.Certificate Authority Configuration.Windows CA Form.Host",
                      )}
                      fullWidth
                      variant="outlined"
                      disabled={disabled}
                      error={!!errors.host}
                      helperText={errors.host?.message}
                      InputProps={{ sx: { height: 50 } }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="domain"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="domain"
                      label={t(
                        "Pages.Certificate Authority Configuration.Windows CA Form.Domain",
                      )}
                      fullWidth
                      variant="outlined"
                      disabled={disabled}
                      error={!!errors.domain}
                      helperText={errors.domain?.message}
                      InputProps={{ sx: { height: 50 } }}
                    />
                  )}
                />

                {/* No Longer Needed
            <Controller
              control={control}
              name="CAName"
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  id="CAName"
                  label={t(
                    "Pages.Certificate Authority Configuration.Windows CA Form.CA Name",
                  )}
                  fullWidth
                  variant="outlined"
                  disabled={disabled}
                  error={!!errors.CAName}
                  helperText={errors.CAName?.message}
                  InputProps={{ sx: { height: 50 } }}
                />
              )}
            />
            */}
              </Styled.RowContainer>

              <Styled.RowContainer>
                <Controller
                  control={control}
                  name="username"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      id="username"
                      label={t(
                        "Pages.Certificate Authority Configuration.Windows CA Form.Username",
                      )}
                      fullWidth
                      variant="outlined"
                      disabled={disabled}
                      error={!!errors.username}
                      helperText={errors.username?.message}
                      InputProps={{ sx: { height: 50 } }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <Styled.Input
                      {...field}
                      label={t(
                        "Pages.Certificate Authority Configuration.Windows CA Form.Password",
                      )}
                      id="password"
                      variant="outlined"
                      required
                      fullWidth
                      autoComplete="current-password"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      type={!showPassword ? "password" : "text"}
                      onKeyDown={onKeyDown}
                      inputProps={{
                        maxLength: 30,
                        onKeyPress: (event) => {
                          const { key } = event;

                          if (key === "Enter") {
                            buttonForLoginRef.current.click();
                          }
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {warning && (
                              <WarningAmberIcon style={{ color: "#018ff6" }} />
                            )}
                            <IconButton
                              aria-label="toggle password visibility"
                              // onMouseUp={() => toggleViewPassword(false)}
                              // onMouseDown={() => toggleViewPassword(true)}
                              onClick={() => toggleViewPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <VisibilityOutlinedIcon />
                              ) : (
                                <VisibilityOffOutlinedIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />

                {/* No Longer Needed
            <Controller
              control={control}
              name="workStation"
              render={({ field }) => (
                <TextField
                  {...field}
                  id="workStation"
                  label={t(
                    "Pages.Certificate Authority Configuration.Windows CA Form.WorkStation",
                  )}
                  fullWidth
                  variant="outlined"
                  disabled={disabled}
                  error={!!errors.workStation}
                  helperText={errors.workStation?.message}
                  InputProps={{ sx: { height: 50 } }}
                />
              )}
            /> */}
              </Styled.RowContainer>
            </Box>

            <Styled.ButtonContainer>
              <ActionButton
                variant="outlined"
                backgroundColor=""
                buttonName={"Reset"}
                disabled={isFormActionDisabled}
                onClick={resetFields}
              />

              <ActionButton
                variant="contained"
                backgroundColor="primary"
                buttonName={loading ? <Styled.Spinner size={25} /> : "Submit"}
                disabled={loading || isFormActionDisabled}
                onClick={handleSubmit(submitHandler)}
              />
            </Styled.ButtonContainer>
          </form>
        </>
      )}

      <Notify {...notifyState} closeHandler={closeNotifyHandler} />
    </Styled.MainContainer>
  );
}

export default CaConfiguration;
