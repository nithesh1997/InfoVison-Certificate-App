import { useRouteError } from "react-router-dom";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import Common from "./Common";
import Error401 from "./401";
import Error404 from "./404";

const ErrorPage = () => {
  const error = useRouteError();

  const { t } = useTranslation();

  return (
    <Box
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
      }}
    >
      <Box style={{ textAlign: "center" }}>
        {error.status === 404 ? (
          <Error404 error={error} t={t} />
        ) : error.status === 401 ? (
          <Error401 error={error} t={t} />
        ) : (
          <Common error={error} t={t} />
        )}
      </Box>
    </Box>
  );
};

export default ErrorPage;
