import * as React from "react";
import axios from "axios";
import { CssBaseline, responsiveFontSizes, ThemeProvider } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

/* Components */
import Header from "./Components/Header";
import Navigation from "./Components/Navigation";
import Footer from "./Components/Footer";
import PageMeta from "./Components/Main/PageMeta";
import PageContent from "./Components/Main/PageContent";
import LazySpinner from "src/style/LazySpinner";

/* Hooks */
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./Components/User/userSlice";

/* Utilities */
import { BASE_URL } from "./api";
import Notify from "./style/Notify";
import resetSession from "./utils/resetSession";
import { useTimer } from "react-timer-hook";
import { useTranslation } from "react-i18next";

/* Style */
import Theme from "style/Theme";
import { Styled } from "./App.style";
import { setType } from "./Pages/CaConfiguration/CAConfiguration.slice";

const initNotifyState = { isDisplay: false, type: "", topic: "", message: "" };

function App() {
  const { t } = useTranslation();
  const timeStamp = new Date();
  const TIMER = 60 * 60 * 2;
  const expiryTimestamp = timeStamp.setSeconds(timeStamp.getSeconds() + TIMER);

  const { isRunning } = useTimer({ expiryTimestamp });
  const userStore = useSelector(({ user }) => user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isSideMenuOpened, setIsSideMenuOpened] = React.useState(true);
  const [notifyState, setNotifyState] = React.useState(initNotifyState);

  const logoutHandler = () => {
    axios({
      method: "post",
      url: "user/logout",
    })
      .then(() => {
        resetSession(navigate);
      })
      .catch((error) => {
        resetSession(navigate);
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

  React.useEffect(() => {
    const APP_VERSION = import.meta.env.VITE_APP_VERSION;
    window.APP_INFO = {
      VERSION: APP_VERSION,
      // eslint-disable-next-line no-undef
      LATEST_COMMIT_HEAD: __COMMIT_HASH__,
    };

    console.log(
      // eslint-disable-next-line no-undef
      `%cINTERFACE_VERSION: ${APP_VERSION}-${__COMMIT_HASH__}`,
      `font-weight: bold; color: #42B883; background: #222;`,
    );

    axios.defaults.baseURL = BASE_URL;
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          setNotifyState({
            isDisplay: true,
            type: "error",
            topic: t("Common.Alert Message.Error.Topic"),
            message: t("Common.Alert Message.Error.Message"),
          });
        } else {
          throw error;
        }
      },
    );

    const profilePreferences = sessionStorage.getItem("profile-preferences");
    const isTokenExist = Object.keys(
      JSON.parse(profilePreferences) ?? {},
    ).length;

    if (!userStore.isAuthenticated && !isTokenExist) {
      navigate("/login");
    } else {
      const persistedState = profilePreferences;
      dispatch(setUser(JSON.parse(persistedState)));
      axios.defaults.headers.common.Authorization = `${
        JSON.parse(persistedState).tokenType
      } ${JSON.parse(persistedState).accessToken}`;
    }

    axios({
      method: "get",
      url: "/certificateconfig",
    })
      .then((response) => {
        dispatch(setType(response.data.type ?? "Private Key"));
      })
      .catch(({ response }) => {
        setNotifyState({
          isDisplay: true,
          type: "error",
          topic: `${response.data.error}: ${response.status}`,
          message: response.data.message,
        });
      });

    return () => {
      axios.interceptors.response.clear();
    };

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  React.useEffect(() => {
    if (!isRunning) {
      setNotifyState({
        isDisplay: true,
        type: "error",
        topic: t("Common.Alert Message.Error.Topic"),
        message: t("Common.Alert Message.Error.Message"),
      });
    }
  }, [isRunning, t]);

  return (
    <ThemeProvider theme={responsiveFontSizes(Theme)}>
      <CssBaseline />

      <Styled.App>
        <Header />

        <Styled.ContentWrapper>
          <Navigation
            IsSideMenuOpenedState={[isSideMenuOpened, setIsSideMenuOpened]}
          />

          <Styled.MainWrapper $isSideMenuOpened={isSideMenuOpened}>
            <Styled.Page>
              <PageMeta />

              <PageContent>
                <React.Suspense fallback={<LazySpinner />}>
                  <Outlet />
                </React.Suspense>

                <Notify
                  {...notifyState}
                  closeHandler={logoutHandler}
                  backdoor
                />
              </PageContent>
            </Styled.Page>

            <Footer />
          </Styled.MainWrapper>
        </Styled.ContentWrapper>
      </Styled.App>
    </ThemeProvider>
  );
}

export default App;
