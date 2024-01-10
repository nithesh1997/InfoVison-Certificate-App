import axios from "axios";
import * as React from "react";
import { useSelector } from "react-redux";
import Notify from "src/style/Notify";
import SuperUser from "./Variants/SuperUser";
import User from "./Variants/User";

const initNotifyState = { isDisplay: false, type: "", topic: "", message: "" };

const InvisiPointClient = () => {
  const userStore = useSelector((store) => store.user);
  const isSuper = userStore.preferences.isSuper;

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
      {isSuper ? (
        <SuperUser gateways={gateways} />
      ) : (
        <User gateways={gateways} />
      )}

      <Notify {...notifyState} closeHandler={closeNotifyHandler} />
    </>
  );
};

export default InvisiPointClient;
