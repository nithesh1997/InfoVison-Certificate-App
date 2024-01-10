import * as React from "react";
import {
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { Styled } from "../InvisiPointEnforcer.style";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ActionButton } from "src/style/ActionButton/ActionButton";
import { ValidationSchema } from "../InvisiPointEnforcer.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import TooltipIconArrow from "src/style/TextField/TooltipIconArrow";
import { CloseRounded } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Notify from "src/style/Notify";
import axios from "axios";
import downloadFile from "src/utils/downloadFile";
import { Trans, useTranslation } from "react-i18next";
import LazySpinner from "src/style/LazySpinner";

const FQDN_SUFFIX = `.invisinet.com`;

const initNames = () => ({
  value: "",
  isDisabled: true,
});

const endpointEnabled = [
  { id: 1, value: true, view: "True" },
  { id: 2, value: false, view: "False" },
];

const endpointGroups = [
  { id: 1, value: "HR" },
  { id: 2, value: "Engr" },
  { id: 3, value: "Cats" },
];

const algorithmOptions = [
  { id: 1, value: "HMAC-SHA-256" },
  { id: 2, value: "HMAC-SHA-256-64" },
];

const endpointTCPTag = [
  { id: 1, value: "SEQ" },
  { id: 2, value: "SID" },
];

const endpointTACMutaul = [
  { id: 1, value: true, view: "True" },
  { id: 2, value: false, view: "False" },
];

const endpointUDP = [
  { id: 1, value: true, view: "Enabled" },
  { id: 2, value: false, view: "Disabled" },
];

const initNotifyState = { isDisplay: false, type: "", topic: "", message: "" };

