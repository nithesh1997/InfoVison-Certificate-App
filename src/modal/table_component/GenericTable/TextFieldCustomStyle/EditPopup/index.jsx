import styled from "@emotion/styled";
import EditContentPopup from "./EditContentPopup";
import { GlobalModal } from "./styled-materials/GlobalModal";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";

function EditPopup(props) {
  const [distributedIdentitiesPopupShown, setDistributedIdentitiesPopupShown] =
    useState(false);

  const { form, mergedColumns, subconscious, rows, tableConfig } = props;
  const [editPopStatus, setEditPopStatus] = props.editPopStatus;
  const [gridSubconscious, setGridSubconscious] = subconscious;
  const [gridConfig, setGridConfig] = tableConfig;

  const handleClose = () => {
    props.discard(
      gridSubconscious.editingIndex[0],
      subconscious,
      props.setSaveValidationCheck,
    );
    setGridSubconscious((preState) => ({
      ...preState,
      editingIndex: [],
    }));
    setEditPopStatus(false);
  };

  useEffect(() => {
    if (
      gridSubconscious.editingIndex.includes("new_row") &&
      gridConfig.editMode == "popup"
    ) {
      setEditPopStatus(true);
    }
  }, [gridSubconscious.editingIndex.length]);

  return (
    <StyledOverlayContentThatFadesIn hidden={distributedIdentitiesPopupShown}>
      <GlobalModal
        open={editPopStatus}
        Content={
          <>
            <EditContentPopup
              handleClose={(e) => handleClose()}
              form={form}
              mergedColumns={mergedColumns}
              save={props.save}
              subconscious={subconscious}
              rows={rows}
              tableConfig={tableConfig}
              col={props.columns}
              actionLoadState={props.actionLoadState}
              filterGridRow={props.filterGridRow}
            />
          </>
        }
      />
    </StyledOverlayContentThatFadesIn>
  );
}

export default EditPopup;

const StyledOverlayContentThatFadesIn = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: start;
  flex: 0 0 auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.5s ease-in;
  pointer-events: none;

  ${(props) => {
    if (props.hidden) {
      return `
        opacity: 1;
        pointer-events: all;
        transition: opacity 0.5s ease-out;
      `;
    }
  }}
`;
