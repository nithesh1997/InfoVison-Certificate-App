import React, { Suspense, useEffect, useRef, useState } from "react";
import ValidationHelper from "src/modal/table_component/GenericTable/TextFieldCustomStyle/validationHelper/ValidationHelper";
import { Styled } from "src/modal/table_component/GenericTable/Table.style";
import LazySpinner from "src/style/LazySpinner";
import styled from "@emotion/styled";
import axios from "axios";
import AlertDialog from "src/modal/table_component/GenericTable/TextFieldCustomStyle/EditPopup/GridPortal/AlertDialog";

const AsyncIFVDataGrid = React.lazy(() =>
  import("src/modal/table_component/GenericTable/IFVDataGrid"),
);

function ManageUsers() {
  let dataGridRef = useRef();

  const handleEdit = (
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
    setTimeout(() => {
      setActionLoader(false);
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
    }, 300);
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

    if (!updateValuesKeys.password && key === "new_row") {
      updateValuesKeys.password = "";
    }

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

        requestPayload["roles"] = requestPayload["roles"]
          .split(",")
          .reduce((acc, cur) => {
            acc.push(cur.trim());
            return acc;
          }, []);

        //  create user
        axios({
          method: "post",
          url: "/users",
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
              contentTitle: `Added Record - ${requestPayload.username}`,
              contentText: (
                <>
                  <p>Successfully Added User Record</p>
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
                      {gridSubconscious.editUpdateValues[String(key)].username}.
                    </b>{" "}
                    Please try again. */}
                    {error.message} <br />
                    <b>Status</b> - <span>{error.status}</span>
                  </span>
                  <p style={{ fontSize: "0.9rem" }}>Details:</p>
                  {/* <ul style={{ fontSize: "0.9rem" }}>
                    <li>{err.message}</li>
                  </ul> */}
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

            delete requestPayload["password"];

            requestPayload["roles"] = requestPayload["roles"]
              .split(",")
              .reduce((acc, cur) => {
                acc.push(cur.trim());
                return acc;
              }, []);

            // update user
            axios
              .put(`/users/${key}`, requestPayload)
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
                      <p style={{ fontSize: "0.9rem" }}>
                        {/* Error saving Manage Users with name{" "}
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
                      </p>
                      <p style={{ fontSize: "0.9rem" }}>Details:</p>
                      <ul style={{ fontSize: "0.9rem" }}>
                        <li>{err.message}</li>
                      </ul>
                    </>
                  ),
                  agreeTitle: "Okay",
                  handleAgree: () => {
                    setAlertDialogStatus(false);
                  },
                }));
                // error condition
                if (typeof popEditCloseOption === "function") {
                  popEditCloseOption();
                }
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
    let filterEditIndex = gridSubconscious.editingIndex.filter(
      (e) => e !== indexValue,
    );
    setSaveValidationCheck();
    setGridSubconscious((preState) => ({
      ...preState,
      editingIndex: filterEditIndex,
    }));
  };

  const handleDelete = async (record, rows, setActionLoader, filterGridRow) => {
    setActionLoader(record.id);
    axios({
      method: "delete",
      url: `/users/${record.id}`,
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
          contentTitle: `Deleted Record - ${record.username}`,
          contentText: (
            <>
              <p>Successfully Deleted User Record</p>
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
              <p style={{ fontSize: "0.9rem" }}>
                {/* Error Delete Manage User with name{" "}
                <b>{FindDeletedData.username}</b> Please try again. */}
                {error.message} <br />
                <b>Status</b> - <span>{error.status}</span>
              </p>
              <p style={{ fontSize: "0.9rem" }}>Details:</p>
              {/* <ul style={{ fontSize: "0.9rem" }}>
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

  const handleAdd = (value, subconscious, addActionLoadState, cols) => {
    const [gridSubconscious, setGridSubconscious] = subconscious;
    let checkEditingCall = gridSubconscious.editingIndex.includes(value);
    setGridSubconscious((preState) => ({
      ...preState,
      editingIndex: checkEditingCall
        ? [...preState.editingIndex]
        : [...preState.editingIndex, value],
    }));
  };

  const handleChangePassword = async (
    userId,
    passwordValueStates,
    setConfirmPasswordError,
    setSubmitLoader,
    setChangePasswordPopup,
    setDialogOpen,
  ) => {
    setSubmitLoader(true);

    const [passwordState, setPasswordState] = passwordValueStates;

    let payload = {
      newPassword: passwordState.password,
      confirmPassword: passwordState.confirmPasswrd,
    };

    axios
      .put(`/users/changepwd/${userId}`, payload)
      .then((res) => {
        setConfirmPasswordError("");
        setSubmitLoader(false);
        setPasswordState({
          password: "",
          confirmPasswrd: "",
        });
        setChangePasswordPopup((preState) => ({
          ...preState,
          status: false,
        }));
        setDialogOpen(false);
        setAlertDialogStatus(true);
        setAlertContentPopup((preState) => ({
          ...preState,
          divider: true,
          contentTitle: "Success",
          contentText: (
            <>
              <p>{res.data.message}</p>
            </>
          ),
          agreeTitle: "Done",
          handleAgree: () => {
            setAlertDialogStatus(false);
          },
        }));
      })
      .catch((err) => {
        let error = JSON.parse(err.request.response);
        setSubmitLoader(false);
        setDialogOpen(false);
        setAlertDialogStatus(true);
        setAlertContentPopup((preState) => ({
          ...preState,
          divider: true,
          contentTitle: "Error Change Password",
          contentText: (
            <>
              {/* <p>Unable to Send records to server</p>
              <p>Error Info:</p> */}
              <span>
                {error.message} <br />
                <b>Status</b> - <span>{error.status}</span>
              </span>
            </>
          ),
          agreeTitle: "Okay",
          handleAgree: () => {
            setAlertDialogStatus(false);
          },
        }));
      });
  };

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

      const page = gridSubconscious.chunk + 1;

      setGridSubconscious((preState) => ({
        ...preState,
        pagination: {
          pageSize: 10,
          startData: 1,
          endData: 10,
        },
      }));

      axios({
        method: "get",
        url: "/users",
      })
        .then((res) => {
          const payload = [...res.data].map(({ roles, ...params }) => {
            return { ...params, roles: roles.join(", ") };
          });
          setFooterLoading((preState) => ({ ...preState, lastPage: false }));

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
            setLoading(false);
            setGridAllRows(payload);
          }
        })
        .catch((err) => {
          let error = JSON.parse(err.request.response);
          setFooterLoading((preState) => ({ ...preState, lastPage: false }));
          // Alert Popup Content for Saving Error to the saving record to update.
          setAlertDialogStatus(true);
          setAlertContentPopup((preState) => ({
            ...preState,
            divider: true,
            contentTitle: "Error Get Record",
            contentText: (
              <>
                <span>
                  {error.message} <br />
                  <b>Status</b> - <span>{error.status}</span>
                </span>
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
    editMode: "inline", // popup, inline
    bulkAction_Enable: false,
    addRecord: true,
    // addHandler: { handleSave, handleDiscard },
    fallbackRow: {},
  };

  const columns = [
    {
      dataKey: "username",
      name: "User Name",
      type: "text",
      width: 100,
      isDisabled: false,
      editable: true,
      sortable: {
        ascending: (a, b) => a.username.localeCompare(b.username),
        descending: (a, b) => b.username.localeCompare(a.username),
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event === "blur") {
          const value = row.username;
          const regex = new RegExp(/^[a-zA-Z0-9]+$/);
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value],
              success: "",
              error: "User Name is a mandatory field.",
            },
            {
              runner: ValidationHelper.testRegex,
              args: [value, regex],
              success: "",
              error: "User Name Invalid",
            },
            {
              runner: ValidationHelper.testMinSize,
              args: [value, 4],
              success: "",
              error: "User Name field should be atleast 4 characters long",
            },
            {
              runner: ValidationHelper.testMaxSize,
              args: [value, 15],
              success: "",
              error: "User Name field will allow 63 characters or less.",
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
      dataKey: "displayname",
      name: "Display Name",
      width: 100,
      editable: true,
      type: "text",
      isDisabled: false,
      sortable: {
        ascending: (a, b) => a.displayname.localeCompare(b.displayname),
        descending: (a, b) => b.displayname.localeCompare(a.displayname),
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event === "blur") {
          const value = row.displayname;
          const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
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
              error: "Display Name is Invalid",
            },
            {
              runner: ValidationHelper.testMinSize,
              args: [value, 4],
              success: "",
              error: "Dispaly Name should be atleast 4 characters long",
            },
            {
              runner: ValidationHelper.testMaxSize,
              args: [value, 63],
              success: "",
              error: "Dispaly Name will allow 63 characters or less.",
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
      dataKey: "email",
      name: "Email",
      width: 150,
      type: "text",
      isDisabled: false,
      editable: true,
      sortable: {
        ascending: (a, b) => a.email.localeCompare(b.email),
        descending: (a, b) => b.email.localeCompare(a.email),
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event === "blur") {
          const value = row.email;
          const regex = new RegExp(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          );
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value],
              success: "",
              error: "Email is a mandatory field.",
            },
            {
              runner: ValidationHelper.testRegex,
              args: [value, regex],
              success: "",
              error: "Email is Invalid",
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
      dataKey: "roles",
      name: "Roles",
      width: 80,
      options: ["user", "admin"],
      type: "dropdown-single",
      editable: true,
      isDisabled: false,
      sortable: {
        ascending: (a, b) => a.roles.localeCompare(b.roles),
        descending: (a, b) => b.roles.localeCompare(a.roles),
      },
      inputValidator: (event, row) => {
        let data = "";
        if (event === "blur") {
          const value = row.roles;
          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value],
              success: "",
              error: "Roles is a mandatory field.",
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
      dataKey: "password",
      name: "Password",
      width: 80,
      type: "password-field",
      editable: true,
      isDisabled: true,
      inputValidator: (event, row) => {
        let data = "";
        if (event === "blur") {
          const value = row.password;
          let regexNumValidation = /(?=.{6,10}$)/;
          let regexSpecialCharValidation = /[ -/:-@[-`{-~]/;

          const tests = [
            {
              runner: ValidationHelper.isNotEmpty,
              args: [value],
              success: "",
              error: "Password is a mandatory field.",
            },
            {
              runner: ValidationHelper.testMinSize,
              args: [value, 6],
              success: "",
              error: "Password should be atleast 6 characters long",
            },
            {
              runner: ValidationHelper.testMaxSize,
              args: [value, 25],
              success: "",
              error: "Password will allow 25 characters or less.",
            },
            {
              runner: ValidationHelper.testRegex,
              args: [value, regexNumValidation],
              success: "",
              error: "Password must includes numbers",
            },
            {
              runner: ValidationHelper.testRegex,
              args: [value, regexSpecialCharValidation],
              success: "",
              error: "Password must includes atleast one special character",
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
      width: 50,
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
          handleChangePassword: handleChangePassword,
        },
        {
          type: "__changePassword",
          isEnabled: true,
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
      url: "/users",
    })
      .then((res) => {
        const payload = [...res.data].map(({ roles, ...params }) => {
          return { ...params, roles: roles.join(", ") };
        });

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
              <span>
                {error.message} <br />
                <b>Status</b> - <span>{error.status}</span>
              </span>
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

export default ManageUsers;

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
