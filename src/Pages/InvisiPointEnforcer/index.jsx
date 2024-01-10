import axios from "axios";
import * as React from "react";
import Notify from "src/style/Notify";
import SuperUser from "./Variants/SuperUser";

const initNotifyState = { isDisplay: false, type: "", topic: "", message: "" };

const InvisiPointEnforcer = () => {
  const [gateways, setGateways] = React.useState([]);
  const [notifyState, setNotifyState] = React.useState(initNotifyState);

  const closeNotifyHandler = () => {
    setNotifyState(initNotifyState);
  };

  React.useEffect(() => {
    axios({
      method: "get",
      url: "/invisigate-info/list",
    })
      .then((response) => {
        const payload = response.data;
        setGateways(payload);
      })
      .catch((response) => {
        const payload = response.response;

        setNotifyState({
          isDisplay: true,
          type: "error",
          topic: payload?.error ?? `Error ${response.statusCode}`,
          message: payload?.message ?? response.message,
        });
      });
  }, []);

  return (
    <>
      <SuperUser gateways={gateways} />

      <Notify {...notifyState} closeHandler={closeNotifyHandler} />
    </>
  );
};

export default InvisiPointEnforcer;
