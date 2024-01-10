import { useEffect, useState, forwardRef } from "react";
import { Form, Popconfirm, Spin, Typography } from "antd";
import { Styled } from "./Table.style";
import ButtonMui from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import TablePagination from "./TablePagination";
import EditableCell from "./EditableCell";
import { TableContextProvider } from "./context-api/TableContext";
import TableHeader from "./TableHeader";
import TypographyMui from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import EditPopup from "./TextFieldCustomStyle/EditPopup";
import AddIcon from "@mui/icons-material/Add";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import "./IFVDataGrid.css";
import ChangePasswordPopup from "./TextFieldCustomStyle/EditPopup/Change Password Popup";
import AlertDialog from "./TextFieldCustomStyle/EditPopup/GridPortal/AlertDialog";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import { use } from "i18next";
import TooltipIconArrow from "src/style/TextField/TooltipIconArrow";

const isEditing = (record, editingIndex) => {
  return editingIndex.includes(record.id);
};

const addColMods = (
  cols,
  rows,
  subconscious,
  form,
  tableConfig,
  setEditPopStatus,
  actionLoadState,
  changePasswordState,
  handleActions,
  saveValidCondition,
  dialogOpenStatus,
  filterGridRow,
  setAddActionLoader,
) => {
  const [changePasswordPopup, setChangePasswordPopup] = changePasswordState;
  const [gridSubconscious, setGridSubconscious] = subconscious;
  const [gridConfig, setGridConfig] = tableConfig;
  const [actionLoader, setActionLoader] = actionLoadState;
  let editActionDepandance = [setEditPopStatus, setActionLoader];
  const [saveValidationCheck, setSaveValidationCheck] = saveValidCondition;
  const [dialogOpen, setDialogOpen] = dialogOpenStatus;
  const [col, setCol] = cols;

  col.forEach((cl) => {
    cl.title = (
      <TableHeader
        subconscious={subconscious}
        rows={rows}
        cols={cols}
        title={cl.name}
        columnDataKey={cl.dataKey}
        sortable={cl.sortable}
        onClick={() => alert()}
        config={tableConfig}
        filterGridRow={filterGridRow}
      />
    );
    cl.dataIndex = cl.dataKey;

    if (cl.inputValidator === undefined) {
      cl.inputValidator = () => ({ isValid: true, message: "" });
    }

    if (cl.dataKey === "__action") {
      cl.render = (_, record) => {
        const editable = isEditing(record, gridSubconscious.editingIndex);
        let editColumnStatus = cl.actions?.find((e) => e.type == "__edit")[
          "isEnabled"
        ];
        let deleteColumnStatus = cl.actions?.find((e) => e.type == "__delete")[
          "isEnabled"
        ];
        let changePasswordStatus = cl.actions?.find(
          (e) => e.type == "__changePassword",
        );
        let editBtnStatus =
          editColumnStatus || editColumnStatus == undefined ? false : true;
        let deleteBtnStatus =
          deleteColumnStatus || deleteColumnStatus == undefined ? false : true;

        return editable ? (
          <span
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {record.id == actionLoader ? (
              <Styled.Spinner size={24} />
            ) : (
              <>
                <Typography.Link
                  onClick={
                    handleActions.handleSave
                      ? () =>
                          handleActions.handleSave(
                            record.id,
                            rows,
                            subconscious,
                            setActionLoader,
                            saveValidCondition,
                            col,
                            filterGridRow,
                            setAddActionLoader,
                          )
                      : () => {}
                  }
                  style={{
                    marginRight: 8,
                  }}
                >
                  <TooltipIconArrow textContent={"Save"}>
                    <Styled.CustomIconButton className="success">
                      <CheckIcon />
                    </Styled.CustomIconButton>
                  </TooltipIconArrow>
                </Typography.Link>
                <Popconfirm
                  title="Are you sure to cancel?"
                  onConfirm={() =>
                    handleActions.handleDiscard(
                      record.id,
                      subconscious,
                      setSaveValidationCheck,
                    )
                  }
                >
                  <Styled.CustomIconButton className="danger">
                    <TooltipIconArrow textContent={"Cancel"}>
                      <CancelIcon />
                    </TooltipIconArrow>
                  </Styled.CustomIconButton>
                </Popconfirm>
              </>
            )}
          </span>
        ) : (
          <span
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {record.id == actionLoader ? (
              <Styled.Spinner size={24} />
            ) : (
              <>
                <TooltipIconArrow textContent={"Edit"}>
                  <Styled.CustomIconButton
                    className={editBtnStatus ? "primaryDisabled" : "primary"}
                    disabled={editBtnStatus ? true : false}
                    onClick={
                      editBtnStatus
                        ? () => {}
                        : () => {
                            handleActions?.handleEdit(
                              record,
                              form,
                              subconscious,
                              gridConfig,
                              editActionDepandance,
                              cols,
                            );
                          }
                    }
                  >
                    <CreateIcon />
                  </Styled.CustomIconButton>
                </TooltipIconArrow>

                <AlertDialog
                  divider={true}
                  open={
                    dialogOpen.openStatus &&
                    dialogOpen.pointIndexToDelete === record.id
                      ? true
                      : false
                  }
                  setOpen={setDialogOpen}
                  contentTitle={`Delete Confirmation`}
                  contentText={
                    <>
                      {" "}
                      You have initiated the process of deleting this
                      application
                      <br />
                      <br />
                      Click <b>Confirm</b> to delete, otherwise click
                      <b> Cancel</b>.
                    </>
                  }
                  agreeTitle={"Okay"}
                  disagreeTitle={"Cancel"}
                  handleAgree={
                    deleteBtnStatus
                      ? () => {}
                      : () => {
                          handleActions.handleDelete(
                            record,
                            rows,
                            setActionLoader,
                            filterGridRow,
                          );
                          setDialogOpen((preState) => ({
                            ...preState,
                            openStatus: false,
                            pointIndexToDelete: null,
                          }));
                        }
                  }
                  handleDisagree={() => setDialogOpen(false)}
                />
                <TooltipIconArrow textContent={"Delete"}>
                  <Styled.CustomIconButton
                    className={deleteBtnStatus ? "dangerDisabled" : "danger"}
                    disabled={deleteBtnStatus ? true : false}
                    onClick={() => {
                      setDialogOpen((preState) => ({
                        ...preState,
                        openStatus: true,
                        pointIndexToDelete: record.id,
                      }));
                    }}
                  >
                    <DeleteIcon />
                  </Styled.CustomIconButton>
                </TooltipIconArrow>
                {changePasswordStatus?.isEnabled && (
                  <TooltipIconArrow textContent={"Change Password"}>
                    <Styled.CustomIconButton
                      className={deleteBtnStatus ? "primaryDisabled" : "key"}
                      disabled={false}
                      onClick={() => {
                        setChangePasswordPopup((preState) => ({
                          ...preState,
                          status: true,
                          userId: record.id,
                          userName: record.username,
                        }));
                      }}
                    >
                      <PublishedWithChangesIcon />
                    </Styled.CustomIconButton>
                  </TooltipIconArrow>
                )}
              </>
            )}
          </span>
        );
      };
    }
  });

  setCol(col);
  return [col, setCol];
};

