import * as Yup from "yup";
import * as regex from "utils/RegularExpressions";
import { useTranslation } from "react-i18next";

const customerNameRegex = regex.username;
export const ValidationSchema = () => {
  const { t } = useTranslation();
  return Yup.object().shape({
    username: Yup.string()
      .required(t("Pages.Login.User Name.Validations.Errors.Mandatory"))
      .matches(
        customerNameRegex,
        t("Pages.Login.User Name.Validations.Errors.Only Alpha-Numeric"),
      ),
    password: Yup.string().required(
      t("Pages.Login.Password.Validations.Errors.Mandatory"),
    ),
  });
};
