import * as React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

/* Fonts */
import "@fontsource-variable/inter";
import "@fontsource-variable/fira-code";

/* Router */
import RootRouter from "./routes/root.jsx";

/* Components */
import App from "./App.jsx";

/* Redux Store */
import store from "./store";
import { Provider } from "react-redux";

/* i18next localization */
import "./i18n";

/* Mock Service Worker */
if (process.env.NODE_ENV === "development") {
  const { worker } = await import("server/mocks/browser");
  worker.start({ onUnhandledRequest: "bypass" });
}

/* Add Buffer Polyfills */
import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

/* Axios */
import { BASE_URL } from "./api/index.js";
import axios from "axios";
axios.defaults.baseURL = BASE_URL;
const userCache = JSON.parse(sessionStorage.getItem("profile-preferences"));
if (userCache?.tokenType && userCache?.accessToken) {
  axios.defaults.headers.common.Authorization = `${userCache.tokenType} ${userCache.accessToken}`;
}

const rootElement = document.getElementById("root");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={RootRouter}>
        <App />
      </RouterProvider>
    </Provider>
  </React.StrictMode>,
);
