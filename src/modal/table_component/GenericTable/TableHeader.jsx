import { useContext, useEffect } from "react";
import { Styled } from "./Table.style";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import { TextField } from "@mui/material";
import { TableContext } from "./context-api/TableContext";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import TooltipIconArrow from "src/style/TextField/TooltipIconArrow";

const customTheme = (outerTheme) =>
  createTheme({
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "#007bff",
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "#007bff",
            },
          },
        },
      },
    },
  });

const TableHeader = ({
  title,
  columnDataKey,
  config,
  sortable,
  cols,
  rows,
  subconscious,
  filterGridRow,
}) => {
  const [gridConfig, setGridConfig] = config;

  const outerTheme = useTheme();
  const [gridCols, setGridCols] = cols;
  const [gridAllRows, setGridAllRows] = rows;
  const [gridSubconscious, setGridSubconscious] = subconscious;
  const { filterBy, setFilterBy, filterValues, setFilterValues } =
    useContext(TableContext);

  const [filterGridAllRow, setFilterGridAllRow] = filterGridRow;

  useEffect(() => {
    let checkSortDone = true;
    if (
      gridCols &&
      (filterGridAllRow.length || filterGridAllRow.length) &&
      checkSortDone
    ) {
      if (gridCols[0].dataKey == columnDataKey) {
        handleSortClick(columnDataKey, sortable, "mounting");
        checkSortDone = false;
      }
    }
  }, [filterGridAllRow.length, filterGridAllRow.length == gridAllRows.length]);

  useEffect(() => {
    setGridSubconscious((preState) => ({
      ...preState,
      editUpdateValues: {
        ...preState.editUpdateValues,
        new_row: {
          ...gridConfig.fallbackRow,
        },
      },
    }));
  }, []);

  const handleSortClick = (column, sortable, checkCycle) => {
    if (!sortable) {
      return;
    }

    let mountCount = 1;

    const newSortBy = { column, order: "none" };

    if (gridSubconscious.sort.column === column) {
      if (gridSubconscious.sort.order === "none") {
        newSortBy.order = "ascending";
      } else if (gridSubconscious.sort.order === "ascending") {
        if (checkCycle !== "mounting") {
          newSortBy.order = "descending";
        } else {
          mountCount = mountCount + 1;
          newSortBy.order = "ascending";
        }
      } else if (gridSubconscious.sort.order === "descending") {
        newSortBy.order = "ascending";
      }
      // else {
      //   newSortBy.order = "none";
      // }
    } else {
      newSortBy.order = "ascending";
    }

    setGridSubconscious((preState) => ({
      ...preState,
      sort: newSortBy,
    }));

    let sortedData = [];
    let filteredSortedData = [];
    if (mountCount !== 1 && checkCycle === "mounting") {
      sortedData = gridAllRows;
      filteredSortedData = filterGridAllRow;
    } else if (mountCount == 1 && checkCycle === "mounting") {
      sortedData = [...gridAllRows].sort(sortable[newSortBy.order]);
      filteredSortedData = [...filterGridAllRow].sort(
        sortable[newSortBy.order],
      );
    } else if (newSortBy.order !== "none") {
      sortedData = [...gridAllRows].sort(sortable[newSortBy.order]);
      filteredSortedData = [...filterGridAllRow].sort(
        sortable[newSortBy.order],
      );
    } else {
      sortedData = gridAllRows;
      filteredSortedData = filterGridAllRow;
    }

    setGridAllRows(sortedData);
    setFilterGridAllRow(filteredSortedData);
  };

  const filterTableData = (filterQuery) => {
    const filteredData = gridAllRows.filter((rowData) => {
      return Object.keys(filterQuery).every((column) => {
        const filterValue = filterQuery[column].toLowerCase();
        if (filterValue === "") {
          return true;
        }
        return rowData[column]?.toString().toLowerCase().includes(filterValue);
      });
    });
    // setSortBy({ order: "none", column: "key" });
    setGridSubconscious((preState) => ({
      ...preState,
      sort: { order: "none", column: "" },
    }));
    setFilterGridAllRow(filteredData);
  };
  return (
    <ThemeProvider theme={customTheme(outerTheme)}>
      <Styled.TableHeaderContainer>
        <Styled.TableHeader
          cursor={sortable}
          textAlign={title !== "Actions" ? "left" : "center"}
          textDecoration={
            gridSubconscious.sort.order === "none" ||
            gridSubconscious.sort.column !== columnDataKey
          }
          onClick={() => {
            handleSortClick(columnDataKey, sortable);
          }}
        >
          {title}
        </Styled.TableHeader>
        <Styled.TableHeaderActionContainer>
          {title !== "Actions" && title !== "Password" && (
            <TooltipIconArrow textContent={"Filter Data"}>
              <Styled.CustomIconButton
                className="normal-active"
                onClick={() => {
                  setFilterBy((state) => !state);
                  setGridAllRows(gridAllRows);
                }}
              >
                <FilterAltIcon />
              </Styled.CustomIconButton>
            </TooltipIconArrow>
          )}
          {!!sortable && (
            <TooltipIconArrow
              textContent={
                gridSubconscious.sort.order === "descending" &&
                gridSubconscious.sort.column === columnDataKey
                  ? "Descending"
                  : gridSubconscious.sort.column === columnDataKey
                  ? "Ascending"
                  : "Ascending Pending..."
              }
            >
              <Styled.CustomIconButton
                className={
                  gridSubconscious.sort.order === "none" ||
                  gridSubconscious.sort.column !== columnDataKey
                    ? `normal`
                    : `primary-active`
                }
                onClick={() => {
                  handleSortClick(columnDataKey, sortable);
                }}
              >
                {gridSubconscious.sort.order === "descending" &&
                gridSubconscious.sort.column === columnDataKey ? (
                  <SouthIcon />
                ) : (
                  <NorthIcon />
                )}
              </Styled.CustomIconButton>
            </TooltipIconArrow>
          )}
        </Styled.TableHeaderActionContainer>
      </Styled.TableHeaderContainer>

      {filterBy && title !== "Actions" && title !== "Password" && (
        <Styled.TableHeaderFilterContainer>
          <TextField
            sx={{
              "&.MuiTextField-root": { width: "100%", overflow: "none" },
              "& .MuiOutlinedInput-root.Mui-focused .MuiInputBase-input": {
                borderColor: "red",
              },
            }}
            type="search"
            label={`Search ${title}`}
            size="small"
            onChange={(e) => {
              const newFilterValues = {
                ...filterValues,
                [columnDataKey]: e.target.value,
              };
              setFilterValues(newFilterValues);
              filterTableData(newFilterValues);
            }}
          />
        </Styled.TableHeaderFilterContainer>
      )}
    </ThemeProvider>
  );
};

export default TableHeader;
