import InvisiPointClientIcon from "assets/light-mode/invisipoint-client-icon.svg";
import InvisiPointEnforcerIcon from "assets/light-mode/invisipoint-enforcer-icon.svg";
import IEMIcon from "assets/light-mode/iem-icon.svg";
import ActiveDirectoryDIAIcon from "assets/light-mode/active-directory-dia-icon.svg";
import InvisiGateOrControllerIcon from "assets/light-mode/invisigate-or-controller-icon.svg";

import ManageUsersIcon from "assets/light-mode/manage-users-icon.svg";

import ManageInvisipointsIcon from "assets/light-mode/manage-invisipoints-icon.svg";

import ConfigureCsrDefaultsIcon from "assets/light-mode/configure-csr-defaults-icon.svg";

import CertificateAuthorityIcon from "assets/light-mode/certificate-authority-configuration-icon-blue.svg";

let cards = [
  {
    label: "CA Configuration",
    src: CertificateAuthorityIcon,
    path: "/ca-configuration",
    translationMap: "Navigation.Certificate Authority Configuration.Title",
    xs: 12,
    sm: 6,
    md: 4,
    lg: 4,
    id: 1,
  },
  {
    label: "InvisiPoint Client",
    src: InvisiPointClientIcon,
    path: "/invisipoint-client",
    translationMap: "Navigation.Invisipoint Client.Title",
    xs: 12,
    sm: 6,
    md: 4,
    lg: 4,
    id: 1,
  },
  {
    label: "InvisiPoint Enforcer",
    src: InvisiPointEnforcerIcon,
    path: "/invisipoint-enforcer",
    translationMap: "Navigation.Invisipoint Enforcer.Title",
    xs: 12,
    sm: 6,
    md: 4,
    lg: 4,
    id: 2,
  },
  {
    label: "IEM",
    src: IEMIcon,
    path: "/iem",
    translationMap: "Navigation.IEM.Title",
    xs: 12,
    sm: 6,
    md: 4,
    lg: 4,
    id: 3,
  },
  {
    label: "Active Directory DIA",
    src: ActiveDirectoryDIAIcon,
    path: "/active-directory-dia",
    translationMap: "Navigation.Active Directory Dia.Title",
    xs: 12,
    sm: 6,
    md: 4,
    lg: 4,
    id: 4,
  },
  {
    label: "Invisigate/Controller",
    src: InvisiGateOrControllerIcon,
    path: "/invisigate-or-controller",
    translationMap: "Navigation.Invisigate Or Controller.Title",
    xs: 12,
    sm: 6,
    md: 4,
    lg: 4,
    id: 6,
  },
  {
    label: "Configure CSR Defaults",
    src: ConfigureCsrDefaultsIcon,
    path: "/configure-csr",
    translationMap: "Navigation.Configure CSR.Title",
    xs: 12,
    sm: 6,
    md: 4,
    lg: 4,
    id: 6,
  },
  {
    label: "Manage Invisipoints",
    src: ManageInvisipointsIcon,
    path: "/manage-invisipoints",
    translationMap: "Navigation.Manage Invisipoints.Title",
    xs: 12,
    sm: 6,
    md: 4,
    lg: 4,
    id: 6,
  },
  {
    label: "Manage Users",
    src: ManageUsersIcon,
    path: "/manage-users",
    translationMap: "Navigation.Manage Users.Title",
    xs: 12,
    sm: 6,
    md: 4,
    lg: 4,
    id: 6,
  },
];

export default cards;
