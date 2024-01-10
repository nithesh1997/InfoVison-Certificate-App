import { useEffect, useState } from "react";
import AlertDialog from "../GridPortal/AlertDialog";
import { Styled } from "../styled-materials/EditStylePopup";
import { GenericButton } from "../GenericButton/GenericButton";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import styled from "@emotion/styled";
import { CircularProgress } from "@mui/material";

function ChangePasswordSetup(props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const passwordValueStates = useState({
    password: "",
    confirmPasswrd: "",
  });

  const [passwordState, setPasswordState] = passwordValueStates;

  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [passwordStrongValue, setPasswordStrongValue] = useState(0);

  const [submitLoader, setSubmitLoader] = useState(false);

  const [changePasswordPopup, setChangePasswordPopup] =
    props.changePasswordState;

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (passwordState.password.length > 4) {
      setShowPasswordStrength(true);
      const passWordRegex = [
        /(?=.{6,15}$)/,
        /(?=.*[A-Z])/,
        /[ -/:-@[-`{-~]/,
        /(?=.*[0-9])/,
      ];
      const passwordResult = passWordRegex
        .map((e) => e.test(passwordState.password))
        .filter((e) => e).length;
      setPasswordStrongValue(passwordResult);
    } else if (passwordState.password.length) {
      setShowPasswordStrength(true);
      setPasswordStrongValue(0);
    } else {
      setShowPasswordStrength(false);
      setPasswordStrongValue(0);
    }
  }, [passwordState.password.length]);

  function validatePassword(type) {
    if (passwordState.password === passwordState.confirmPasswrd) {
      setConfirmPasswordError("");
      if (type !== "blur") {
        setDialogOpen(true);
      }
    } else if (!passwordState.confirmPasswrd.length) {
      setConfirmPasswordError("Re-enter the Password");
    } else {
      setConfirmPasswordError("Password and Confirm password must be same");
    }
  }

  let num = passwordStrongValue;

  let totalScore = (num * 100) / 4;

  const createPassLabel = () => {
    switch (num) {
      case 0:
        return "Very weak";
      case 1:
        return "Weak";
      case 2:
        return "Fear";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  const funcProgressColor = () => {
    switch (num) {
      case 0:
        return "#828282";
      case 1:
        return "#EA1111";
      case 2:
        return "#FFAD00";
      case 3:
        return "#9bc158";
      case 4:
        return "#00b500";
      default:
        return "none";
    }
  };

  const changePasswordColor = () => ({
    width: `${totalScore}%`,
    background: funcProgressColor(),
    height: "7px",
  });

  return (
    <>
      <Styled.StyledContainer
        tabindex="-1"
        id="addgateway"
        not
        aria-labelledby="addgatewayLabel"
      >
        <Styled.StyledMainDivComponent>
          <Styled.StyledMainDivComponent>
            <Styled.HeaderDivComponent class="offcanvas-header">
              <Styled.StyledH5Component>
                {changePasswordPopup.title} - {changePasswordPopup.userName}
              </Styled.StyledH5Component>
              <Styled.StyledCloseIconComponent
                onClick={() => {
                  props.handleClose();
                }}
              />
            </Styled.HeaderDivComponent>

            <Styled.BodyDivComponent class="offcanvas-body">
              <Styled.StyledFormContainer>
                {/* input filed content */}

                <TextField
                  label="New Password"
                  id="filled-size-normal"
                  defaultValue=""
                  variant="outlined"
                  fullWidth={true}
                  type="password"
                  onChange={(e) => {
                    setPasswordState((preState) => ({
                      ...preState,
                      password: e.target.value,
                    }));
                  }}
                />
                {/* <PasswordStrengthMeter password={passwordState.password} /> */}
                <div
                  style={{
                    width: "100%",
                    borderRadius: "5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="progress-bar"
                    style={changePasswordColor()}
                  ></div>
                </div>

                <div style={{ textAlign: "right", width: "100%" }}>
                  <span style={{ color: funcProgressColor() }}>
                    {showPasswordStrength && createPassLabel()}
                  </span>
                </div>

                <FormControl
                  sx={{
                    marginTop: "35px",
                    marginBottom: "30px",
                    width: "100%",
                  }}
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Confirm New Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => {
                      setPasswordState((preState) => ({
                        ...preState,
                        confirmPasswrd: e.target.value,
                      }));
                    }}
                    onFocus={() => setConfirmPasswordError("")}
                    onBlur={() => {
                      validatePassword("blur");
                      // blurValidationPassword()
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm New Password"
                  />
                  <p style={{ color: "red" }}>{confirmPasswordError}</p>
                </FormControl>

                <Styled.StyledFooterDivComponent>
                  <GenericButton
                    // id={`${gatewayServices}-distributed-identities-cancel-btn`}
                    id={`generic-button-distributed-identities-cancel-btn`}
                    buttonName={"Cancel"}
                    backgroundColor="secondary"
                    disabled={""}
                    onClick={() => {
                      //   props.handleClosePortal();
                      props.handleClose();
                      //   setTimeoutHelperText("");
                      //   setGroupsHelperText("");
                    }}
                  />

                  <GenericButton
                    // id={`${gatewayServices}-distributed-identities-save-btn`}
                    id={`generic-button-distributed-identities-save-btn`}
                    backgroundColor="primary"
                    disabled={
                      !passwordState.password ||
                      !passwordState.confirmPasswrd ||
                      passwordStrongValue < 2 ||
                      confirmPasswordError ||
                      submitLoader
                    }
                    // buttonName={
                    //   actionLoader ? <Styled.Spinner size={24} /> : "Save"
                    // }
                    // disabled={actionLoader ? true : false}
                    buttonName={submitLoader ? <Spinner size={24} /> : "Save"}
                    // buttonRef={buttonForSaveRef}
                    onClick={() => {
                      // handleSave();
                      validatePassword();
                    }}
                  />
                </Styled.StyledFooterDivComponent>
              </Styled.StyledFormContainer>
            </Styled.BodyDivComponent>
          </Styled.StyledMainDivComponent>
        </Styled.StyledMainDivComponent>
        <AlertDialog
          divider={true}
          open={dialogOpen}
          setOpen={setDialogOpen}
          contentTitle={`Did you Confirm Change your Password`}
          contentText={
            "If you agree to change password means again want to sign-in your account"
          }
          loader={submitLoader}
          agreeTitle={submitLoader ? <Spinner size={24} /> : "Okay"}
          disagreeTitle={"Cancel"}
          handleAgree={() => {
            props.changePasswordAction(
              changePasswordPopup.userId,
              passwordValueStates,
              setConfirmPasswordError,
              setSubmitLoader,
              setChangePasswordPopup,
              setDialogOpen,
            );
          }}
          handleDisagree={() => setDialogOpen(false)}
        />
      </Styled.StyledContainer>
    </>
  );
}

export default ChangePasswordSetup;

const Spinner = styled(CircularProgress)``;
