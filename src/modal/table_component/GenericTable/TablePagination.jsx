// import "@fontsource/montserrat/300.css";
// import "@fontsource/montserrat/400.css";
// import "@fontsource/montserrat/500.css";
// import "@fontsource/montserrat/600.css";
import {
  Box,
  CircularProgress,
  Grow,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
} from "@mui/icons-material";
import { useState } from "react";
import styled from "@emotion/styled";
import ToolerTip from "./ToolerTip";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";

function TablePagination(props) {
  const [gridSubconscious, setGridSubconscious] = props.subconscious;

  const [gridAllRows, setGridAllRows] = props.rows;

  const [loading, setLoading] = props.loadingData;

  const footerLoader = useState({
    nextPage: false,
    lastPage: false,
  });

  const [footerLoading, setFooterLoading] = footerLoader;

  function handleNextPageClick() {
    setFooterLoading((preState) => ({ ...preState, nextPage: true }));
    setTimeout(() => {
      setFooterLoading((preState) => ({ ...preState, nextPage: false }));
      if (gridSubconscious.pagination.endData <= props.dataRow.length) {
        setGridSubconscious((preState) => ({
          ...preState,
          pagination: {
            ...preState.pagination,
            startData: preState.pagination.endData + 1,
            endData: preState.pagination.endData + preState.pagination.pageSize,
          },
        }));
      }
    }, 1500);
  }

  function handleLastPageClick() {
    setFooterLoading((preState) => ({ ...preState, lastPage: true }));
    if (
      gridSubconscious.pagination.endData !== props.dataRow.length &&
      gridSubconscious.pagination.endData < props.dataRow.length
    ) {
      setTimeout(() => {
        setFooterLoading((preState) => ({ ...preState, lastPage: false }));
        if (props.dataRow.length > gridSubconscious.pagination.pageSize) {
          let modulesValue =
            props.dataRow.length % gridSubconscious.pagination.pageSize;
          setGridSubconscious((preState) => ({
            ...preState,
            pagination: {
              ...preState.pagination,
              startData: modulesValue
                ? props.dataRow.length - modulesValue + 1
                : props.dataRow.length - preState.pagination.pageSize,
              endData: props.dataRow.length,
            },
          }));
        }
      }, 1500);
    } else {
      setFooterLoading((preState) => ({ ...preState, lastPage: true }));
      gridSubconscious.handleLoadMoreData(
        props.rows,
        props.subconscious,
        footerLoader,
      );
    }
  }

  return (
    <IFVDataGridTablePaginationContainer
      className={"IFV-DataGrid-table-pagination"}
    >
      {loading && (
        <StyledSkeletonHolder>
          <WidthFillerSkeleton height="30px" />
        </StyledSkeletonHolder>
      )}

      {!loading && (
        <>
          <IFVDataGridTablePaginationLeftPane
            className={"IFV-DataGrid-table-pagination-left-pane"}
          >
            {props.selectedRowKeys.length ? (
              <SelectedRowsText>
                {props.selectedRowKeys.length} rows selected
              </SelectedRowsText>
            ) : (
              <></>
            )}
          </IFVDataGridTablePaginationLeftPane>

          {props.dataRow.length ? (
            <IFVDataGridTablePaginationRightPane
              className={"IFV-DataGrid-table-pagination-left-pane"}
            >
              <Styled.Text>Showing</Styled.Text>
              <ToolerTip
                title={"List of Options for number of rows per page"}
                followCursor
                arrow
                disableFocusListener
                disableHoverListener
                disableTouchListener
                enterDelay={100}
                enterNextDelay={100}
                leaveDelay={0}
                TransitionComponent={Grow}
                TransitionProps={{ timeout: 100 }}
              >
                <StyledSelect
                  labelId="ifvdg-page-size-selector-label"
                  id="ifvdg-page-size-selector"
                  value={gridSubconscious.pagination.pageSize}
                  onChange={(event) => {
                    setGridSubconscious((preState) => ({
                      ...preState,
                      pagination: {
                        ...preState.pagination,
                        startData: 1,
                        pageSize: event.target.value,
                        endData: event.target.value,
                      },
                    }));
                  }}
                  variant="outlined"
                  size="small"
                >
                  {[5, 10, 20, 30, 40, 50].map((option) => (
                    <MenuItem
                      key={Math.random().toString(16).slice(2).toUpperCase()}
                      value={option}
                    >
                      {option === 0 ? "ALL" : option}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </ToolerTip>
              <Styled.Text>records per page</Styled.Text>
              <PaginationButtons>
                <ToolerTip TransitionComponent={Grow} title={"First Page"}>
                  <StyledIconButton
                    disabled={gridSubconscious.pagination.startData === 1}
                    onClick={() => {
                      setGridSubconscious((preState) => ({
                        ...preState,
                        pagination: {
                          ...preState.pagination,
                          startData: 1,
                          endData: preState.pagination.pageSize,
                        },
                      }));
                    }}
                  >
                    <FirstPage
                      style={{
                        fontSize: "0.85em",
                        color: "#003152",
                      }}
                    />
                  </StyledIconButton>
                </ToolerTip>
                <ToolerTip TransitionComponent={Grow} title={"Previous Page"}>
                  <StyledIconButton
                    disabled={gridSubconscious.pagination.startData === 1}
                    onClick={() => {
                      // setPagination((subcon) => {
                      //   let newSubcon = { ...subcon };
                      //   newSubcon.startData =
                      //     newSubcon.startData - newSubcon.pageSize;
                      //   newSubcon.endData = newSubcon.endData - newSubcon.pageSize;
                      //   return newSubcon;
                      // });
                      setGridSubconscious((preState) => ({
                        ...preState,
                        pagination: {
                          ...preState.pagination,
                          startData:
                            preState.pagination.startData -
                            preState.pagination.pageSize,
                          endData:
                            preState.pagination.endData -
                            preState.pagination.pageSize,
                        },
                      }));
                    }}
                  >
                    <NavigateBefore
                      style={{
                        fontSize: "0.85em",
                        color: "rgba(2, 147, 254, 1)",
                      }}
                    />
                  </StyledIconButton>
                </ToolerTip>
                <StyledPaginationText>
                  {gridSubconscious.pagination.startData} -{" "}
                  {gridSubconscious.pagination.endData <= props.dataRow.length
                    ? gridSubconscious.pagination.endData
                    : props.dataRow.length}{" "}
                  of {props.dataRow.length}
                </StyledPaginationText>

                {footerLoading.nextPage ? (
                  <div style={{ padding: "0.28em" }}>
                    <Styled.Spinner
                      style={{ width: "1.5em", height: "1.5em" }}
                    />
                  </div>
                ) : (
                  <ToolerTip TransitionComponent={Grow} title={"Next Page"}>
                    <StyledIconButton
                      disabled={
                        gridSubconscious.pagination.endData >=
                        props.dataRow.length
                      }
                      onClick={handleNextPageClick}
                    >
                      <NavigateNext
                        style={{
                          fontSize: "0.85em",
                          color: "rgba(2, 147, 254, 1)",
                        }}
                      />
                    </StyledIconButton>
                  </ToolerTip>
                )}

                {footerLoading.lastPage ? (
                  <div style={{ padding: "0.28em" }}>
                    <Styled.Spinner
                      style={{ width: "1.5em", height: "1.5em" }}
                    />
                  </div>
                ) : (
                  <ToolerTip TransitionComponent={Grow} title={"Last Page"}>
                    <StyledIconButton
                      // disabled={
                      //   gridSubconscious.pagination.endData >=
                      //   props.dataRow.length
                      // }
                      onClick={handleLastPageClick}
                    >
                      <LastPage
                        style={{ fontSize: "0.85em", color: "#003152" }}
                      />
                    </StyledIconButton>
                  </ToolerTip>
                )}
              </PaginationButtons>
            </IFVDataGridTablePaginationRightPane>
          ) : (
            <IFVDataGridTablePaginationRightPane
              className={"IFV-DataGrid-table-pagination-right-pane"}
            >
              <StyledNoRecordsMessageHolder>
                Pagination options will appear when there is at least one record
                to show.
              </StyledNoRecordsMessageHolder>
            </IFVDataGridTablePaginationRightPane>
          )}
        </>
      )}
    </IFVDataGridTablePaginationContainer>
  );
}

export default TablePagination;

const IFVDataGridTablePaginationContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-shrink: 0;
  width: -webkit-fill-available;
  border-radius: 0em 0em 0.5em 0.5em;
  background-color: #fff;
  border: 0.1em solid rgba(2, 147, 254, 0.2);
  border-width: 0 0.1em 0.1em 0.1em;
  height: 3rem;
`;

const IFVDataGridTablePaginationRightPane = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: nowrap;
  flex-grow: 1;
  /* font-family: Montserrat; */
  color: #554949;
  font-weight: 300;
  font-size: 1em;
`;

const IFVDataGridTablePaginationLeftPane = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  flex-grow: 1;
  /* font-family: Montserrat; */
  font-weight: 300;
  font-size: 1em;
  /* height: 50%; */
  padding: 0.5rem 1rem;
`;

const SelectedRowsText = styled(Typography)`
  display: block;
  background-color: rgba(2, 147, 254, 1);
  color: #fff;
  padding: 0.25em 0.75em;
  border-radius: 0.25em;
  font-size: 1.25em;
  line-height: 1.25em;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  font-weight: 400;
`;

const Styled = {
  Text: styled(Typography)`
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
  `,
  SelectedRowsText: styled(Typography)`
    display: block;
    background-color: rgba(2, 147, 254, 1);
    color: #fff;
    padding: 0.25em 0.75em;
    border-radius: 0.25em;
    font-size: 1.25em;
    line-height: 1.25em;
    /* font-family: "Montserrat"; */
    font-weight: 400;
  `,
  Spinner: styled(CircularProgress)`
    &.MuiCircularProgress-colorPrimary {
      color: #0094fd;
    }
  `,
};

const StyledSelect = styled(Select)`
  margin: 0.5em;
  font-size: 1em;

  & .MuiSelect-root {
    padding: 0.5em 2.5em 0.5em 0.75em;
  }
`;

const PaginationButtons = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  margin: 0em 1em;
  padding: 0em 0.5em;
  border-left: 0.1em solid rgba(2, 147, 254, 1);
`;

const StyledIconButton = styled(IconButton)`
  padding: 0.25em;
  cursor: pointer;

  &:hover {
    background-color: rgba(2, 147, 254, 0.1);
  }

  &.MuiIconButton-root.Mui-disabled {
    opacity: 0.4;
  }
`;

const StyledPaginationText = styled(Typography)`
  font-size: 1em;
  margin: 0em 0.5em;
  /* font-weight: 300; */
`;

const StyledNoRecordsMessageHolder = styled(Box)`
  padding: 1em 1em 1em 0em;
`;

const StyledSkeletonHolder = styled(Box)`
  width: 100%;
  padding: 0.5em 0.5em 0.5em 0em;
`;
