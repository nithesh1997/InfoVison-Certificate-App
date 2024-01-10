// import { TextField } from "@mui/material";
import { Form } from "antd";
import Input from "./TextFieldCustomStyle/Input";
import { Styled } from "./Table.style";
import inputValueChange from "./utile-function/inputValueChange";

const EditableCell = ({
  editing,
  dataKey,
  title,
  label,
  inputType,
  record,
  index,
  children,
  subconscious,
  isDisabled,
  options,
  inputValidator,
  editMode,
  ...restProps
}) => {
  let dirtyValue =
    record && dataKey
      ? typeof record[dataKey] === "number" ||
        typeof record[dataKey] === "boolean"
        ? String(record[dataKey])
        : typeof record[dataKey] === "string"
        ? record[dataKey]
        : ""
      : "";

  const { newDirtyValue, newChildren } = inputValueChange(
    record,
    dataKey,
    dirtyValue,
    options,
    children,
  );

  const inputNode =
    record && record.id == "new_row" ? (
      <Input
        inputValidator={inputValidator}
        label={label}
        type={inputType}
        row={record}
        id={""}
        subconscious={subconscious}
        dirtyValue={newDirtyValue}
        isDisabled={false}
        options={options === undefined ? [] : options}
      />
    ) : record && (Number(record.id) || record.id) ? (
      <Input
        inputValidator={inputValidator}
        label={label}
        type={inputType}
        row={record}
        id={dataKey}
        subconscious={subconscious}
        dirtyValue={newDirtyValue}
        isDisabled={isDisabled}
        options={options === undefined ? [] : options}
      />
    ) : (
      <></>
    );

  return (
    <td {...restProps}>
      {editing && (editMode === "inline" || editMode === undefined) ? (
        <Form.Item
          name={dataKey}
          style={{
            margin: 0,
            height: "100%",
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${label}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        <Styled.TruncatedText>{newChildren}</Styled.TruncatedText>
      )}
    </td>
  );
};

export default EditableCell;
