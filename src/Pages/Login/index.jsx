import * as React from "react";
import axios from "axios";

/* Hooks */
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

/* Styling */
import {
  CssBaseline,
  IconButton,
  InputAdornment,
  responsiveFontSizes,
  TextField,
  ThemeProvider,
} from "@mui/material";

/* Assets */
import backgroundImage from "assets/light-mode/bg-image-login.png";

/* Slice */
import { setUser } from "components/User/userSlice";

/* Style */
import { Styled } from "./Login.style";

/* Icons */
import InvisiNetLogo from "assets/light-mode/brand-logo-icon-text.svg";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

/* Hook-form-validation */
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { ValidationSchema } from "./Login.validation";

/* Base URL */
import { BASE_URL } from "src/api";
import Theme from "src/style/Theme";
import whoAmI from "src/utils/whoAmI";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const textFieldForPasswordRef = React.useRef(null);
  const buttonForLoginRef = React.useRef(null);

  const [warning, setWarning] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isErrorResponse, setIsErrorResponse] = React.useState(false);
  const [errorResponse, setErrorResponse] = React.useState("");

  const { t } = useTranslation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onSubmit",
    resolver: yupResolver(ValidationSchema()),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onKeyDown = (keyEvent) => {
    if (keyEvent.getModifierState("CapsLock")) {
      setWarning(true);
    } else {
      setWarning(false);
    }
  };

  const toggleViewPassword = (isEye) => {
    setShowPassword(isEye);
  };

  const formSubmitHandler = (data) => {
    setLoading(true);

    axios({
      method: "post",
      url: `${BASE_URL}/users/login`,
      data: { username: data.username, password: data.password },
    })
      .then(async ({ data: payload }) => {
        axios.defaults.baseURL = BASE_URL;
        axios.defaults.headers.common.Authorization = `${payload.tokenType} ${payload.accessToken}`;

        const newUserState = await whoAmI(payload.accessToken);

        sessionStorage.setItem(
          "profile-preferences",
          JSON.stringify({
            ...newUserState,
            tokenType: payload.tokenType,
            accessToken: payload.accessToken,
          }),
        );

        dispatch(setUser(newUserState));

        const isAdmin = newUserState.role === "Administrator";

        isAdmin ? navigate("/") : navigate("/invisipoint-client");
      })
      .catch((payload) => {
        const { message } = payload.response?.data ?? { message: "" };

        setLoading(false);
        setIsErrorResponse(true);
        setErrorResponse(
          <p style={{ color: "crimson", margin: "0" }}>{message}</p>,
        );
      });
  };

  return (
    <ThemeProvider theme={responsiveFontSizes(Theme)}>
      <CssBaseline />

      <Styled.ScreenWrapper $backgroundImage={backgroundImage}>
        <Styled.FormWrapper>
          <Styled.ImageBanner>
            <img
              src={InvisiNetLogo}
              style={{ width: "260px" }}
              alt={"InvisiNet"}
            />
          </Styled.ImageBanner>

          <Styled.FormTitle>{t("Pages.Login.Title")}</Styled.FormTitle>

          <form autoComplete="on">
            <Styled.TextFieldWrapper>
              <Controller
                control={control}
                name="username"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("Pages.Login.User Name.Title")}
                    id="user-name"
                    variant="outlined"
                    autoFocus
                    required
                    fullWidth
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    inputProps={{
                      onKeyPress: ({ key }) => {
                        if (key === "Enter") {
                          textFieldForPasswordRef.current.focus();
                        }
                      },
                    }}
                  />
                )}
              />
            </Styled.TextFieldWrapper>

            <Styled.TextFieldWrapper>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Styled.Input
                    {...field}
                    label={t("Pages.Login.Password.Title")}
                    id="password"
                    variant="outlined"
                    required
                    fullWidth
                    autoComplete="current-password"
                    error={!!errors.password}
                    helperText={
                      isErrorResponse ? errorResponse : errors.password?.message
                    }
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
                            onMouseUp={() => toggleViewPassword(false)}
                            onMouseDown={() => toggleViewPassword(true)}
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
            </Styled.TextFieldWrapper>

            <Styled.Choices>
              <Styled.WarningWrapper $isWarn={warning}>
                <WarningAmberIcon
                  style={{ color: "#ff8067", margin: "0rem 0.4rem" }}
                />{" "}
                {t("Pages.Login.Cap Lock Text")}
              </Styled.WarningWrapper>
            </Styled.Choices>

            <Styled.ButtonWrapper>
              <Styled.LoginButton
                id="loginbutton"
                type="button"
                variant="contained"
                ref={buttonForLoginRef}
                onClick={handleSubmit(formSubmitHandler)}
                disabled={loading || !isDirty || !isValid}
              >
                {loading ? (
                  <Styled.Spinner size={30} />
                ) : (
                  t("Pages.Login.Button Text.Title")
                )}
              </Styled.LoginButton>
            </Styled.ButtonWrapper>
          </form>
        </Styled.FormWrapper>
      </Styled.ScreenWrapper>
    </ThemeProvider>
  );
};

export default Login;
