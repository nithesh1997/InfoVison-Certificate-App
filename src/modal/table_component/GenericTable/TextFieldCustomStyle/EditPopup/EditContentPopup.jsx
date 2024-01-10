import { useContext, useEffect, useState } from "react";
import AlertDialog from "./GridPortal/AlertDialog";
import { Styled } from "./styled-materials/EditStylePopup";
import { GenericButton } from "./GenericButton/GenericButton";
import Input from "../Input";
import { TableContext } from "../../context-api/TableContext";
import inputValueChange from "../../utile-function/inputValueChange";

function EditContentPopup(props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    form,
    mergedColumns,
    save,
    subconscious,
    rows,
    tableConfig,
    col,
    actionLoadState,
    filterGridRow,
  } = props;

  const [actionLoader, setActionLoader] = actionLoadState;

  const [gridSubconscious, setGridSubconscious] = subconscious;

  const [gridConfig, setGridConfig] = tableConfig;

  const [gridAllRows, setGridAllRows] = rows;

  const {
    saveValidationCheck,
    setSaveValidationCheck,
    addActionLoader,
    setAddActionLoader,
  } = useContext(TableContext);

  const saveValidCondition = [saveValidationCheck, setSaveValidationCheck];

  useEffect(() => {
    let checkNewData = gridSubconscious.editingIndex[0];

    if (checkNewData === "new_row") {
      let ListKeyObj = col
        .filter((e) => e.dataKey !== "__action")
        .map((e) => e.dataKey)
        .reduce((acc, cur) => {
          acc[cur] = "";
          return acc;
        }, {});
      setGridSubconscious((preState) => ({
        ...preState,
        editUpdateValues: {
          ...preState.editUpdateValues,
          new_row: {
            ...ListKeyObj,
            // ...preState.editUpdateValues.new_row
          },
        },
      }));
    }
  }, []);

  function handleSave() {
    let handleClose = props.handleClose;
    save(
      gridSubconscious.editingIndex[0],
      rows,
      subconscious,
      setActionLoader,
      saveValidCondition,
      col,
      filterGridRow,
      setAddActionLoader,
      handleClose,
    );
  }
  return (
    <>
      <Styled.StyledContainer
        tabindex="-1"
        id="addgateway"
        not
        aria-labelledby="addgatewayLabel"
      >
        <Styled.StyledMainDivComponent>
          <Styled.HeaderDivComponent class="offcanvas-header">
            <Styled.StyledH5Component>
              {gridSubconscious.editingIndex.includes("new_row")
                ? "Add Record"
                : "Edit Record"}
            </Styled.StyledH5Component>
            <Styled.StyledCloseIconComponent
              onClick={() => {
                props.handleClose();
              }}
            />
          </Styled.HeaderDivComponent>

          <Styled.BodyDivComponent class="offcanvas-body">
            <Styled.StyledFormContainer>
              {mergedColumns.map(
                (
                  {
                    dataKey,
                    subconscious,
                    editable,
                    label,
                    isDisabled,
                    inputValidator,
                    name,
                    type,
                    options,
                  },
                  index,
                ) => {
                  let record = gridAllRows.find(
                    (e) => e.id == gridSubconscious.editingIndex[0],
                  );
                  let dirtyValue = record && dataKey ? record[dataKey] : "";

                  const { newDirtyValue } = inputValueChange(
                    record,
                    dataKey,
                    dirtyValue,
                    options,
                  );

                  if (editable) {
                    return (
                      <Styled.StyledFormDivComponent>
                        <Input
                          inputValidator={inputValidator}
                          label={label}
                          type={type}
                          row={record}
                          id={dataKey}
                          subconscious={subconscious}
                          dirtyValue={
                            gridSubconscious.editingIndex.includes("new_row")
                              ? gridConfig.fallbackRow[dataKey]
                                ? gridConfig.fallbackRow[dataKey]
                                : ""
                              : newDirtyValue
                          }
                          isDisabled={
                            gridSubconscious.editingIndex.includes("new_row")
                              ? false
                              : isDisabled
                          }
                          options={options === undefined ? [] : options}
                        />

                        {/* <Styled.StyledErrorDivComponent></Styled.StyledErrorDivComponent> */}
                      </Styled.StyledFormDivComponent>
                    );
                  }
                },
              )}

              <Styled.StyledFooterDivComponent>
                <GenericButton
                  // id={`${gatewayServices}-distributed-identities-cancel-btn`}
                  id={`generic-button-distributed-identities-cancel-btn`}
                  buttonName={"Cancel"}
                  backgroundColor="secondary"
                  disabled={""}
                  onClick={() => {
                    //   props.handleClosePortal();
                    props.handleClose([]);
                    //   setTimeoutHelperText("");
                    //   setGroupsHelperText("");
                  }}
                />
                <GenericButton
                  // id={`${gatewayServices}-distributed-identities-save-btn`}
                  id={`generic-button-distributed-identities-save-btn`}
                  backgroundColor="primary"
                  buttonName={
                    actionLoader ? <Styled.Spinner size={24} /> : "Save"
                  }
                  disabled={actionLoader ? true : false}
                  // buttonRef={buttonForSaveRef}
                  onClick={() => {
                    handleSave();
                  }}
                />
              </Styled.StyledFooterDivComponent>
            </Styled.StyledFormContainer>
          </Styled.BodyDivComponent>
        </Styled.StyledMainDivComponent>
        <AlertDialog
          divider={false}
          open={dialogOpen}
          setOpen={setDialogOpen}
          contentTitle={`Error`}
          contentText={"API failed"}
          agreeTitle={"Okay"}
          handleAgree={() => setDialogOpen(false)}
          handleDisagree={() => setDialogOpen(false)}
        />
      </Styled.StyledContainer>
    </>
  );
}

export default EditContentPopup;
