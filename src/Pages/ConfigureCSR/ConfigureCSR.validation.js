import * as Yup from "yup";
import * as regex from "utils/RegularExpressions";
import { useTranslation } from "react-i18next";

export const ValidationSchema = () => {
  const { t } = useTranslation();
  return Yup.object().shape({
    // customerName: Yup.string()
    //   .required(t("Common.Fields.Customer Name.Validations.Errors.Mandatory"))
    //   .min(
    //     4,
    //     t(
    //       "Common.Fields.Customer Name.Validations.Errors.Must Atleast Character",
    //     ),
    //   )
    //   .max(
    //     64,
    //     t(
    //       "Common.Fields.Customer Name.Validations.Errors.Must Not Exceed Character",
    //     ),
    //   )
    //   .matches(
    //     regex.username,
    //     t(
    //       "Common.Fields.Customer Name.Validations.Errors.Alaphanumeric Character",
    //     ),
    //   ),
    clientFqdnSuffix: Yup.string()
      .trim()
      .required(
        t(
          "Pages.Configure CSR Defaults.Client Fqdn Suffix.Validations.Errors.Mandatory",
        ),
      )
      .matches(
        regex.FQDN_Suffix,
        t(
          "Pages.Configure CSR Defaults.Client Fqdn Suffix.Validations.Errors.Invalid",
        ),
      ),
    countryName: Yup.string()
      .required(
        t("Pages.Configure CSR Defaults.Country.Validations.Errors.Invalid"),
      )
      .matches(
        regex.countryISO,
        t(
          "Pages.Configure CSR Defaults.Country.Validations.Errors.Country Should Be",
        ),
      ),
    state: Yup.string()
      .trim()
      .required(
        t(
          "Pages.Configure CSR Defaults.State Or Providence.Validations.Errors.Mandatory",
        ),
      ),
    locality: Yup.string()
      .trim()
      .required(
        t(
          "Pages.Configure CSR Defaults.Locality Name.Validations.Errors.Mandatory",
        ),
      ),
    organizationName: Yup.string()
      .trim()
      .required(
        t(
          "Pages.Configure CSR Defaults.Organization Name.Validations.Errors.Mandatory",
        ),
      ),
    organizationUnitName: Yup.string().required(
      t(
        "Pages.Configure CSR Defaults.Organization Unit Name.Validations.Errors.Mandatory",
      ),
    ),
    emailAddress: Yup.string()
      .trim()
      .email(
        t(
          "Pages.Configure CSR Defaults.Email Address.Validations.Errors.Invalid",
        ),
      ),
  });
};