const Component = (props, ref) => {
  const [form] = Form.useForm();

  const [editPopStatus, setEditPopStatus] = useState(false);

  const [filterBy, setFilterBy] = useState(false);

  const saveValidCondition = useState();

  const [saveValidationCheck, setSaveValidationCheck] = saveValidCondition;

  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const [addActionBtnLoader, setAddActionBtnLoader] = useState(false);

  const changePasswordState = useState({
    status: false,
    title: "Change Password",
    userId: "",
    userName: "",
  });

  const [changePasswordPopup, setChangePasswordPopup] = changePasswordState;

  /* *************************************************************** */
  const { config: tableConfig, loadingData } = props;
  const { cols: columns, data: rows } = props;
  const { subconscious } = props;
  /* *************************************************************** */
  const [loading, setLoading] = loadingData;
  const [col, setCol] = columns;
  let handleActionFilter = col.find((e) => e.dataKey == "__action");
  let handleActionsObjEdit = handleActionFilter?.actions.find(
    (e) => e.type === "__edit",
  );
  let handleActionsObjDelete = handleActionFilter?.actions.find(
    (e) => e.type === "__delete",
  );
  let handleActionsBothEditDelete = {
    ...handleActionsObjEdit,
    ...handleActionsObjDelete,
  };

  let editHandleKeys = Object.keys(handleActionsObjEdit).filter((e) => {
    if (typeof handleActionsObjEdit[e] === "function") {
      return e;
    }
  });

  let DeleteHandleKeys = Object.keys(handleActionsObjDelete).filter((e) => {
    if (typeof handleActionsObjDelete[e] === "function") {
      return e;
    }
  });
  let handleKeys = [...editHandleKeys, ...DeleteHandleKeys];

  let handleActions = {};

  handleKeys.map((e) => {
    handleActions = { ...handleActions, [e]: handleActionsBothEditDelete[e] };
  });

  const [gridConfig, setGridConfig] = tableConfig;
  const [gridSubconscious, setGridSubconscious] = subconscious;

  const [gridAllRows, setGridAllRows] = rows;

  const actionLoadState = useState();

  // const [actionLoader, setActionLoader] = actionLoadState;

  const addActionLoadState = useState(false);

  const [addActionLoader, setAddActionLoader] = addActionLoadState;

  const [dialogOpen, setDialogOpen] = useState(false);

  const dialogOpenStatus = useState({
    openStatus: false,
    pointIndexToDelete: null,
  });

  // const [dialogOpen, setDialogOpen] = dialogOpenStatus;

  const filterGridRow = useState([]);

  const [filterGridAllRow, setFilterGridAllRow] = filterGridRow;

  const [gridCols, setGridCols] = addColMods(
    columns,
    rows,
    subconscious,
    form,
    tableConfig,
    setEditPopStatus,
    actionLoadState,
    changePasswordState,
    handleActions,
    saveValidCondition,
    dialogOpenStatus,
    filterGridRow,
    setAddActionLoader,
  );
  const [filterValues, setFilterValues] = useState({});

  const [addNewRecordInit, setAddNewRecordInit] = useState({});

  const [isSelectColumns, setIsSelectColumns] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [colState, setColState] = useState([...gridCols]);

  const handleBulkAction = () => {
    setBulkActionLoading(true);
    setTimeout(() => {
      setIsSelectColumns((state) => !state);
      setSelectedRowKeys([]);
      setBulkActionLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (Object.keys(gridConfig.fallbackRow).length) {
      let columnsKeys = col
        .filter((e) => e.dataKey !== "__action")
        .map((e) => e.dataKey);

      let fallbackCheckUpdate = Object.keys(gridConfig.fallbackRow).reduce(
        (acc, cur) => {
          if (columnsKeys.includes(cur)) {
            acc[cur] = gridConfig.fallbackRow[cur];
          }
          return acc;
        },
        {},
      );

      setGridConfig((preState) => ({
        ...preState,
        fallbackRow: {
          ...fallbackCheckUpdate,
        },
      }));
    }
  }, []);

  useEffect(() => {
    if (gridAllRows.length) {
      if (gridConfig.bulkAction_Active) {
        setIsSelectColumns(true);
      }
      let newKeyRows = gridAllRows.map((e) => ({
        ...e,
        key: e.id,
      }));
      setGridAllRows(newKeyRows);
    }

    if (gridAllRows.length) {
      let columnsKeys = col.map((e) => e.dataKey);
      let recordKeys = Object.keys(gridAllRows[0]);
      let reCheckRecordKeys = recordKeys.filter((e) => columnsKeys.includes(e));
      let recordObj = reCheckRecordKeys.reduce((acc, cur) => {
        acc[cur] = gridConfig.fallbackRow[cur]
          ? gridConfig.fallbackRow[cur]
          : "";
        return acc;
      }, {});
      setAddNewRecordInit({ ...recordObj, id: "new_row" });
    }
  }, [gridAllRows.length]);

  useEffect(() => {
    if (Object.keys(filterValues).length === 0 && filterBy === false) {
      setFilterGridAllRow([...gridAllRows]);
    }

    if (!filterBy) {
      setFilterValues({});
    }
  }, [Object.keys(filterValues).length, filterBy]);

  useEffect(() => {
    if (gridSubconscious.editingIndex.includes("new_row")) {
      setAddNewRecordInit((preState) => ({
        ...preState,
        id: "new_row",
        key: "new_row",
      }));
    } else {
      setAddNewRecordInit((preState) => ({ ...preState, id: null }));
    }
  }, [gridSubconscious.editingIndex.length]);

  useEffect(() => {
    setGridSubconscious((preState) => ({
      ...preState,
      totalRowSize: gridAllRows.length / gridSubconscious.pageSize,
    }));
  }, [gridAllRows.length]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const mergedColumns = gridCols.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      options: col.options,
      label: col.name,
      subconscious: subconscious,
      inputValidator: col.inputValidator,
      onCell: (record) => ({
        record,
        inputType: col.type,
        editMode: gridConfig.editMode,
        options: col.options,
        dataKey: col.dataKey,
        subconscious: subconscious,
        isDisabled: col.isDisabled,
        inputValidator: col.inputValidator,
        label: col.name,
        editing: isEditing(record, gridSubconscious.editingIndex),
      }),
    };
  });
  return (
    <TableContextProvider
      value={{
        filterBy,
        setFilterBy,
        saveValidationCheck,
        setSaveValidationCheck,
        filterValues,
        setFilterValues,
        colState,
        setColState,
        addActionLoader,
        setAddActionLoader,
      }}
    >
      <Form form={form} component={false}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 16,
            gap: 10,
            height: "3rem",
            padding: "8px",
          }}
        >
          {gridConfig.addRecord == false ? (
            <></>
          ) : (
            <Tooltip title="Add Record" arrow>
              <ButtonMui
                disabled={loading || addActionLoader}
                variant="contained"
                onClick={() =>
                  gridSubconscious.editingIndex?.includes("new_row")
                    ? handleActions.handleDiscard(
                        "new_row",
                        subconscious,
                        setSaveValidationCheck,
                      )
                    : handleActions.handleAdd(
                        "new_row",
                        subconscious,
                        addActionLoadState,
                        columns,
                        gridConfig,
                      )
                }
              >
                {gridSubconscious.editingIndex?.includes("new_row") ? (
                  <Stack
                    style={{ justifyContent: "center" }}
                    width={"8rem"}
                    direction="row"
                    alignItems="center"
                    gap={1}
                  >
                    <CloseIcon />
                    <TypographyMui
                      style={{ textTransform: "none" }}
                      variant="body1"
                    >
                      Cancel
                    </TypographyMui>
                  </Stack>
                ) : (
                  <Stack
                    style={{ justifyContent: "center" }}
                    width={"8rem"}
                    direction="row"
                    alignItems="center"
                    gap={1}
                  >
                    <AddIcon />
                    <TypographyMui
                      style={{ textTransform: "none" }}
                      variant="body1"
                    >
                      Add Record
                    </TypographyMui>
                  </Stack>
                )}
              </ButtonMui>
            </Tooltip>
          )}

          {gridConfig.bulkAction_Enable == false ? (
            <></>
          ) : (
            <Tooltip
              title={
                !isSelectColumns || gridConfig.bulkAction_Active
                  ? `Bulk Actions`
                  : `Clear Selection`
              }
              arrow
            >
              <ButtonMui
                variant="contained"
                disabled={bulkActionLoading || gridConfig.bulkAction_Active}
                onClick={handleBulkAction}
                style={{ textTransform: "none" }}
              >
                <Stack
                  style={{ justifyContent: "center" }}
                  width={"9rem"}
                  direction="row"
                  alignItems="center"
                  gap={1}
                >
                  {bulkActionLoading ? <Styled.Spinner size={20} /> : ""}
                  <TypographyMui
                    style={{ textTransform: "none" }}
                    variant="body1"
                  >
                    {!isSelectColumns || gridConfig.bulkAction_Active
                      ? `Bulk Actions`
                      : `Clear Selection`}
                  </TypographyMui>
                </Stack>
              </ButtonMui>
            </Tooltip>
          )}

          {hasSelected && !gridConfig.bulkAction_Active && (
            <ButtonMui
              variant="contained"
              disabled={bulkActionLoading || loading}
              style={{ textTransform: "none" }}
            >
              <Stack
                style={{ justifyContent: "center" }}
                width={"7rem"}
                direction="row"
                alignItems="center"
                gap={1}
              >
                <TypographyMui
                  style={{ textTransform: "none" }}
                  variant="body1"
                >
                  More Actions
                </TypographyMui>
              </Stack>
            </ButtonMui>
          )}
        </div>

        <Styled.StyledTable
          className="custom-antd-table"
          components={{
            body: !loading
              ? {
                  cell: EditableCell,
                }
              : () => {
                  return (
                    <Spin spinning={false} size="large">
                      <div
                        style={{
                          minHeight: "calc(100vh - 390px)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          // backgroundColor: "red",
                          height: "auto",
                          margin: "7px",
                          marginBottom: "4px",
                          borderRadius: "5px",
                        }}
                      >
                        {/* Your custom loader content */}
                        <Styled.StyledSkeletonHolder>
                          <WidthFillerSkeleton height={"calc(100vh - 400px)"} />
                        </Styled.StyledSkeletonHolder>
                      </div>
                    </Spin>
                  );
                },
          }}
          rowSelection={isSelectColumns && rowSelection}
          bordered
          dataSource={
            Object.keys(filterValues).length
              ? gridSubconscious.editingIndex.includes("new_row") &&
                gridConfig.editMode === "inline" &&
                addNewRecordInit.id === "new_row"
                ? [
                    addNewRecordInit,
                    ...filterGridAllRow.filter((e, index) => {
                      return (
                        index + 1 >= gridSubconscious.pagination.startData &&
                        index + 1 <= gridSubconscious.pagination.endData
                      );
                    }),
                  ]
                : filterGridAllRow.filter((e, index) => {
                    return (
                      index + 1 >= gridSubconscious.pagination.startData &&
                      index + 1 <= gridSubconscious.pagination.endData
                    );
                  })
              : gridSubconscious.editingIndex.includes("new_row") &&
                gridConfig.editMode === "inline" &&
                addNewRecordInit.id === "new_row"
              ? [
                  addNewRecordInit,
                  ...gridAllRows.filter((e, index) => {
                    return (
                      index + 1 >= gridSubconscious.pagination.startData &&
                      index + 1 <= gridSubconscious.pagination.endData
                    );
                  }),
                ]
              : gridAllRows.filter((e, index) => {
                  return (
                    index + 1 >= gridSubconscious.pagination.startData &&
                    index + 1 <= gridSubconscious.pagination.endData
                  );
                })
          }
          columns={mergedColumns}
          rowClassName="editable-row"
          scroll={{
            x: 1450,
            y: "100%",
          }}
          filterBy={filterBy}
          pagination={false}
        />

        <EditPopup
          tableConfig={tableConfig}
          editPopStatus={[editPopStatus, setEditPopStatus]}
          subconscious={subconscious}
          rows={rows}
          mergedColumns={mergedColumns}
          actionLoadState={actionLoadState}
          setSaveValidationCheck={setSaveValidationCheck}
          columns={col}
          form={form}
          discard={
            handleActions.handleDiscard ? handleActions.handleDiscard : () => {}
          }
          save={handleActions.handleSave ? handleActions.handleSave : () => {}}
          filterGridRow={filterGridRow}
        />

        <ChangePasswordPopup
          changePasswordState={changePasswordState}
          changePasswordAction={handleActions.handleChangePassword}
        />

        <TablePagination
          dataRow={
            Object.keys(filterValues).length ? filterGridAllRow : gridAllRows
          }
          rows={rows}
          selectedRowKeys={selectedRowKeys}
          subconscious={subconscious}
          loadingData={loadingData}
        />
      </Form>
    </TableContextProvider>
  );
};

const IFVDataGrid = forwardRef(Component);

export default IFVDataGrid;
