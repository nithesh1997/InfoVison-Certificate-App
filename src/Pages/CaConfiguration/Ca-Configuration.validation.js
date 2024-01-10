import * as Yup from "yup";
import * as regex from "utils/RegularExpressions";

const PRIVATE_KEY = "Private Key";
const WINDOWS_CA = "Windows CA";

export const ValidationSchema = () => {
  return Yup.object().shape({
    host: Yup.string()
      .trim()
      .when("$selectedValue", ([selectedValue], schema) => {
        if (selectedValue === WINDOWS_CA) {
          return schema.required(
            "Host Address is required Eg:<https|http>://sub-domain.domain.top-domain",
          );
          //   .test("ipv4OrIpv6", "Host Address isn't valid IP Address", (value) => {
          //     const ipv4Regex = regex.IPv4;
          //     const ipv6Regex = regex.IPv6;
          //     return ipv4Regex.test(value) || ipv6Regex.test(value);
          //   })
        }

        return schema.optional();
      }),
    /* No Longer Needed
    CAName: Yup.string()
      .trim()
      .when("$selectedValue", ([selectedValue], schema) => {
        if (selectedValue === WINDOWS_CA) {
          return schema
            .required("CA Name is a mandatory field.")
            .min(4, "CA Name must be atleast 4 characters")
            .max(64, "CA Name must not exceed 64 characters")
            .matches(
              regex.username,
              "Value Should be Alphanumeric characters and No Space are allowed.",
            );
        }

        return schema.optional();
      }),
      */
    username: Yup.string()
      .trim()
      .when("$selectedValue", ([selectedValue], schema) => {
        if (selectedValue === WINDOWS_CA) {
          return schema
            .required("Username is a mandatory field.")
            .min(4, "Username must be atleast 4 characters")
            .max(64, "Username must not exceed 64 characters")
            .matches(
              regex.username,
              "Value Should be Alphanumeric characters and No Space are allowed.",
            );
        }

        return schema.optional();
      }),
    password: Yup.string()
      .trim()
      .when("$selectedValue", ([selectedValue], schema) => {
        if (selectedValue === WINDOWS_CA) {
          return schema
            .required("Password is a mandatory field.")
            .min(4, "Password must be atleast 4 characters");
          //  .max(15, "Password must not exceed 15 characters")
        }

        return schema.optional();
      }),
    domain: Yup.string()
      .trim()
      .when("$selectedValue", ([selectedValue], schema) => {
        if (selectedValue === WINDOWS_CA) {
          return schema
            .optional()
            .matches(regex.FQDN, "Domain Address is invalid");
        }

        return schema.optional();
      }),
    /* workStation: Yup.string().trim().optional(), */ // No Longer Needed
  });
};
