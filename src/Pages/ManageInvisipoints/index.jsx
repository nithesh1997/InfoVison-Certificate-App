import React, { Suspense, useEffect, useRef, useState } from "react";
import ValidationHelper from "src/modal/table_component/GenericTable/TextFieldCustomStyle/validationHelper/ValidationHelper";
import { Styled } from "src/modal/table_component/GenericTable/Table.style";
import InfoCircle from "@mui/icons-material/InfoOutlined";
import LazySpinner from "src/style/LazySpinner";
import styled from "@emotion/styled";
import axios from "axios";
import AlertDialog from "src/modal/table_component/GenericTable/TextFieldCustomStyle/EditPopup/GridPortal/AlertDialog";
import TooltipIconArrow from "src/style/TextField/TooltipIconArrow";

const AsyncIFVDataGrid = React.lazy(() =>
  import("src/modal/table_component/GenericTable/IFVDataGrid"),
);

function ManageInvisipoints() {
  let dataGridRef = useRef();

  const handleEdit = async (
    record,
    form,
    subconscious,
    gridConfig,
    editActionDepandance,
    cols,
  ) => {
    const [col, setCol] = cols;
    const [setEditPopStatus, setActionLoader] = editActionDepandance;

    setActionLoader(record.id);
    if (gridConfig.getSummaryList) {
      await axios({
        method: "get",
        url: `/invisigate-info/summary/${record.id}`,
      })
        .then((res) => {
          setActionLoader(false);
          let resGroupList = res.data.groupList.map((e) => e.name);
          let dirFQDNList = res.data.dirFQDNList.map((e) => e.address);

          let netColumnList = col.map((e) => {
            if (e.dataKey === "group") {
              return { ...e, options: resGroupList };
            } else if (e.dataKey === "dirFqdn") {
              return { ...e, options: dirFQDNList };
            } else {
              return e;
            }
          });
          setCol([...netColumnList]);
        })
        .catch((err) => {
          let error = JSON.parse(err.request.response);
          let netColumnList = col.map((e) => {
            if (e.dataKey === "group") {
              return { ...e, options: [], type: "text" };
            } else if (e.dataKey === "dirFqdn") {
              return { ...e, options: [], type: "text" };
            } else {
              return e;
            }
          });
          setCol([...netColumnList]);

          // Alert Popup Content for Saving Error to the saving record to update.
          setActionLoader(false);
          setAlertDialogStatus(true);
          setAlertContentPopup((preState) => ({
            ...preState,
            divider: true,
            contentTitle: "Error - Summary Data",
            contentText: (
              <>
                <p>{error.message || "The Gateway IP are In-Accesable"}</p>
                <br />
                <b>Status</b> - <span>{error.status}</span>
                <br />
                <p>Error Info:</p>
              </>
            ),
            agreeTitle: "Okay",
            handleAgree: () => {
              setAlertDialogStatus(false);
            },
          }));
        });
    }

    //  normal table CRUD process
    const [gridSubconscious, setGridSubconscious] = subconscious;
    form.setFieldsValue({
      ...record,
    });
    let checkEditingIndex = gridSubconscious.editingIndex.includes(record.id);
    setGridSubconscious((preState) => ({
      ...preState,
      editingIndex: checkEditingIndex
        ? [...preState.editingIndex]
        : [...preState.editingIndex, record.id],
    }));

    if (gridConfig.editMode == "popup") {
      setEditPopStatus(true);
    }
  };

  const handleSave = async (
    key,
    rows,
    subconscious,
    setActionLoader,
    saveValidCondition,
    col,
    filterGridRow,
    setAddActionLoader,
    popEditCloseOption,
  ) => {
    const [gridAllRows, setGridAllRows] = rows;
    const [filterGridAllRow, setFilterGridAllRow] = filterGridRow;
    const [gridSubconscious, setGridSubconscious] = subconscious;
    setActionLoader(key ? key : "new_row");
    let updateValuesKeys = { ...gridSubconscious.editUpdateValues[key] };
    let originalDataForCompare = gridAllRows.find((e) => {
      return e.id === updateValuesKeys.id;
    });
    delete updateValuesKeys.id;

    const [saveValidationCheck, setSaveValidationCheck] = saveValidCondition;

    let objEditKeys =
      typeof updateValuesKeys === "object" ? Object.keys(updateValuesKeys) : [];
    let checkRowValidStatus = true;
    let newRowValidNumber = col.filter(
      (e) =>
        (typeof (e.inputValidator === "function") ||
          e.inputValidator === false ||
          e.inputValidator === undefined) &&
        e.dataIndex !== "__action",
    ).length;

    let allTableCellValid = objEditKeys.every((e) => {
      let columnsValidations = col.find((f) => f.dataKey === e);
      let valueCheck = columnsValidations?.inputValidator(
        "blur",
        updateValuesKeys,
      );
      return valueCheck?.isValid;
    });

    let checkingDataChange =
      key !== "new_row"
        ? objEditKeys.every((e) => {
            return originalDataForCompare[e] === updateValuesKeys[e];
          })
        : "new_row_render";

    // if (key !== "new_row") {
    checkRowValidStatus = allTableCellValid;
    // }

    if (!checkRowValidStatus) {
      setSaveValidationCheck(key);
      setActionLoader(false);
      return;
    } else if (checkingDataChange && key !== "new_row") {
      setActionLoader(false);
      // Alert Popup Content for changes to the record to update.
      setAlertDialogStatus(true);
      setAlertContentPopup((preState) => ({
        ...preState,
        divider: false,
        contentTitle: "Alert!",
        contentText: "Please make some changes to the record to update.",
        agreeTitle: "Okay",
        handleAgree: () => {
          setAlertDialogStatus(false);
        },
      }));
      return;
    } else if (objEditKeys.length) {
      let filterEditIndex = gridSubconscious.editingIndex.filter(
        (e) => e !== key,
      );

      if (
        key == "new_row" &&
        typeof updateValuesKeys === "object" &&
        objEditKeys.length == newRowValidNumber
      ) {
        setSaveValidationCheck(null);
        let updateEditObj = { ...gridSubconscious.editUpdateValues };

        delete updateEditObj[String(key)];
        setAddActionLoader(true);

        const requestPayload = {
          ...gridSubconscious.editUpdateValues[String(key)],
        };
        delete requestPayload[`id`];

        requestPayload["udpEnable"] =
          requestPayload["udpEnable"] === "Disabled"
            ? false
            : requestPayload["udpEnable"] === "Enabled"
            ? true
            : "";

        requestPayload["timeout"] = Number(requestPayload["timeout"]);
        requestPayload["heartbeatInterval"] = Number(
          requestPayload["heartbeatInterval"],
        );
        requestPayload["tcpTagging"] =
          requestPayload["tcpTagging"] === "SEQ"
            ? 1
            : requestPayload["tcpTagging"] === "SID"
            ? 2
            : 0;
        //  create user
        axios({
          method: "post",
          url: "/invisigate-info",
          data: requestPayload,
        })
          .then((res) => {
            setActionLoader(false);
            setAddActionLoader(false);
            setGridAllRows((state) => [
              {
                ...gridSubconscious.editUpdateValues[String(key)],
                id: res.data.id,
                key: res.data.id,
              },
              ...state,
            ]);
            setFilterGridAllRow((state) => [
              {
                ...gridSubconscious.editUpdateValues[String(key)],
                id: res.data.id,
                key: res.data.id,
              },
              ...state,
            ]);
            setGridSubconscious((preState) => ({
              ...preState,
              editUpdateValues: { ...updateEditObj },
              editingIndex: filterEditIndex,
            }));
            setSaveValidationCheck(false);

            setAlertDialogStatus(true);
            setAlertContentPopup((preState) => ({
              ...preState,
              divider: true,
              contentTitle: `Added Record - ${requestPayload.invisigateDisplayName}`,
              contentText: (
                <>
                  <p>Successfully Added Record</p>
                  <br />
                </>
              ),
              agreeTitle: "Okay",
              handleAgree: () => {
                setAlertDialogStatus(false);
              },
            }));

            if (typeof popEditCloseOption === "function") {
              popEditCloseOption();
            }
          })
          .catch((err) => {
            let error = JSON.parse(err.request.response);
            setSaveValidationCheck(false);
            setActionLoader(false);
            setAddActionLoader(false);
            // Alert Popup Content for Saving Error to the Add record to update.
            setAlertDialogStatus(true);
            setAlertContentPopup((preState) => ({
              ...preState,
              divider: true,
              contentTitle: "Error Add Record",
              contentText: (
                <>
                  <span style={{ fontSize: "0.9rem" }}>
                    {/* Error Add Manage Users with name{" "}
                          <b>
                            {
                              gridSubconscious.editUpdateValues[String(key)]
                                .username
                            }
                            .
                          </b>{" "}
                          Please try again. */}
                    {error.message} <br />
                    <b>Status</b> - <span>{error.status}</span>
                  </span>
                  <p style={{ fontSize: "0.9rem" }}>Details:</p>
                  {/* <ul style={{ fontSize: "0.9rem" }}>
                          <li>{error.message}</li>
                        </ul> */}
                </>
              ),
              agreeTitle: "Okay",
              handleAgree: () => {
                setAlertDialogStatus(false);
              },
            }));
          });
      } else {
        try {
          // const row = await form.validateFields();
          const newData = [...gridAllRows];
          const filteredDataArry = [...filterGridAllRow];
          let updateEditObj = { ...gridSubconscious.editUpdateValues };

          delete updateEditObj[String(key)];

          const index = newData.findIndex((item) => key === item.id);
          const filterNewArryIndex = filteredDataArry.findIndex(
            (item) => key === item.id,
          );

          if (index > -1 || filterNewArryIndex > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
              ...item,
              ...gridSubconscious.editUpdateValues[String(key)],
            });

            const filteredNewDataItem = filteredDataArry[filterNewArryIndex];
            filteredDataArry.splice(filterNewArryIndex, 1, {
              ...filteredNewDataItem,
              ...gridSubconscious.editUpdateValues[String(key)],
            });

            let requestPayload = gridSubconscious.editUpdateValues[String(key)];

            delete requestPayload["id"];

            // update user
            axios
              .put(`/invisigate-info/${key}`, requestPayload)
              .then(() => {
                setActionLoader(false);
                setGridAllRows(newData);
                setFilterGridAllRow(filteredDataArry);
                setGridSubconscious((preState) => ({
                  ...preState,
                  editUpdateValues: {
                    ...updateEditObj,
                  },
                  editingIndex: filterEditIndex,
                }));
                if (typeof popEditCloseOption === "function") {
                  popEditCloseOption();
                }
              })
              .catch((err) => {
                let error = JSON.parse(err.request.response);
                setActionLoader(false);
                // Alert Popup Content for Saving Error to the saving record to update.
                setAlertDialogStatus(true);
                setAlertContentPopup((preState) => ({
                  ...preState,
                  divider: true,
                  contentTitle: "Error Update Record",
                  contentText: (
                    <>
                      <span style={{ fontSize: "0.9rem" }}>
                        {/* Error saving Manage Users with name{" "}
                        <b>
                          {
                            gridSubconscious.editUpdateValues[String(key)]
                              .username
                          }
                          .
                        </b>{" "} */}
                        {error.message} <br />
                        <b>Status</b> <span>{error.status}</span>
                        Please try again.
                      </span>
                      <p style={{ fontSize: "0.9rem" }}>Details:</p>
                      {/* <ul style={{ fontSize: "0.9rem" }}>
                        <li>{error.message}</li>
                      </ul> */}
                    </>
                  ),
                  agreeTitle: "Okay",
                  handleAgree: () => {
                    setAlertDialogStatus(false);
                  },
                }));
                return;
              });
          } else {
            newData.push(gridSubconscious.editUpdateValues);
            setGridAllRows(newData);
            setGridSubconscious((preState) => ({
              ...preState,
              editUpdateValues: {
                ...updateEditObj,
              },
              editingIndex: filterEditIndex,
            }));
          }
        } catch (errInfo) {
          console.log("Validate Failed:", errInfo);
        }
      }
    } else {
      setActionLoader(false);
      setSaveValidationCheck(key);
    }
  };
  const handleDiscard = (indexValue, subconscious, setSaveValidationCheck) => {
    const [gridSubconscious, setGridSubconscious] = subconscious;

    setColumnsData((preState) => {
      let newCols = preState.map((e) => {
        if (e.dataKey === "group") {
          return { ...e, type: "dropdown-multiple" };
        } else if (e.dataKey === "dirFqdn") {
          return { ...e, type: "dropdown-single" };
        } else {
          return e;
        }
      });
      return newCols;
    });

    let filterEditIndex = gridSubconscious.editingIndex.filter(
      (e) => e !== indexValue,
    );
    setSaveValidationCheck(null);
    setGridSubconscious((preState) => ({
      ...preState,
      editingIndex: filterEditIndex,
    }));
  };

  const handleDelete = async (record, rows, setActionLoader, filterGridRow) => {
    setActionLoader(record.id);
    axios({
      method: "delete",
      url: `/invisigate-info/${record.id}`,
      // data: record.id,
    })
      .then((res) => {
        const [filterGridAllRow, setFilterGridAllRow] = filterGridRow;
        setActionLoader(false);
        const [gridAllRows, setGridAllRows] = rows;
        const filteredData = gridAllRows.filter((e) => e.id !== record.id);
        const initGridRow = filterGridAllRow.filter((e) => e.id !== record.id);
        setGridAllRows(filteredData);
        setFilterGridAllRow(initGridRow);

        setAlertDialogStatus(true);
        setAlertContentPopup((preState) => ({
          ...preState,
          divider: true,
          contentTitle: `Deleted Record - ${record.invisigateDisplayName}`,
          contentText: (
            <>
              <p>Successfully deleted Record</p>
              <br />
            </>
          ),
          agreeTitle: "Okay",
          handleAgree: () => {
            setAlertDialogStatus(false);
          },
        }));
      })
      .catch((err) => {
        let error = JSON.parse(err.request.response);
        const [gridAllRows, setGridAllRows] = rows;
        setActionLoader(false);
        const FindDeletedData = gridAllRows.find((e) => e.id == record.id);
        // Alert Popup Content for Delete Error to the saving record to update.
        setAlertDialogStatus(true);
        setAlertContentPopup((preState) => ({
          ...preState,
          divider: true,
          contentTitle: "Error Delete Record",
          contentText: (
            <>
              <span style={{ fontSize: "0.9rem" }}>
                {/* Error Delete Manage User with name{" "}
                <b>{FindDeletedData.username}</b> Please try again. */}
                {error.message} <br />
                <b>Status</b> - <span>{error.status}</span>
              </span>
              {/* <p style={{ fontSize: "0.9rem" }}>Details:</p>
              <ul style={{ fontSize: "0.9rem" }}>
                <li>{err.message}</li>
              </ul> */}
            </>
          ),
          agreeTitle: "Okay",
          handleAgree: () => {
            setAlertDialogStatus(false);
          },
        }));
      });
  };

  const handleAdd = async (
    value,
    subconscious,
    addActionLoadState,
    cols,
    gridConfig,
  ) => {
    const [col, setCol] = cols;
    let netColumnList = [...col];
    const [gridSubconscious, setGridSubconscious] = subconscious;
    const [addActionLoader, setAddActionLoader] = addActionLoadState;
    setAddActionLoader(true);

    if (gridConfig.editMode === "popup") {
      let checkEditingCall = gridSubconscious.editingIndex.includes(value);
      setGridSubconscious((preState) => ({
        ...preState,
        editingIndex: checkEditingCall
          ? [...preState.editingIndex]
          : [...preState.editingIndex, value],
      }));
    }

    await axios({
      method: "get",
      url: `/invisipoint/trustgroups?invisigateIp=192.168.120.108`,
    })
      .then((res) => {
        let resGroupList = res.data.map((e) => e.name);

        netColumnList = netColumnList.map((e) => {
          if (e.dataKey === "group") {
            return { ...e, options: resGroupList };
          } else {
            return e;
          }
        });
      })
      .catch((err) => {
        let error = JSON.parse(err.request.response);
        netColumnList = netColumnList.map((e) => {
          if (e.dataKey === "group") {
            return { ...e, options: [], type: "text" };
          } else {
            return e;
          }
        });
        setAddActionLoader(false);
        setAlertDialogStatus(true);
        setAlertContentPopup((preState) => ({
          ...preState,
          divider: true,
          contentTitle: "Error - Trust Level Data",
          contentText: (
            <>
              <p>{error.message}</p>
              <br />
              <b>Status</b> - <span>{error.status}</span>
              <br />
              <p>Error Info:</p>
            </>
          ),
          agreeTitle: "Okay",
          handleAgree: () => {
            setAlertDialogStatus(false);
          },
        }));
      });

    await axios({
      method: "get",
      url: `/invisipoint/dirFQDN?invisigateIp=192.168.120.161`,
    })
      .then((res) => {
        let resGroupList = res.data.map((e) => e.address);

        netColumnList = netColumnList.map((e) => {
          if (e.dataKey === "dirFqdn") {
            return { ...e, options: resGroupList };
          } else {
            return e;
          }
        });
      })
      .catch((err) => {
        let error = JSON.parse(err.request.response);
        netColumnList = netColumnList.map((e) => {
          if (e.dataKey === "dirFqdn") {
            return { ...e, options: [], type: "text" };
          } else {
            return e;
          }
        });
        setAlertDialogStatus(true);
        setAlertContentPopup((preState) => ({
          ...preState,
          divider: true,
          contentTitle: "Error - Dir FQDN Data",
          contentText: (
            <>
              <p>{error.message}</p>
              <br />
              <b>Status</b> - <span>{error.status}</span>
              <br />
              <p>Error Info:</p>
            </>
          ),
          agreeTitle: "Okay",
          handleAgree: () => {
            setAlertDialogStatus(false);
          },
        }));
      });

    setAddActionLoader(false);
    setCol([...netColumnList]);
    if (gridConfig.editMode === "inline") {
      let checkEditingCall = gridSubconscious.editingIndex.includes(value);
      setGridSubconscious((preState) => ({
        ...preState,
        editingIndex: checkEditingCall
          ? [...preState.editingIndex]
          : [...preState.editingIndex, value],
      }));
    }
  };

  const validateIpAddress = (value) => {
    const alphabetPattern = new RegExp(/^[a-zA-Z]$/);
    const FQDNPattern = new RegExp(
      /^(?=.{1,254}$)((?=[a-zA-Z0-9-]{1,63}\.)(xn--+)?[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,63}$/,
    );
    const IPv4Pattern = new RegExp(
      /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
    );
    const IPv6Pattern = new RegExp(
      /^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::))))$/,
    );

    const isDomainName = !!value
      .split("")
      .filter((character) => alphabetPattern.test(character)).length;
    const isIPv4 = value.includes(".") && !isDomainName;
    const isIPv6 = value.includes(":");
    const isPrefix = Boolean(value.split("/")[1]);

    if (isIPv4) {
      const prefix = isPrefix ? value.split("/")[1] : 0;
      const regexResult = IPv4Pattern.test(
        isPrefix ? value.split("/")[0] : value,
      );

      if (regexResult) {
        const IpSections = value.split(".");
        const isLastSectionZero = !Number(IpSections[IpSections.length - 1]);

        if (!(value === "0.0.0.0" || isLastSectionZero)) {
          return false;
        }

        if (isPrefix && prefix >= 8 && prefix <= 32) {
          return false;
        }
      }
    }

    if (isIPv6) {
      const prefix = isPrefix ? value.split("/")[1] : 0;
      const regexResult = IPv6Pattern.test(
        isPrefix ? value.split("/")[0] : value,
      );

      if (regexResult) {
        if (isPrefix) {
          if (prefix >= 48 && prefix <= 128) {
            return false;
          } else {
            return value;
          }
        } else {
          return false;
        }
      }
    }

    if (isDomainName) {
      const regexResult = FQDNPattern.test(value);

      if (regexResult) {
        return false;
      }
    }

    return value;
  };

  let common = {
    GATEWAY: "Invisigate",
  };
  const errorMessage = (value) => (
    <p style={{ height: "0.1rem", marginTop: 0 }}>
      Provided address <b>{value}</b> is not valid
      <TooltipIconArrow
        textContent={
          <>
            <p>${common.GATEWAY} address must be any one of the following:</p>

            <ul style={{ paddingLeft: "1rem" }}>
              <li style={{ margin: "0.2rem 0" }}>
                Valid <b>IPv4 Address</b> such as <code>1.2.3.4</code> with just
                octet sections.
              </li>
              <li style={{ margin: "0.2rem 0" }}>
                Valid <b>IPv4 Address</b> with Prefix range between 8-32 such as{" "}
                <code>1.2.3.4/24</code>
              </li>

              <li style={{ margin: "0.2rem 0" }}>
                Valid <b>IPv6 Address</b> such as{" "}
                <code>2001:db8:3333::0:00FF:08</code> with just hextet sections.
              </li>
              <li style={{ margin: "0.2rem 0" }}>
                Valid <b>IPv6 Address</b> with prefix range between 48-128 such
                as <code>1.2.3.4/56</code>
              </li>

              <li style={{ margin: "0.2rem 0" }}>
                Valid Fully Qualified Domain Name <b>(FQDN)</b> such as{" "}
                <code>{"Certificate".toLowerCase()}.client-name.com</code>.
              </li>
            </ul>
          </>
        }
      >
        <Styled.IconButton>
          <InfoCircle size={"0.65em"} />
        </Styled.IconButton>
      </TooltipIconArrow>
    </p>
  );

  // Subconscious
  let subconscious = {
    name: "ba-identity-config",
    sort: { column: "", order: "none" },
    pagination: {
      pageSize: 10,
      startData: 1,
      endData: 10,
    },
    chunk: 0,
    editingIndex: [],
    editUpdateValues: {},
    handleLoadMoreData: (TableRows, Subconscious, footerLoader) => {
      const successCode = "INVISIGATE_SUCCESS";
      const failureCode = "INVISIGATE_FAILURE";

      const [tableRows, setTableRows] = TableRows;
      const [gridSubconscious, setGridSubconscious] = Subconscious;
      const [footerLoading, setFooterLoading] = footerLoader;
      // const [gotoLastButton, setGotoLastButton] = LastButton;

      setGridSubconscious((preState) => ({
        ...preState,
        pagination: {
          pageSize: 10,
          startData: 1,
          endData: 10,
        },
      }));

      const page = gridSubconscious.chunk + 1;
      axios({
        method: "get",
        url: "/invisigate-info",
        params: { page },
      })
        .then((res) => {
          setFooterLoading((preState) => ({ ...preState, lastPage: true }));
          const payload = [...res.data];

          if (typeof columnsData[0].sortable === "object") {
            setGridSubconscious((preState) => ({
              ...preState,
              sort: { column: columnsData[0].dataKey, order: "ascending" },
            }));

            let sortedPayload = [...payload].sort(
              columnsData[0].sortable["ascending"],
            );

            setGridAllRows(sortedPayload);
          } else if (typeof columnsData[1].sortable === "object") {
            setGridSubconscious((preState) => ({
              ...preState,
              sort: { column: columnsData[1].dataKey, order: "ascending" },
            }));

            let sortedPayload = [...payload].sort(
              columnsData[1].sortable["ascending"],
            );
            setLoading(false);
            setGridAllRows(sortedPayload);
          } else {
            setTableRows(payload);
          }
        })
        .catch((err) => {
          let error = JSON.parse(err.request.response);
          // Alert Popup Content for Saving Error to the saving record to update.
          setFooterLoading((preState) => ({ ...preState, lastPage: false }));
          setAlertDialogStatus(true);
          setAlertContentPopup((preState) => ({
            ...preState,
            divider: true,
            contentTitle: "Error Get Record",
            contentText: (
              <>
                <p>{error.message}</p>
                <br />
                <b>Status</b> - <span>{error.status}</span>
                <br />
                <p>Error Info:</p>
              </>
            ),
            agreeTitle: "Okay",
            handleAgree: () => {
              setAlertDialogStatus(false);
            },
          }));
        });
    },
  };

  // Config Data commend
  let config = {
    editMode: "popup", // popup, inline
    bulkAction_Enable: false,
    bulkAction_Active: false,
    addRecord: true,
    getSummaryList: true,
    // addHandler: { handleSave, handleDiscard },
    fallbackRow: {},
  };

  const columns = [
    {
      name: "Invisigate IP/FQDN",
      dataKey: "invisigateIp",
      type: "text",
      editable: true,
      isDisabled: false,
      width: 250,
      sortable: {
        ascending: (a, b) => a.invisigateIp.localeCompare(b.invisigateIp),
        descending: (a, b) => b.invisigateIp.localeCompare(a.invisigateIp),
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event === "blur") {
          const value = row.invisigateIp;

          const regexIpv4 = new RegExp(
            /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/,
          );
          const regexIpv6 = new RegExp(
            /^(?:[0-9a-fA-F]{1,4}:){7}(?:[0-9a-fA-F]{1,4}|:)|(?:[0-9a-fA-F]{1,4}:){6}(?:(?: 25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\. (?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3})?$/,
          );

          const regexFqdn = new RegExp(
            /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)/,
          );
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value],
              success: "",
              error: "Invisigate Ip is a mandatory field.",
            },
            {
              runner: ValidationHelper.isIPv4AndIsIpv6,
              args: [value, regexIpv4, regexIpv6, regexFqdn],
              success: "",
              error: "The IP Address not match to IPv4 or IPv6 or FQDN.",
            },
          ];
          data = ValidationHelper.batchValidator(tests);

          if (data === "") {
            return { isValid: true, message: "" };
          } else {
            return { isValid: false, message: data };
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      name: "Invisigate Activation IP/FQDN",
      dataKey: "invisigateActivationIp",
      type: "text",
      editable: true,
      isDisabled: false,
      width: 300,
      sortable: {
        ascending: (a, b) =>
          a.invisigateActivationIp.localeCompare(b.invisigateActivationIp),
        descending: (a, b) =>
          b.invisigateActivationIp.localeCompare(a.invisigateActivationIp),
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event === "blur") {
          const value = row.invisigateActivationIp;
          const regexIpv4 = new RegExp(
            /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/,
          );
          const regexIpv6 = new RegExp(
            /^(?:[0-9a-fA-F]{1,4}:){7}(?:[0-9a-fA-F]{1,4}|:)|(?:[0-9a-fA-F]{1,4}:){6}(?:(?: 25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\. (?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3})?$/,
          );

          const regexFqdn = new RegExp(
            /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)/,
          );
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value],
              success: "",
              error: "Invisigate Activation Ip is a mandatory field.",
            },
            {
              runner: ValidationHelper.isIPv4AndIsIpv6,
              args: [value, regexIpv4, regexIpv6, regexFqdn],
              success: "",
              error: "The IP Address not match to IPv4 or IPv6 or FQDN.",
            },
          ];
          data = ValidationHelper.batchValidator(tests);

          if (data === "") {
            return { isValid: true, message: "" };
          } else {
            return { isValid: false, message: data };
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      name: "Invisigate DisplayName",
      dataKey: "invisigateDisplayName",
      type: "text",
      isDisabled: false,
      editable: true,
      width: 200,
      sortable: {
        ascending: (a, b) =>
          a.invisigateDisplayName.localeCompare(b.invisigateDisplayName),
        descending: (a, b) =>
          b.invisigateDisplayName.localeCompare(a.invisigateDisplayName),
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event === "blur") {
          const value = row.invisigateDisplayName;
          const regex = new RegExp(/^[A-Za-z0-9]+$/);
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value],
              success: "",
              error: "Display Name is a mandatory field.",
            },
            {
              runner: ValidationHelper.testRegex,
              args: [value, regex],
              success: "",
              error: "Only alpha-numeric characters are allowed.",
            },
            {
              runner: ValidationHelper.testMinSize,
              args: [value, 4],
              success: "",
              error: "Display Name field should be atleast 4 characters long",
            },
            {
              runner: ValidationHelper.testMaxSize,
              args: [value, 63],
              success: "",
              error: "Display Name field will allow 63 characters or less.",
            },
          ];
          data = ValidationHelper.batchValidator(tests);

          if (data === "") {
            return { isValid: true, message: "" };
          } else {
            return { isValid: false, message: data };
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      name: "Enabled",
      dataKey: "enabled",
      type: "dropdown-single",
      editable: true,
      isDisabled: false,
      options: ["False", "True"],
      width: 200,
      sortable: {
        ascending: (a, b) => a.enabled.localeCompare(b.enabled),
        descending: (a, b) => b.enabled.localeCompare(a.enabled),
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event === "blur") {
          const value = row.enabled;
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value],
              success: "",
              error: "Enabled is a mandatory field.",
            },
          ];

          data = ValidationHelper.batchValidator(tests);
          if (data === "") {
            return { isValid: true, message: "" };
          } else {
            return { isValid: false, message: data };
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      name: "Group",
      dataKey: "group",
      type: "dropdown-multiple",
      isDisabled: false,
      editable: true,
      options: [],
      width: 200,
      sortable: {
        ascending: (a, b) => a.group.localeCompare(b.group),
        descending: (a, b) => b.group.localeCompare(a.group),
      },
      inputValidator: (event, row) => {
        if (event === "blur") {
          const _ = row.group;
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [_],
              success: "",
              error: "Group is a mandatory field.",
            },
          ];

          const result = ValidationHelper.batchValidator(tests);

          return result
            ? { isValid: false, message: result }
            : { isValid: true, message: result };
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      name: "Location",
      dataKey: "location",
      type: "text",
      isDisabled: false,
      editable: true,
      width: 200,
      sortable: {
        ascending: (a, b) => a.location.localeCompare(b.location),
        descending: (a, b) => b.location.localeCompare(a.location),
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event === "blur") {
          const value = row.location;
          const regex = new RegExp(/^[a-zA-Z0-9]+$/);
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value],
              success: "",
              error: "Location is a mandatory field.",
            },
            {
              runner: ValidationHelper.testMinSize,
              args: [value, 3],
              success: "",
              error: "Location field should be atleast 4 characters long",
            },
            {
              runner: ValidationHelper.testMaxSize,
              args: [value, 63],
              success: "",
              error: "Location field will allow 63 characters or less.",
            },
          ];
          data = ValidationHelper.batchValidator(tests);

          if (data === "") {
            return { isValid: true, message: "" };
          } else {
            return { isValid: false, message: data };
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      name: "Algorithm",
      dataKey: "algorithm",
      type: "dropdown-single",
      isDisabled: false,
      editable: true,
      options: ["HMAC-SHA-256", "HMAC-SHA-256-64"],
      width: 200,
      sortable: {
        ascending: (a, b) => a.algorithm.localeCompare(b.algorithm),
        descending: (a, b) => b.algorithm.localeCompare(a.algorithm),
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event === "blur") {
          const value1 = row.algorithm;
          // const regex2 = new RegExp(/^[A-za-z0-9\s_\-]+$/);
          const tests1 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              success: "",
              error: "Algorithm is a mandatory field.",
            },
            // {
            //   runner: ValidationHelper.testRegex,
            //   args: [value1, regex2],
            //   success: "",
            //   error:
            //     "Name must only include alphabets, numbers, spaces, underscores, and, hyphens.",
            // },
            // {
            //   runner: ValidationHelper.testMinSize,
            //   args: [value1, 4],
            //   success: "",
            //   error: "hey,value must be greater than 4",
            // },
          ];
          data = ValidationHelper.batchValidator(tests1);
          if (data === "") {
            return { isValid: true, message: "" };
          } else {
            return { isValid: false, message: data };
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      name: "Timeout",
      dataKey: "timeout",
      type: "text",
      isDisabled: false,
      editable: true,
      width: 200,
      sortable: {
        ascending: (a, b) => a.timeout - b.timeout,
        descending: (a, b) => b.timeout - a.timeout,
      },
      inputValidator: (event, row) => {
        if (event === "blur") {
          let data = "";
          const value = row.timeout;

          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value],
              success: "",
              error: "Timeout is a mandatory field.",
            },
            {
              runner: ValidationHelper.testRegex,
              args: [value, new RegExp("^\\d+$")],
              success: "",
              error: "Timeout value must be a valid number.",
            },
            {
              runner: ValidationHelper.isWithinRange,
              args: [parseInt(value), 3600, 65534],
              success: "",
              error: "Timeout value should range from 3600 to 65534 (seconds).",
            },
          ];

          data = ValidationHelper.batchValidator(tests);

          if (data === "") {
            return { isValid: true, message: "" };
          } else {
            return { isValid: false, message: data };
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      name: "Heartbeat Interval",
      dataKey: "heartbeatInterval",
      type: "text",
      isDisabled: false,
      editable: true,
      width: 200,
      sortable: {
        ascending: (a, b) => a.heartbeatInterval - b.heartbeatInterval,
        descending: (a, b) => b.heartbeatInterval - a.heartbeatInterval,
      },
      inputValidator: (event, row) => {
        if (event === "blur") {
          let data = "";
          const value = row.heartbeatInterval;
          let timeout = parseInt(row.timeout / 2);
          if (isNaN(timeout)) {
            timeout = 0;
          } else {
            timeout -= 1;
          }

          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value],
              success: "",
              error: "Heartbeat Interval is a mandatory field.",
            },
            {
              runner: ValidationHelper.testRegex,
              args: [value, new RegExp("^\\d+$")],
              success: "",
              error: "Heartbeat Interval must be a valid number.",
            },
            {
              runner: ValidationHelper.isWithinRange,
              args: [parseInt(value), 0, timeout],
              success: "",
              error:
                "Heartbeat Interval value should be less than half of Timeout value.",
            },
          ];

          data = ValidationHelper.batchValidator(tests);

          if (data === "") {
            return { isValid: true, message: "" };
          } else {
            return { isValid: false, message: data };
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      name: "Dir FQDN",
      dataKey: "dirFqdn",
      type: "dropdown-single",
      isDisabled: false,
      editable: true,
      width: 300,
      options: [],
      sortable: {
        ascending: (a, b) => a.dirFqdn.localeCompare(b.dirFqdn),
        descending: (a, b) => b.dirFqdn.localeCompare(a.dirFqdn),
      },
      inputValidator: (event, row) => {
        let value = row.dirFqdn;

        if (event === "blur") {
          const FQDN_PATTERN = new RegExp(
            /^(([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]\.)|([a-zA-Z0-9]\.))+[a-zA-Z][a-zA-Z0-9-]*[a-zA-Z0-9]$/,
          );

          const IPv4_PATTERN = new RegExp(
            /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
          );

          if (!value) {
            return {
              isValid: false,
              message: "Dir FQDN is a mandatory field.",
            };
          }

          if (!FQDN_PATTERN.test(value)) {
            if (!IPv4_PATTERN.test(value)) {
              return {
                isValid: false,
                message: (
                  <>
                    DIR FQDN address must be
                    <ul>
                      <li>
                        Either a valid <b>IP Address</b> like
                        <code> 14.234.212.23</code>
                      </li>

                      <li>
                        OR a valid <b>FQDN (Fully Qualified Domain Name)</b>{" "}
                        like
                        <code> ec2-13.amazon.com</code>
                      </li>
                    </ul>
                  </>
                ),
              };
            } else {
              return { isValid: true, message: "" };
            }
          } else {
            return { isValid: true, message: "" };
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      name: "Destination",
      dataKey: "destination",
      type: "text",
      isDisabled: false,
      editable: true,
      width: 300,
      sortable: {
        ascending: (a, b) => a.destination.localeCompare(b.destination),
        descending: (a, b) => b.destination.localeCompare(a.destination),
      },

      inputValidator: (event, row) => {
        const value =
          row.destination
            ?.split(",")
            ?.map(($) => $.trim())
            ?.filter(($) => $) ?? [];

        let d = row.destination.split(",");
        const tests1 = [
          {
            runner: ValidationHelper.isNotEmpty,
            args: [row.destination],
            success: "",
            error: "Destination is a mandatory field.",
          },
        ];

        ValidationHelper.batchValidator(tests1);

        if (
          event === "blur" &&
          !row.destination.length &&
          row.roles !== "TAC-ID"
        ) {
          return {
            isValid: false,
            message: "Destination is a mandatory field.",
          };
        } else if (event === "blur" && value.length) {
          if (d.length > 7) {
            return {
              isValid: false,
              message:
                "The destination can contain only a maximum of 7 host addresses",
            };
          } else {
            const results = value.map(($) => validateIpAddress($));
            const affected = results.filter(($) => typeof $ === "string")[0];

            return affected
              ? { isValid: false, message: errorMessage(affected) }
              : { isValid: true, message: "" };
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      name: "TCP Tagging",
      dataKey: "tcpTagging",
      type: "dropdown-single",
      options: ["SEQ", "SID"],
      isDisabled: false,
      editable: true,
      width: 300,
      sortable: {
        ascending: (a, b) => a.tcpTagging - b.tcpTagging,
        descending: (a, b) => b.tcpTagging - a.tcpTagging,
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event === "blur") {
          const value1 = row.tcpTagging;
          // const regex2 = new RegExp(/^[A-za-z0-9\s_\-]+$/);
          const tests1 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              success: "",
              error: "TCP Tagging is a mandatory field.",
            },
            // {
            //   runner: ValidationHelper.testRegex,
            //   args: [value1, regex2],
            //   success: "",
            //   error:
            //     "Name must only include alphabets, numbers, spaces, underscores, and, hyphens.",
            // },
            // {
            //   runner: ValidationHelper.testMinSize,
            //   args: [value1, 4],
            //   success: "",
            //   error: "hey,value must be greater than 4",
            // },
          ];
          data = ValidationHelper.batchValidator(tests1);
          if (data === "") {
            return { isValid: true, message: "" };
          } else {
            return { isValid: false, message: data };
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      name: "TAC Mutual Auth",
      dataKey: "tagMutualAuth",
      type: "dropdown-single",
      options: ["False", "True"],
      isDisabled: false,
      editable: true,
      width: 200,
      sortable: {
        ascending: (a, b) => a.tagMutualAuth.localeCompare(b.tagMutualAuth),
        descending: (a, b) => b.tagMutualAuth.localeCompare(a.tagMutualAuth),
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event === "blur") {
          const value1 = row.tagMutualAuth;
          const tests1 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              error: "TAC Mutual Auth is a mandatory field.",
            },
          ];

          data = ValidationHelper.batchValidator(tests1);

          if (!data) {
            return { isValid: true, message: "" };
          } else {
            return { isValid: false, message: data };
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      name: "UDP",
      dataKey: "udpEnable",
      type: "dropdown-single",
      options: ["Disabled", "Enabled"],
      isDisabled: false,
      editable: true,
      width: 300,
      sortable: {
        ascending: (a, b) => a.udpEnable.localeCompare(b.udpEnable),
        descending: (a, b) => b.udpEnable.localeCompare(a.udpEnable),
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event === "blur") {
          const value1 =
            row.udpEnable === false
              ? "Disabled"
              : row.udpEnable === true
              ? "Enabled"
              : row.udpEnable;
          const tests1 = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value1],
              error: "UDP field is a mandatory field.",
            },
          ];

          data = ValidationHelper.batchValidator(tests1);

          if (!data) {
            return { isValid: true, message: "" };
          } else {
            return { isValid: false, message: data };
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },
    {
      name: "Comments",
      dataKey: "comments",
      type: "multiline",
      isDisabled: false,
      editable: true,
      width: 300,
      sortable: {
        ascending: (a, b) => a.comments.localeCompare(b.comments),
        descending: (a, b) => b.comments.localeCompare(a.comments),
      },
      inputValidator: (event, row) => {
        let data = "";

        if (event === "blur") {
          const value = row.comments;

          const tests = [
            {
              runner: ValidationHelper.testMaxSize,
              args: [value, 1024],
              success: "",
              error: "Comment field will allow 1024 characters or less.",
            },
          ];

          data = ValidationHelper.batchValidator(tests);

          if (data === "") {
            return { isValid: true, message: "" };
          } else {
            return { isValid: false, message: data };
          }
        } else {
          return { isValid: true, message: "" };
        }
      },
    },

    {
      dataKey: "__action",
      name: "Actions",
      align: "center",
      width: 110,
      fixed: "right",
      sortable: false,
      actions: [
        {
          type: "__edit",
          name: "Edit Identities",
          isEnabled: true,
          handleEdit: handleEdit,
          handleSave: handleSave,
          handleDiscard: handleDiscard,
          handleAdd: handleAdd,
        },
        {
          type: "__delete",
          name: "Delete Identities",
          isEnabled: true,
          handleDelete: handleDelete,
        },
      ],
    },
  ];

  // A key needs to be passed mandatorily to the grid

  let [dataGridKey, setDataGridKey] = useState(
    () => subconscious.name + "-" + new Date().getTime(),
  );

  let [gridSubconscious, setGridSubconscious] = useState(subconscious);
  let [gridAllRows, setGridAllRows] = useState([]);
  let [loading, setLoading] = useState(false);

  let [gridConfig, setGridConfig] = useState(config);

  let [columnsData, setColumnsData] = useState(columns);

  let [alertContentPopup, setAlertContentPopup] = useState({
    divider: null,
    contentTitle: null,
    contentText: null,
    agreeTitle: null,
    disagreeTitle: null,
    handleAgree: null,
    handleDisagree: null,
  });

  let [alertDialogStatus, setAlertDialogStatus] = useState(false);

  // API CALL

  useEffect(() => {
    setLoading(true);
    axios({
      method: "get",
      url: "/invisigate-info",
    })
      .then((res) => {
        const payload = [...res.data];

        if (typeof columnsData[0].sortable === "object") {
          setGridSubconscious((preState) => ({
            ...preState,
            sort: { column: columnsData[0].dataKey, order: "ascending" },
          }));

          let sortedPayload = [...payload].sort(
            columnsData[0].sortable["ascending"],
          );

          setLoading(false);
          setGridAllRows(sortedPayload);
        } else if (typeof columnsData[1].sortable === "object") {
          setGridSubconscious((preState) => ({
            ...preState,
            sort: { column: columnsData[1].dataKey, order: "ascending" },
          }));

          let sortedPayload = [...payload].sort(
            columnsData[1].sortable["ascending"],
          );
          setLoading(false);
          setGridAllRows(sortedPayload);
        } else {
          setLoading(false);
          setGridAllRows(payload);
        }
      })
      .catch((err) => {
        let error = JSON.parse(err.request.response);
        setLoading(false);
        // Alert Popup Content for Saving Error to the saving record to update.
        setAlertDialogStatus(true);
        setAlertContentPopup((preState) => ({
          ...preState,
          divider: true,
          contentTitle: "Error Get Record",
          contentText: (
            <>
              <p>{error.message}</p>
              <br />
              <b>Status</b> - <span>{error.status}</span>
              <br />
              <p>Error Info:</p>
            </>
          ),
          agreeTitle: "Okay",
          handleAgree: () => {
            setAlertDialogStatus(false);
          },
        }));
      });
  }, []);

  return (
    <Wrapper>
      <Suspense
        fallback={
          <Styled.SkeletonHolder>
            <FloatContainer>
              <LazySpinner />
            </FloatContainer>
          </Styled.SkeletonHolder>
        }
      >
        <AsyncIFVDataGrid
          ref={dataGridRef}
          name={subconscious.name}
          key={dataGridKey}
          loadingData={[loading, setLoading]}
          config={[gridConfig, setGridConfig]}
          cols={[columnsData, setColumnsData]}
          subconscious={[gridSubconscious, setGridSubconscious]}
          data={[gridAllRows, setGridAllRows]}
        />

        <AlertDialog
          divider={alertContentPopup.divider}
          open={alertDialogStatus}
          setOpen={setAlertDialogStatus}
          contentTitle={alertContentPopup.contentTitle}
          contentText={alertContentPopup.contentText}
          agreeTitle={alertContentPopup.agreeTitle}
          disagreeTitle={alertContentPopup.disagreeTitle}
          handleAgree={alertContentPopup.handleAgree}
          handleDisagree={alertContentPopup.handleDisagree}
        />
      </Suspense>
    </Wrapper>
  );
}

export default ManageInvisipoints;

const Wrapper = styled("div")`
  width: 100%;
  height: 100%;
  padding-top: 0.8rem;
`;

const FloatContainer = styled("div")`
  position: absolute;
  z-index: 1;
  background: rgba(0, 0, 0, 0.02);
  user-select: none;
  width: 84%;
  height: 75%;
  display: inherit;
`;
