/* Icons */
import { InvisiPointClientIcon } from "./AbundantIconElements/InvisiPointClientIcon";
import { InvisiPointEnforcerIcon } from "./AbundantIconElements/InvisiPointEnforcerIcon";
import { IEMIcon } from "./AbundantIconElements/IEMIcon";
import { ActiveDirectoryDIAIcon } from "./AbundantIconElements/ActiveDirectoryDIAIcon";
import { InvisiGateOrControllerIcon } from "./AbundantIconElements/InvisiGateOrControllerIcon";
import { HomeIcon } from "./AbundantIconElements/HomeIcon";
import { ConfigCsrDefaultIcon } from "./AbundantIconElements/ConfigCsrDefaultIcon";
import { ManageInvisipointsIcons } from "./AbundantIconElements/ManageInvisipointsIcons";
import { ManageUsersIcons } from "./AbundantIconElements/ManageUsersIcons";
import CertificateAuthorityIcon from "src/assets/light-mode/certificate-authority-configuration-icon.svg?react";

export const InitMenuState = (t) => {
  return [
    {
      name: t("Navigation.Home.Title"),
      path: "/home",
      iconElement: <HomeIcon />,
      isSelected: true,
      subMenu: [],
    },
    {
      name: "CA Configuration",
      path: "/ca-configuration",
      iconElement: <CertificateAuthorityIcon />,
      isSelected: false,
      subMenu: [],
    },
    {
      name: t("Navigation.Invisipoint Client.Title"),
      path: "/invisipoint-client",
      iconElement: <InvisiPointClientIcon />,
      isSelected: false,
      subMenu: [],
    },
    {
      name: t("Navigation.Invisipoint Enforcer.Title"),
      path: "/invisipoint-enforcer",
      iconElement: <InvisiPointEnforcerIcon />,
      isSelected: false,
      subMenu: [],
    },
    {
      name: t("Navigation.IEM.Title"),
      path: "/iem",
      iconElement: <IEMIcon />,
      isSelected: false,
      subMenu: [],
    },
    {
      name: t("Navigation.Active Directory Dia.Title"),
      path: "/active-directory-dia",
      iconElement: <ActiveDirectoryDIAIcon />,
      isSelected: false,
      subMenu: [],
    },
    {
      name: t("Navigation.Invisigate Or Controller.Title"),
      path: "/invisigate-or-controller",
      iconElement: <InvisiGateOrControllerIcon />,
      isSelected: false,
      subMenu: [],
    },
    {
      name: t("Navigation.Configure CSR.Title"),
      path: "/configure-csr",
      iconElement: <ConfigCsrDefaultIcon />,
      isSelected: false,
      subMenu: [],
    },
    {
      name: t("Navigation.Manage Invisipoints.Title"),
      path: "/manage-invisipoints",
      iconElement: <ManageInvisipointsIcons />,
      isSelected: false,
      subMenu: [],
    },
    {
      name: t("Navigation.Manage Users.Title"),
      path: "/manage-users",
      iconElement: <ManageUsersIcons />,
      isSelected: false,
      subMenu: [],
    },
  ];
};
