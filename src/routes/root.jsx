import * as React from "react";
import { createBrowserRouter, redirect } from "react-router-dom";

const App = React.lazy(() => import("src/App"));
const ErrorPage = React.lazy(() => import("src/Pages/Errors/ErrorPage"));
const Login = React.lazy(() => import("src/Pages/Login"));
const Home = React.lazy(() => import("src/Pages/Home"));

const InvisiPointClient = React.lazy(() =>
  import("src/Pages/InvisiPointClient"),
);

const InvisipointEnforcer = React.lazy(() =>
  import("src/Pages/InvisiPointEnforcer"),
);

const CaConfiguration = React.lazy(() =>
  import("src/Pages/CaConfiguration/Ca-Configuration"),
);

const ActiveDirectoryDIA = React.lazy(() =>
  import("src/Pages/ActiveDirectoryDIA"),
);

const InvisiGateOrController = React.lazy(() =>
  import("src/Pages/InvisiGateOrController"),
);

const InvisiNetEnterpriseManager = React.lazy(() =>
  import("src/Pages/InvisiNetEnterpriseManager"),
);

const ConfigureCSR = React.lazy(() => import("src/Pages/ConfigureCSR"));

const ManageUsers = React.lazy(() => import("src/Pages/ManageUsers"));

const ManageInvisipoints = React.lazy(() =>
  import("src/Pages/ManageInvisipoints"),
);

const loader = async () => {
  const profilePreferences = sessionStorage.getItem("profile-preferences");

  return profilePreferences ? null : redirect("/login");
};

const RootRouter = createBrowserRouter(
  [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
      loader,
      children: [
        {
          index: true,
          element: <Home />,
          loader,
        },
        {
          path: "/invisipoint-client",
          element: <InvisiPointClient />,
          loader,
        },
        {
          path: "/invisipoint-enforcer",
          element: <InvisipointEnforcer />,
          loader,
        },
        {
          path: "/ca-configuration",
          element: <CaConfiguration />,
          loader,
        },
        {
          path: "/iem",
          element: <InvisiNetEnterpriseManager />,
          loader,
        },
        {
          path: "/active-directory-dia",
          element: <ActiveDirectoryDIA />,
          loader,
        },
        {
          path: "/invisigate-or-controller",
          element: <InvisiGateOrController />,
          loader,
        },
        {
          path: "/configure-csr",
          element: <ConfigureCSR />,
          loader,
        },
        {
          path: "/manage-invisipoints",
          element: <ManageInvisipoints />,
          loader,
        },
        {
          path: "/manage-users",
          element: <ManageUsers />,
          loader,
        },
      ],
    },
  ],
  { basename: `/${import.meta.env.VITE_BASE_ROUTE_PATH}` },
);

export default RootRouter;