const SuperUser = (props) => {
  const [isTriggerSpinner, setIsTriggerSpinner] = React.useState(false);
  const [runEffect, setRunEffect] = React.useState("");
  const [isAddInvisipoint, setIsAddInvisipoint] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [organizationUnitName, setOrganizationUnitName] =
    React.useState(initNames);
  const [loading, setLoading] = React.useState(false);

  const [notifyState, setNotifyState] = React.useState(initNotifyState);

  const { t } = useTranslation();

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
    context: { isAddInvisipoint },
    defaultValues: {
      /* Section 1 */
      customerName: "",
      clientFqdn: "",
      countryName: "",
      state: "",
      locality: "",
      organizationName: "",
      emailAddress: "",
      organizationUnitName: "EPC",
      /* Section 2 */
      invisigateIP: "",
      groups: "Cats",
      enabled: false,
      location: "",
      alg: "HMAC-SHA-256",
      timeout: 3600,
      heartbeat_Interval: 0,
      dir_fqdn: "",
      destination: "",
      tcp_tagging: 1,
      tac_mutual_auth: true,
      udp: true,
      roles: 128,
      comment: "",
    },
  });

  const closeNotifyHandler = () => {
    setLoading(false);
    setDisabled(false);
    setNotifyState(initNotifyState);
  };

  const submitHandler = async (data, e) => {
    e.preventDefault();
    setDisabled(true);
    setLoading(true);

    axios({
      method: "post",
      url: `invisipoint/enforcer/download`,
      responseType: "arraybuffer",
      data: {
        customerName: data.customerName,
        fqdn: data.clientFqdn,
        isInvisipointConfig: isAddInvisipoint,
        invisigateIp: isAddInvisipoint ? data.invisigateIP : undefined,
        csrConfig: {
          emailAddress: data.emailAddress,
          countryName: data.countryName,
          stateName: data.state,
          location: data.locality,
          organizationName: data.organizationName,
          organizationUnitName: data.organizationUnitName,
        },
        invisipointConfig: isAddInvisipoint
          ? {
              enabled: data.enabled,
              group: data.groups,
              location: data.location,
              algorithm: data.alg,
              timeout: data.timeout,
              heartbeatInterval: data.heartbeat_Interval,
              dirFqdn: data.dir_fqdn,
              destination: data.destination,
              tcpTagging: data.tcp_tagging,
              tagMutualAuth: data.tac_mutual_auth,
              udpEnable: data.udp,
              comments: data.comment,
              roles: 128,
            }
          : undefined,
      },
    })
      .then((response) => {
        reset();
        downloadFile(response);
        setTimeout(() => {
          setDisabled(false);
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
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

  const resetFields = React.useCallback(() => {
    reset();
  }, [reset]);

  const toggleOrganizatioUnitNameMode = (isEdit) => {
    setOrganizationUnitName((oldState) => ({
      ...oldState,
      isDisabled: !isEdit,
      value: !isEdit ? oldState.initialValue : oldState.value,
    }));
  };

  React.useEffect(() => {
    if (runEffect === "update-invisipoint-configuration") {
      const [payload] = props.gateways.filter(({ invisigateIp }) => {
        return invisigateIp === getValues("invisigateIP");
      });

      const config = payload?.invisipointConfig;

      if (payload) {
        const groups = config?.groups;
        const location = config?.location;
        const algorithm = config?.algorithm;
        const timeout = config?.timeout;
        const heartbeatInterval = config?.heartbeatInterval;
        const dirFqdn = config?.dirFqdn;
        const destination = config?.destination;
        const tcpTagging = config?.tcpTagging;
        const tagMutualAuth = config?.tagMutualAuth;
        const udpEnable = config?.udpEnable;
        const comments = config?.comments;

        groups && setValue("groups", groups);
        location && setValue("location", location);
        algorithm && setValue("alg", algorithm);
        timeout && setValue("timeout", timeout);
        heartbeatInterval && setValue("heartbeat_Interval", heartbeatInterval);
        dirFqdn && setValue("dir_fqdn", dirFqdn);
        destination && setValue("destination", destination);
        tcpTagging && setValue("tcp_tagging", tcpTagging);
        tagMutualAuth && setValue("tac_mutual_auth", tagMutualAuth);
        udpEnable && setValue("udp", udpEnable);
        comments && setValue("comment", comments);
      } else {
        resetFields();
      }

      setRunEffect("");
    }
  }, [
    getValues,
    organizationUnitName,
    props.gateways,
    resetFields,
    runEffect,
    setValue,
  ]);

  React.useEffect(() => {
    if (runEffect === "update-invisipoint-configuration") {
      setIsTriggerSpinner(true);

      const { id } = props.gateways.filter(
        (gateway) => gateway.invisigateIp === getValues("invisigateIP"),
      )[0];

      axios({
        method: "get",
        url: `/invisigate-info?${id}`,
      })
        .then((response) => {
          const payload = response.data;
          const config = payload?.invisipointConfig;

          if (payload) {
            const enabled = config?.enabled;
            const groups = config?.groups;
            const location = config?.location;
            const algorithm = config?.algorithm;
            const timeout = config?.timeout;
            const heartbeatInterval = config?.heartbeatInterval;
            const dirFqdn = config?.dirFqdn;
            const destination = config?.destination;
            const tcpTagging = config?.tcpTagging;
            const tagMutualAuth = config?.tagMutualAuth;
            const udpEnable = config?.udpEnable;
            const comments = config?.comments;

            organizationUnitName &&
              setValue("organizationUnitName", organizationUnitName);
            enabled &&
              typeof enabled === "boolean" &&
              setValue("enabled", enabled);
            groups && setValue("groups", groups);
            location && setValue("location", location);
            algorithm && setValue("alg", algorithm);
            timeout && setValue("timeout", timeout);
            heartbeatInterval &&
              setValue("heartbeat_Interval", heartbeatInterval);
            dirFqdn && setValue("dir_fqdn", dirFqdn);
            destination && setValue("destination", destination);
            tcpTagging && setValue("tcp_tagging", tcpTagging);
            tagMutualAuth && setValue("tac_mutual_auth", tagMutualAuth);
            udpEnable && setValue("udp", udpEnable);
            comments && setValue("comment", comments);
          } else {
            resetFields();
          }

          setIsTriggerSpinner(false);
          setRunEffect("");
        })
        .catch((response) => {
          const payload = response.response;

          setNotifyState({
            isDisplay: true,
            type: "error",
            topic: payload?.error ?? `Error ${response.statusCode}`,
            message: payload?.message ?? response.message,
          });

          setRunEffect("");
        });
    }
  }, [
    getValues,
    organizationUnitName,
    props.gateways,
    resetFields,
    runEffect,
    setValue,
  ]);

  React.useEffect(() => {
    axios({
      method: "get",
      url: "/csr",
    })
      .then((response) => {
        const payload = response.data;
        if (payload) {
          const PartFQDN = payload?.PartFQDN;
          const countryName = payload?.countryName;
          const stateName = payload?.stateName;
          const location = payload?.location;
          const organizationName = payload?.organizationName;
          const organizationUnitName = payload?.organizationUnitName;
          const clientFqdn = payload?.userFqdnSuffix;

          PartFQDN && setValue("clientFqdn", PartFQDN);
          countryName && setValue("countryName", countryName);
          stateName && setValue("state", stateName);
          location && setValue("locality", location);
          organizationName && setValue("organizationName", organizationName);
          organizationUnitName &&
            setValue("organizationUnitName", organizationUnitName);
          clientFqdn && setValue("clientFqdn", clientFqdn);
        } else {
          resetFields();
        }
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
  }, [resetFields, setValue]);

  return (
    <>
      <Styled.MainContainer>
        <Styled.FloatContainer $display={isTriggerSpinner}>
          <LazySpinner />
        </Styled.FloatContainer>

        <Styled.SectionTitle>
          {t("Pages.Invisipoint.Certificate Title")}
        </Styled.SectionTitle>

        <form>
          {/* Section 1 */}
          <>
            <Styled.RowContainer>
              <Controller
                control={control}
                name="customerName"
                render={({ field }) => (
                  <TextField
                    {...field}
                    onBlur={(event) => {
                      field.onBlur(event);
                      setTimeout(() => {
                        if (
                          event.target.value &&
                          !errors.customerName &&
                          !getValues("clientFqdn")
                        ) {
                          setValue(
                            "clientFqdn",
                            `${event.target.value}${FQDN_SUFFIX}`,
                          );
                        }

                        if (
                          event.target.value &&
                          !errors.customerName &&
                          getValues("clientFqdn")
                        ) {
                          setValue(
                            "clientFqdn",
                            `${event.target.value}.${getValues("clientFqdn")}`,
                          );
                        }
                      }, 100);
                    }}
                    id="customer-name"
                    label={t("Common.Fields.Customer Name.Title")}
                    required
                    fullWidth
                    variant="outlined"
                    error={!!errors.customerName}
                    helperText={errors.customerName?.message}
                    InputProps={{
                      sx: { height: 50 },
                      endAdornment: (
                        <InputAdornment position="end">
                          <TooltipIconArrow
                            textContent={t(
                              "Common.Fields.Customer Name.Tool Tip",
                            )}
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
                name="clientFqdn"
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="client-fqdn"
                    label={t("Common.Fields.Client Fqdn.Title")}
                    required
                    fullWidth
                    variant="outlined"
                    error={!!errors.clientFqdn}
                    helperText={errors.clientFqdn?.message}
                    InputProps={{
                      sx: { height: 50 },
                      endAdornment: (
                        <InputAdornment position="end">
                          <TooltipIconArrow
                            textContent={
                              <>
                                <p>
                                  {t(
                                    "Common.Fields.Client Fqdn.Tool Tip.Title",
                                  )}
                                </p>

                                <ul style={{ paddingLeft: "1rem" }}>
                                  <li style={{ margin: "0.2rem 0" }}>
                                    <Trans
                                      i18nKey={
                                        "Common.Fields.Client Fqdn.Tool Tip.List.Fqdn Example"
                                      }
                                      components={[
                                        "(FQDN)",
                                        "invisinet.client-name.com",
                                      ]}
                                    >
                                      Valid Fully Qualified Domain Name{" "}
                                      <b>(FQDN)</b> such as{" "}
                                      <code>invisinet.client-name.com</code>.
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
                    id="country-name"
                    label={t("Pages.Invisipoint.Country.Title")}
                    required
                    fullWidth
                    variant="outlined"
                    error={!!errors.countryName}
                    helperText={errors.countryName?.message}
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
                    id="state"
                    label={t("Pages.Invisipoint.State Or Providence.Title")}
                    required
                    fullWidth
                    variant="outlined"
                    error={!!errors.state}
                    helperText={errors.state?.message}
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
                    id="locality"
                    label={t("Pages.Invisipoint.Locality Name.Title")}
                    required
                    fullWidth
                    variant="outlined"
                    error={!!errors.locality}
                    helperText={errors.locality?.message}
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
                    id="organization-name"
                    label={t("Pages.Invisipoint.Organization Name.Title")}
                    required
                    fullWidth
                    variant="outlined"
                    error={!!errors.organizationName}
                    helperText={errors.organizationName?.message}
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
                    id="organization-unit-name"
                    label={t("Pages.Invisipoint.Organization Unit Name.Title")}
                    fullWidth
                    variant="outlined"
                    disabled={organizationUnitName.isDisabled || disabled}
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
                    id="email-address"
                    name="emailAddress"
                    label={t("Pages.Invisipoint.Email Address.Title")}
                    fullWidth
                    variant="outlined"
                    error={!!errors.emailAddress}
                    helperText={errors.emailAddress?.message}
                    InputProps={{ sx: { height: 50 } }}
                  />
                )}
              />
            </Styled.RowContainer>
          </>

          {/* Toggle Section 2 */}
          <Styled.Box>
            <FormControlLabel
              control={
                <Styled.CheckBox
                  checked={isAddInvisipoint}
                  onChange={() => setIsAddInvisipoint((value) => !value)}
                  disabled={disabled}
                />
              }
              label={t("Pages.Invisipoint.Check Box.Title")}
              style={{ userSelect: "none" }}
            />
          </Styled.Box>

          {/* Section 2 */}
          {isAddInvisipoint ? (
            <>
              <Styled.SectionTitle>
                {t("Pages.Invisipoint.Invisipoint Title")}
              </Styled.SectionTitle>

              <Styled.RowContainer>
                <Controller
                  control={control}
                  name="invisigateIP"
                  rules={{
                    onChange: () => {
                      setRunEffect("update-invisipoint-configuration");
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="select-console"
                      label={t("Pages.Invisipoint.Invisigate Ip.Title")}
                      select
                      fullWidth
                      variant="outlined"
                      disabled={disabled}
                      error={!!errors.invisigateIP}
                      helperText={errors.invisigateIP?.message}
                      InputProps={{ sx: { height: 50 } }}
                    >
                      {props.gateways.map((gateway) => (
                        <MenuItem key={gateway.id} value={gateway.invisigateIp}>
                          {gateway.invisigateDisplayName} (
                          {gateway.invisigateIp})
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="enabled"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="enabled"
                      label={t("Pages.Invisipoint.Enabled.Title")}
                      select
                      fullWidth
                      variant="outlined"
                      disabled={disabled}
                      error={!!errors.enabled}
                      helperText={errors.enabled?.message}
                      InputProps={{ sx: { height: 50 } }}
                    >
                      {endpointEnabled.map((option) => (
                        <MenuItem key={option.id} value={option.value}>
                          {option.view}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="groups"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="groups"
                      label={t("Pages.Invisipoint.Groups.Title")}
                      select
                      fullWidth
                      variant="outlined"
                      disabled={disabled}
                      error={!!errors.groups}
                      helperText={errors.groups?.message}
                      InputProps={{ sx: { height: 50 } }}
                    >
                      {endpointGroups.map((option) => (
                        <MenuItem key={option.id} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Styled.RowContainer>

              <Styled.RowContainer>
                <Controller
                  control={control}
                  name="location"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="location"
                      label={t("Pages.Invisipoint.Location.Title")}
                      fullWidth
                      variant="outlined"
                      disabled={disabled}
                      error={!!errors.location}
                      helperText={errors.location?.message}
                      InputProps={{ sx: { height: 50 } }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="alg"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="algorithm"
                      label={t("Pages.Invisipoint.Algorithm.Title")}
                      fullWidth
                      select
                      variant="outlined"
                      disabled={disabled}
                      error={!!errors.alg}
                      helperText={errors.alg?.message}
                      InputProps={{ sx: { height: 50 } }}
                    >
                      {algorithmOptions.map((option) => (
                        <MenuItem key={option.id} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="timeout"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="timeout"
                      label={t("Pages.Invisipoint.Timeout.Title")}
                      fullWidth
                      variant="outlined"
                      disabled={disabled}
                      error={!!errors.timeout}
                      helperText={errors.timeout?.message}
                      InputProps={{ sx: { height: 50 } }}
                    />
                  )}
                />
              </Styled.RowContainer>

              <Styled.RowContainer>
                <Controller
                  control={control}
                  name="heartbeat_Interval"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="heartbeat-interval"
                      label={t("Pages.Invisipoint.Heartbeat Interval.Title")}
                      variant="outlined"
                      fullWidth
                      disabled={disabled}
                      error={!!errors.heartbeat_Interval}
                      helperText={errors.heartbeat_Interval?.message}
                      InputProps={{ sx: { height: 50 } }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="dir_fqdn"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="dir-fqdn"
                      label={t("Pages.Invisipoint.Dir Fqdn.Title")}
                      fullWidth
                      variant="outlined"
                      error={!!errors.dir_fqdn}
                      helperText={errors.dir_fqdn?.message}
                      InputProps={{ sx: { height: 50 } }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="destination"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="destination"
                      label={t("Pages.Invisipoint.Destination.Title")}
                      fullWidth
                      variant="outlined"
                      disabled={disabled}
                      error={!!errors.destination}
                      helperText={errors.destination?.message}
                      InputProps={{ sx: { height: 50 } }}
                    />
                  )}
                />
              </Styled.RowContainer>

              <Styled.RowContainer>
                <Controller
                  name="tcp_tagging"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="tcp-tagging"
                      label={t("Pages.Invisipoint.Tcp Tagging.Title")}
                      select
                      fullWidth
                      variant="outlined"
                      disabled={disabled}
                      error={!!errors.tcp_tagging}
                      helperText={errors.tcp_tagging?.message}
                      InputProps={{ sx: { height: 50 } }}
                    >
                      {endpointTCPTag.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="tac_mutual_auth"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="tac-mutual-auth"
                      label={t("Pages.Invisipoint.Tac Mutual Auth.Title")}
                      select
                      fullWidth
                      variant="outlined"
                      disabled={disabled}
                      error={!!errors.tac_mutual_auth}
                      helperText={errors.tac_mutual_auth?.message}
                      InputProps={{ sx: { height: 50 } }}
                    >
                      {endpointTACMutaul.map((option) => (
                        <MenuItem key={option.id} value={option.value}>
                          {option.view}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="udp"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="udp"
                      label={t("Pages.Invisipoint.UDP.Title")}
                      select
                      fullWidth
                      variant="outlined"
                      disabled={disabled}
                      error={!!errors.udp}
                      helperText={errors.udp?.message}
                      InputProps={{ sx: { height: 50 } }}
                    >
                      {endpointUDP.map((option) => (
                        <MenuItem key={option.id} value={option.value}>
                          {option.view}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Styled.RowContainer>

              <Styled.RowContainer>
                <Controller
                  control={control}
                  name="comment"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="comment"
                      label={t("Pages.Invisipoint.Comment.Title")}
                      fullWidth
                      variant="outlined"
                      disabled={disabled}
                      error={!!errors.comment}
                      helperText={errors.comment?.message}
                      InputProps={{ sx: { height: 50 } }}
                    />
                  )}
                />
              </Styled.RowContainer>
            </>
          ) : null}

          <Styled.ButtonContainer>
            <ActionButton
              variant="outlined"
              backgroundColor=""
              buttonName={t("Common.Button Generic.Btn Reset")}
              disabled={disabled || loading}
              onClick={resetFields}
            />

            <ActionButton
              variant="contained"
              backgroundColor="primary"
              buttonName={
                loading ? (
                  <Styled.Spinner size={25} />
                ) : (
                  t("Common.Button Generic.Btn Submit")
                )
              }
              disabled={loading}
              onClick={handleSubmit(submitHandler)}
            />
          </Styled.ButtonContainer>
        </form>
      </Styled.MainContainer>

      <Notify {...notifyState} closeHandler={closeNotifyHandler} />
    </>
  );
};

export default SuperUser;
