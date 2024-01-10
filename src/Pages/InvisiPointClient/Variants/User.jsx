import {
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { Styled } from "../InvisiPointClient.style";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ActionButton } from "src/style/ActionButton/ActionButton";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import React, { useCallback, useState } from "react";
import TooltipIconArrow from "src/style/TextField/TooltipIconArrow";
import Notify from "src/style/Notify";
import axios from "axios";
import downloadFile from "src/utils/downloadFile";
import * as Yup from "yup";
import * as regex from "utils/RegularExpressions";
import { Trans, useTranslation } from "react-i18next";

const FQDN_SUFFIX = `.invisinet.com`;
const initNotifyState = { isDisplay: false, type: "", topic: "", message: "" };

const User = (props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [notifyState, setNotifyState] = useState(initNotifyState);
  const [isAddInvisipoint, setIsAddInvisipoint] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    context: { isAddInvisipoint },
    defaultValues: {
      customerName: "",
      clientFqdn: "",
    },
    resolver: yupResolver(
      Yup.object().shape({
        customerName: Yup.string()
          .trim()
          .required(
            t("Common.Fields.Customer Name.Validations.Errors.Mandatory"),
          )
          .min(
            4,
            t(
              "Common.Fields.Customer Name.Validations.Errors.Must Atleast Character",
            ),
          )
          .max(
            64,
            t(
              "Common.Fields.Customer Name.Validations.Errors.Must Not Exceed Character",
            ),
          )
          .matches(
            regex.username,
            t(
              "Common.Fields.Customer Name.Validations.Errors.Alaphanumeric Character",
            ),
          ),
        clientFqdn: Yup.string()
          .trim()
          .required(t("Common.Fields.Client Fqdn.Validations.Errors.Mandatory"))
          .matches(
            regex.FQDN,
            t("Common.Fields.Client Fqdn.Validations.Errors.Invalid"),
          ),
        invisigateIP: Yup.string().when(
          "$isAddInvisipoint",
          ([isAddInvisipoint], schema) => {
            return isAddInvisipoint
              ? schema.required(
                  t(
                    "Pages.Invisipoint.Invisigate Ip.Validations.Errors.Select Invisigate",
                  ),
                )
              : schema;
          },
        ),
      }),
    ),
  });

  const closeNotifyHandler = () => {
    setLoading(false);
    setDisabled(false);
    setNotifyState(initNotifyState);
  };

  const resetFields = useCallback(() => {
    reset();
  }, [reset]);

  const onSubmit = (data) => {
    setLoading(true);
    setDisabled(true);

    axios({
      method: "post",
      url: `invisipoint/client/download/invisigate`,
      responseType: "arraybuffer",
      data: {
        customerName: data.customerName,
        fqdn: data.clientFqdn,
        invisigateId: isAddInvisipoint ? data.invisigateIP : undefined,
        isInvisipointConfig: isAddInvisipoint,
      },
    })
      .then((response) => {
        downloadFile(response);
        setDisabled(false);
        setLoading(false);
      })
      .catch((error) => {
        setDisabled(false);
        setLoading(false);

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
    axios({
      method: "get",
      url: "/csr",
    })
      .then((response) => {
        const payload = response.data;
        if (payload) {
          const PartFQDN = payload?.userFqdnSuffix;
          PartFQDN && setValue("clientFqdn", PartFQDN);
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
        <Styled.SectionTitle>Certificate Parameters</Styled.SectionTitle>

        <form>
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
                  id="customername"
                  label={t("Common.Fields.Customer Name.Title")}
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
                  id="clientFqdn"
                  name="clientFqdn"
                  label={t("Common.Fields.Client Fqdn.Title")}
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
                                {t("Common.Fields.Client Fqdn.Tool Tip.Title")}
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
          </Styled.RowContainer>

          <Styled.Box>
            <FormControlLabel
              style={{ userSelect: "none" }}
              label={t("Pages.Invisipoint.Check Box.Title")}
              control={
                <Styled.CheckBox
                  checked={isAddInvisipoint}
                  onChange={() => setIsAddInvisipoint((value) => !value)}
                  disabled={disabled}
                />
              }
            />
          </Styled.Box>

          {isAddInvisipoint ? (
            <Styled.RowContainer>
              <Controller
                control={control}
                name="invisigateIP"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("Pages.Invisipoint.Invisigate Ip.Title")}
                    select
                    fullWidth
                    variant="outlined"
                    error={!!errors.invisigateIP?.message}
                    helperText={errors.invisigateIP?.message}
                    InputProps={{ sx: { height: 50 } }}
                  >
                    {props.gateways.map((gateway) => (
                      <MenuItem key={gateway.id} value={gateway.id}>
                        {gateway.invisigateDisplayName} ({gateway.invisigateIp})
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Styled.RowContainer>
          ) : null}

          <Styled.ButtonContainer>
            <ActionButton
              variant="outlined"
              backgroundColor=""
              buttonName={t("Common.Button Generic.Btn Reset")}
              disabled={loading}
              onClick={resetFields}
            />

            <ActionButton
              variant="contained"
              backgroundColor="primary"
              buttonName={
                loading ? (
                  <Styled.Spinner size={20} />
                ) : (
                  t("Common.Button Generic.Btn Submit")
                )
              }
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
            />
          </Styled.ButtonContainer>
        </form>
      </Styled.MainContainer>

      <Notify {...notifyState} closeHandler={closeNotifyHandler} />
    </>
  );
};

export default User;
