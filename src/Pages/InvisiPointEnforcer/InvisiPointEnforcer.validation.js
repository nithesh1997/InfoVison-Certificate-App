import * as Yup from "yup";
import * as regex from "utils/RegularExpressions";
import { useTranslation } from "react-i18next";

const mandatoryMessage = "Dir FQDN is a mandatory field";
const invalidIP = "Enter a valid IP Address";
const invalidFormat =
  "Invalid format, enter a valid formar such as 14.234.212.23 or ec2-13.amazon.com";

function isValidIPV4() {
  return this.string(invalidIP)
    .matches(regex.IPv4, {
      message: invalidFormat,
      excludeEmptyStrings: true,
    })
    .required(mandatoryMessage);
}

function isValidDomain(message) {
  return this.test("isValidIPV4", message, function (value) {
    const { path, createError } = this;

    if (!value) {
      return createError({ path, message: message ?? mandatoryMessage });
    }

    if (value.length < 1) {
      return createError({ path, message: message ?? mandatoryMessage });
    }
    if (!value.match(regex.FQDN)) {
      if (!value.match(regex.IPv4)) {
        return createError({
          path,
          message: message ?? invalidFormat,
        });
      }
    }
    return true;
  });
}

Yup.addMethod(Yup.string, "isValidIPV4", isValidIPV4);
Yup.addMethod(Yup.mixed, "isValidDomain", isValidDomain);

export const ValidationSchema = () => {
  const { t } = useTranslation();
  return Yup.object().shape({
    customerName: Yup.string()
      .trim()
      .required(t("Common.Fields.Customer Name.Validations.Errors.Mandatory"))
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
    countryName: Yup.string()
      .trim()
      .required(t("Pages.Invisipoint.Country.Validations.Errors.Mandatory"))
      .matches(
        regex.countryISO,
        t("Pages.Invisipoint.Country.Validations.Errors.Country Should Be"),
      ),
    state: Yup.string()
      .trim()
      .required(
        t("Pages.Invisipoint.State Or Providence.Validations.Errors.Mandatory"),
      ),
    locality: Yup.string()
      .trim()
      .required(
        t("Pages.Invisipoint.Locality Name.Validations.Errors.Mandatory"),
      ),
    organizationName: Yup.string()
      .trim()
      .required(
        t("Pages.Invisipoint.Organization Name.Validations.Errors.Mandatory"),
      ),
    organizationUnitName: Yup.string()
      .trim()
      .required(
        t(
          "Pages.Invisipoint.Organization Unit Name.Validations.Errors.Mandatory",
        ),
      ),
    emailAddress: Yup.string()
      .trim()
      .email(t("Pages.Invisipoint.Email Address.Validations.Errors.Invalid")),
    invisigateIP: Yup.string()
      .trim()
      .when("$isAddInvisipoint", ([isAddInvisipoint], schema) => {
        return isAddInvisipoint
          ? schema.required(
              t(
                "Pages.Invisipoint.Invisigate Ip.Validations.Errors.Select Invisigate",
              ),
            )
          : schema;
      }),
    enabled: Yup.boolean().when(
      "$isAddInvisipoint",
      ([isAddInvisipoint], schema) => {
        return isAddInvisipoint
          ? schema.required(
              t("Pages.Invisipoint.Enabled.Validations.Errors.Select Option"),
            )
          : schema;
      },
    ),
    groups: Yup.string().when(
      "$isAddInvisipoint",
      ([isAddInvisipoint], schema) => {
        return isAddInvisipoint
          ? schema.required(
              t("Pages.Invisipoint.Groups.Validations.Errors.Select Option"),
            )
          : schema;
      },
    ),
    location: Yup.string()
      .trim()
      .when("$isAddInvisipoint", ([isAddInvisipoint], schema) => {
        return isAddInvisipoint
          ? schema.required(
              t("Pages.Invisipoint.Location.Validations.Errors.Mandatory"),
            )
          : schema;
      }),
    alg: Yup.string().when(
      "$isAddInvisipoint",
      ([isAddInvisipoint], schema) => {
        return isAddInvisipoint
          ? schema.required(
              t("Pages.Invisipoint.Algorithm.Validations.Errors.Mandatory"),
            )
          : schema;
      },
    ),
    timeout: Yup.number()
      .typeError(t("Pages.Invisipoint.Timeout.Validations.Errors.Invalid"))
      .min(
        3600,
        t("Pages.Invisipoint.Timeout.Validations.Errors.Timeout Range"),
      )
      .max(
        65534,
        t("Pages.Invisipoint.Timeout.Validations.Errors.Timeout Range"),
      )
      .when("$isAddInvisipoint", ([isAddInvisipoint], schema) => {
        return isAddInvisipoint
          ? schema.required(
              t("Pages.Invisipoint.Timeout.Validations.Errors.Mandatory"),
            )
          : schema;
      }),
    heartbeat_Interval: Yup.number()
      .typeError(
        t("Pages.Invisipoint.Heartbeat Interval.Validations.Errors.Invalid"),
      )
      .min(
        0,
        t(
          "Pages.Invisipoint.Heartbeat Interval.Validations.Errors.Value Range",
        ),
      )
      .max(
        1800,
        t(
          "Pages.Invisipoint.Heartbeat Interval.Validations.Errors.Value Range",
        ),
      )
      .when("$isAddInvisipoint", ([isAddInvisipoint], schema) => {
        return isAddInvisipoint
          ? schema.required(
              t(
                "Pages.Invisipoint.Heartbeat Interval.Validations.Errors.Mandatory",
              ),
            )
          : schema;
      }),
    dir_fqdn: Yup.mixed().when(
      "$isAddInvisipoint",
      ([isAddInvisipoint], schema) => {
        return isAddInvisipoint ? schema.isValidDomain() : schema;
      },
    ),
    destination: Yup.string()
      .trim()
      .when("$isAddInvisipoint", ([isAddInvisipoint], schema) => {
        return isAddInvisipoint
          ? schema.required(
              t("Pages.Invisipoint.Destination.Validations.Errors.Mandatory"),
            )
          : schema;
      }),
    tcp_tagging: Yup.string(
      t("Pages.Invisipoint.Tcp Tagging.Validations.Errors.Select Option"),
    ).when("$isAddInvisipoint", ([isAddInvisipoint], schema) => {
      return isAddInvisipoint
        ? schema.required(
            t("Pages.Invisipoint.Tcp Tagging.Validations.Errors.Mandatory"),
          )
        : schema;
    }),
    tac_mutual_auth: Yup.boolean().when(
      "$isAddInvisipoint",
      ([isAddInvisipoint], schema) => {
        return isAddInvisipoint
          ? schema.required(
              t(
                "Pages.Invisipoint.Tac Mutual Auth.Validations.Errors.Mandatory",
              ),
            )
          : schema;
      },
    ),
    udp: Yup.boolean().when(
      "$isAddInvisipoint",
      ([isAddInvisipoint], schema) => {
        return isAddInvisipoint
          ? schema.required(
              t("Pages.Invisipoint.UDP.Validations.Errors.Mandatory"),
            )
          : schema;
      },
    ),
    comment: Yup.string()
      .trim()
      .when("$isAddInvisipoint", ([isAddInvisipoint], schema) => {
        return isAddInvisipoint
          ? schema
              .min(
                4,
                t(
                  "Pages.Invisipoint.Comment.Validations.Errors.Must Atleast Character",
                ),
              )
              .max(
                256,
                t(
                  "Pages.Invisipoint.Comment.Validations.Errors.Must Not Exceed Character",
                ),
              )
          : schema;
      }),
  });
};
