import styled from "@emotion/styled";
import IconButton from "@mui/material/IconButton";
import { Table } from "antd";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/material";

export const Styled = {
  SkeletonHolder: styled(Box)`
    height: 100%;
    padding: 1em 1em 1em 0em;
  `,
  StyledTable: styled(Table)`
    .ant-table-container {
      width: 100%;
    }

    .ant-table-tbody > tr > td {
      /* height: 12px; */
      padding: 12px;
      /* padding: 0.8rem; */
    }

    .ant-table-body {
      height: ${(props) =>
        props.filterBy
          ? "calc(100vh - 434px) !important"
          : "calc(100vh - 375px) !important"};
    }

    tbody tr:nth-child(odd) {
      background-color: #f3f8fc;
      border-top: 2px solid red;
    }

    tbody tr:nth-child(even) {
      background-color: #fff;
    }

    .ant-table-thead.ant-table-thead th {
      border-bottom: 0.2rem solid rgba(2, 147, 254, 0.8);
      font-size: 0.9rem;
      font-weight: 600;
      color: #212121;
      background-color: #fff;
      min-height: 3rem;
    }

    .ant-table-tbody > tr:nth-child(odd) > td {
      border-top: 0.1em solid rgba(2, 147, 254, 0.2);
      border-bottom: 0.1em solid rgba(2, 147, 254, 0.2);
      background-color: #f3f8fc;
    }

    .ant-table-tbody > tr:nth-child(odd):hover {
      td {
        background-color: #f3f8fc;
      }
    }

    .ant-table-tbody > tr:nth-child(even):hover {
      td {
        background-color: #fff;
      }
    }

    border: 0.1em solid rgba(2, 147, 254, 0.2);
    border-radius: 8px 8px 0em 0em;
    background-color: rgba(2, 147, 254, 0.2);
  `,
  CustomIconButton: styled(IconButton)`
    &.danger {
      color: red;
    }

    &.key {
      color: rgb(41, 122, 27);
    }

    &.dangerDisabled {
      color: rgba(253, 0, 0, 0.51);
      cursor: default;
    }

    &.primaryDisabled {
      color: rgba(28, 134, 255, 0.6);
      cursor: default;
    }

    &.primary {
      color: #007bff;
    }

    &.primary-active {
      color: #ffffff;
      background-color: rgb(2, 147, 254);

      &:hover {
        color: #ffffff;
        background-color: rgb(2, 147, 254);
      }
    }

    &.success {
      color: green;
    }

    &.normal {
      color: black;

      &:hover {
        color: black;
        background-color: rgb(2, 147, 254);
      }
    }

    &.normal-active {
      color: black;

      &:hover {
        color: black;
        background-color: rgb(2, 147, 254);
      }
    }

    .MuiSvgIcon-root {
      font-size: 17px;
    }
  `,
  TableHeaderContainer: styled("div")`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
  `,
  TableHeaderActionContainer: styled("div")`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  TableHeaderFilterContainer: styled("div")`
    padding-top: 19px;
  `,
  TableHeader: styled("div")`
    width: "100%";
    cursor: ${(props) => (props.cursor == false ? "" : "pointer")};
    text-align: ${(props) => props.textAlign};
    text-decoration: ${(props) => (props.textDecoration ? "" : "underline")};
  `,
  Spinner: styled(CircularProgress)``,
  StyledSkeletonHolder: styled(Box)`
    width: 100%;
    padding: 0.5em 0.5em 0.5em 0em;
  `,

  TruncatedText: styled("div")`
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  `,

  IconButton: styled(IconButton)`
    padding: 0.35em;

    &:hover {
      background-color: ${(props) => props.hoverBg};
    }
  `,
};
