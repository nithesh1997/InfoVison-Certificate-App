import { activeDirectoryDia } from "./active-directory-dia/activeDirectoryDia";
import { invisigateInfo } from "./common/invisigate-info/invisigateInfo";
import { invisigateList } from "./common/invisigate-list/invisigateList";
import { trustGroups } from "./common/trust-groups/trustGroups";
import { createCSR } from "./csr/create-csr/createCSR";
import { deleteCSR } from "./csr/delete-csr/deleteCSR";
import { getCSR } from "./csr/get-csr/getCSR";
import { updateCSR } from "./csr/update-csr/updateCSR";
import { invisipointClient } from "./inivisipoint-client/invisipointClient";
import { invisigateOrController } from "./invisigate-or-controller/invisigateOrController";
import { invisinetEnterpriseManager } from "./invisinet-enterprise-manager/invisinetEnterpriseManager";
import { invisipointEnforcer } from "./invisipoint-enforcer/invisipointEnforcer";
import { login } from "./login/login";
import { logout } from "./logout/logout";
import { changePassword } from "./user/change-password/changePassword";
import { createUser } from "./user/create-user/createUser";
import { deleteUser } from "./user/delete-user/deleteUser";
import { getUsers } from "./user/get-users/getUsers";
import { updateUser } from "./user/update-user/updateUser";
// manage invisigate api's
import { getInvisigateList } from "./manage-invisipoints/get-invisigate-list/getInvisigateList";
import { updateInvisigate } from "./manage-invisipoints/update-invisigate/updateInvisigate";
import { deleteInvisigate } from "./manage-invisipoints/delete-invisigate/deleteInvisigate";
import { createInvisigate } from "./manage-invisipoints/create-invisigate/createInvisigate";
import { getSummaryList } from "./manage-invisipoints/get-summary/getSummary";
import { trustlevelGroups } from "./manage-invisipoints/trustlevel-groups/trustlevelGroups";
import { dirFqdnAddress } from "./manage-invisipoints/dir-fqdn-address/dirFqdnAddress";
import { getCAConfiguration } from "./ca-configuration/get-ca-configuration/getCAConfiguration";
import { createCAConfiguration } from "./ca-configuration/create-ca-configuration/createCAConfiguration";
import { updateCAConfiguration } from "./ca-configuration/update-ca-configuration/updateCAConfiguration";
import { deleteCAConfiguration } from "./ca-configuration/delete-ca-configuration/deleteCAConfiguration";

export const handlers = [
  /* Auth */
  login(),
  logout(),
  /****************************************************************************/

  /* User */
  createUser(),
  getUsers() /* Contains getUser */,
  updateUser(),
  changePassword(),
  deleteUser(),
  /****************************************************************************/

  /* Manage Invisigate */
  getInvisigateList(),
  updateInvisigate(),
  deleteInvisigate(),
  createInvisigate(),
  getSummaryList(),
  trustlevelGroups(),
  dirFqdnAddress(),
  /****************************************************************************/

  /* CSR */
  createCSR(),
  getCSR(),
  updateCSR(),
  deleteCSR(),
  /****************************************************************************/

  /* Misc */
  invisigateList(),
  invisigateInfo(),
  trustGroups(),
  /****************************************************************************/

  /* Invisipoint */
  invisipointClient(),
  invisipointEnforcer(),
  /****************************************************************************/

  /* Invisinet Enterprise Manager */
  invisinetEnterpriseManager(),
  /****************************************************************************/

  /* Active Directory DIA */
  activeDirectoryDia(),
  /****************************************************************************/

  /* Invisigate Or Controller */
  invisigateOrController(),
  /****************************************************************************/

  /* CA Configuration */
  getCAConfiguration(),
  createCAConfiguration(),
  updateCAConfiguration(),
  deleteCAConfiguration(),
  /****************************************************************************/
];
