import { useEffect, useRef, useState, useContext } from "react";
import { AbstractSwitch } from "./Varients/AbstractSwitch";
import { initialInputHandlerState } from "./hooks/initialState/initialInputHandlerState";
import { useInputColorState } from "./hooks/useInputColorState";
import { useInputFlagState } from "./hooks/useInputFlagState";
import { useInputHandlerState } from "./hooks/useInputHandlerState";
import { useHelperColorState } from "./hooks/useHelperColorState";
import { colorStatus } from "./defaults/colorStatus";
import { INPUT_WRAPPER } from "./styled-materials/INPUT_WRAPPER";
import { CONTENT_WRAPPER } from "./styled-materials/CONTENT_WRAPPER";
import { HELPER_CONTAINER } from "./styled-materials/HELPER_CONTAINER";
import { HELPER_WRAPPER } from "./styled-materials/HELPER_WRAPPER";
import { HELPER } from "./styled-materials/HELPER";
import { key } from "./defaults/key";
import ToolerTip from "../ToolerTip";
import styled from "@emotion/styled";
import { Box } from "@mui/system";
import { IconButton } from "@mui/material";
import SettingsBackupRestoreSharpIcon from "@mui/icons-material/SettingsBackupRestoreSharp";
import { useInputState } from "./hooks/useInputState";
import { useHelperState } from "./hooks/useHelperState";
import { TableContext } from "../context-api/TableContext";

function Input(props) {
  const {
    setValidationHandler,
    validationHandler,
    saveValidationCheck,
    setSaveValidationCheck,
    updatingRowValues,
    setUpdatingRowValues,
    colState,
    setColState,
  } = useContext(TableContext);

  let propRow = props.row ? props.row : { id: "new_row" };

  let row = Object.keys(propRow).reduce((acc, cur) => {
    let checkColumnKeys = colState
      .filter((e) => e.dataKey !== "__action")
      .map((e) => e.dataKey);
    if (checkColumnKeys.includes(cur) || cur === "id") {
      acc[cur] = propRow[cur];
    }
    return acc;
  }, {});

  const [errorMessage, setErrorMessage] = useState("");

  const [gridSubconscious, setGridSubconscious] = props.subconscious;

  const [inputColorState, setInputColorState, initialInputColorState] =
    useInputColorState();
  const [
    handleHoverEnter,
    handleHoverLeave,
    handleFocus,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    handlerClear,
    handleOk,
    inputHandlerState,
  ] = useInputHandlerState(initialInputHandlerState);

  const handleValidation = inputHandlerState.onValidation;

  const [inputFlagState, setInputFlagState] = useInputFlagState();

  const [inputState, setInputState] = useInputState();

  const [helperState, setHelperState] = useHelperState();

  const [helperColorState, setHelperColorState] = useHelperColorState();

  const [savePoint, setSavePoint] = useState(false);

  const [keyPress, setKeyPress] = useState({ key: "" });

  const inputRef = useRef();

  let checkKeyRender = Object.keys(
    gridSubconscious?.editUpdateValues[row.id]
      ? gridSubconscious?.editUpdateValues[row.id]
      : {},
  ).length;

  useEffect(() => {
    // setUpdatingRowValues({[row.id]:{...row}})
    setGridSubconscious((preState) => ({
      ...preState,
      editUpdateValues: {
        ...preState.editUpdateValues,
        [row.id]: { ...row },
      },
    }));
  }, []);

  useEffect(() => {
    if (saveValidationCheck === row.id) {
      handleErrorMessage();
    }
  }, [saveValidationCheck, checkKeyRender]);

  useEffect(() => {
    setInputState((oldState) => ({
      ...oldState,
      // id: `${props.dataKey}-${props.dataId}`,
      label: props.label,
      name: `${props.dataKey}-${props.dataId}`,
      //   type: type(props.type),
      type: props.type,
      //   className: props.className || "",
      placeholder: props.label,
      options: [...props.options],
      value: props.dirtyValue,
      dirtyValue: props.dirtyValue,
    }));
  }, [props.options.length, props.type]);

  useEffect(() => {
    if (props.isDisabled) {
      setInputFlagState((preState) => ({
        ...preState,
        isOk: false,
        isDisabled: true,
        isError: false,
      }));
    }
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setInputFlagState((preState) => ({
        ...preState,
        isOk: false,
        isDisabled: false,
        isError: true,
      }));
    } else if (props.isDisabled) {
      setInputFlagState((preState) => ({
        ...preState,
        isOk: false,
        isDisabled: true,
        isError: false,
      }));
    } else {
      setInputFlagState((preState) => ({
        ...preState,
        isOk: true,
        isDisabled: false,
        isError: false,
      }));
    }
  }, [errorMessage]);

  // # creates validation handlers for each columns
  useEffect(() => {
    setValidationHandler((oldState) => ({
      ...oldState,
      [props.id]: props.inputValidator,
    }));
  }, []);

  const setStore = {
    setInputState,
    setInputFlagState,
    setHelperState,
    setSavePoint,
  };

  // # Props Object for Input Component
  const InputProps = {
    InputState: [inputState, setInputState],
    InputColorState: [inputColorState, setInputColorState],
    InputFlagState: [inputFlagState, setInputFlagState],
    InputHandlerState: [
      handleHoverEnter,
      handleHoverLeave,
      handleFocus,
      handleBlur,
      handleChange,
      handleSubmit,
      handleReset,
      handlerClear,
      handleOk,
      inputHandlerState.onValidation,
    ],
    HelperState: [helperState, setHelperState],
    HelperColorState: [helperColorState, setHelperColorState],
    inputRef,
    /* NEED TO REMOVE BY REFACTOR */
    // SavePoint: [savePoint, setSavePoint],
    // DirtyRow: [dirtyRow, setDirtyRow],
  };

  useEffect(() => {
    setInputColorState({
      labelColor: colorStatus.isPristine,
      borderColor: colorStatus.isPristine,
      backgroundColor: colorStatus.isPristine.concat("08"),

      labelColorOnHover: colorStatus.isHovered,
      borderColorOnHover: colorStatus.isHovered,
      backgroundColorOnHover: colorStatus.isHovered.concat("08"),

      labelColorOnFocus: colorStatus.isFocused,
      borderColorOnFocus: colorStatus.isFocused,
      backgroundColorOnFocus: colorStatus.isFocused.concat("08"),
    });
  }, []);

  // # map inputColorState for isDisabled Flag
  useEffect(() => {
    inputFlagState.isDisabled
      ? setInputColorState({
          labelColor: colorStatus.isDisabled,
          borderColor: colorStatus.isDisabled,
          backgroundColor: colorStatus.isDisabled.concat("20"),

          labelColorOnHover: colorStatus.isDisabled,
          borderColorOnHover: colorStatus.isDisabled,
          backgroundColorOnHover: colorStatus.isDisabled.concat("20"),

          labelColorOnFocus: colorStatus.isDisabled,
          borderColorOnFocus: colorStatus.isDisabled,
          backgroundColorOnFocus: colorStatus.isDisabled.concat("20"),
        })
      : inputFlagState.isError
      ? setInputColorState({
          labelColor: colorStatus.isError,
          borderColor: colorStatus.isError,
          backgroundColor: colorStatus.isError.concat("08"),

          labelColorOnHover: colorStatus.isError,
          borderColorOnHover: colorStatus.isError,
          backgroundColorOnHover: colorStatus.isError.concat("08"),

          labelColorOnFocus: colorStatus.isError,
          borderColorOnFocus: colorStatus.isError,
          backgroundColorOnFocus: colorStatus.isError.concat("08"),
        })
      : setInputColorState({ ...initialInputColorState });

    // if (props.column.dataKey === "certificateExpiryDate") {
    //   const color =
    //     props.row.expiryDays <= 30
    //       ? "#ff0000"
    //       : props.row.expiryDays <= 60
    //       ? "#FF8C00"
    //       : props.row.expiryDays <= 90
    //       ? "#01b508"
    //       : undefined;

    //   setInputColorState({
    //     labelColor: color ?? colorState.isPristine,
    //     borderColor: color ?? colorState.isDisabled,
    //     backgroundColor:
    //       color?.concat("10") ?? colorState.isDisabled.concat("20"),

    //     labelColorOnHover: color ?? colorState.isPristine,
    //     borderColorOnHover: color ?? colorState.isDisabled,
    //     backgroundColorOnHover:
    //       color?.concat("10") ?? colorState.isDisabled.concat("20"),

    //     labelColorOnFocus: color ?? colorState.isPristine,
    //     borderColorOnFocus: color ?? colorState.isDisabled,
    //     backgroundColorOnFocus:
    //       color?.concat("20") ?? colorState.isDisabled.concat("20"),
    //   });
    // }
  }, [inputFlagState.isDisabled, inputFlagState.isError]);

  function handleErrorMessage(checkRestore) {
    let checkCellValue = { ...gridSubconscious.editUpdateValues[row.id] };

    if (checkRestore === "restore") {
      checkCellValue[props.id] = inputState.value;
    }
    if (typeof validationHandler[props.id] === "function") {
      setErrorMessage(
        validationHandler[props.id]("blur", checkCellValue).message,
      );
    }
  }

  return (
    <CONTENT_WRAPPER>
      <INPUT_WRAPPER>
        <AbstractSwitch
          /* Base Attributes */
          //   key={keyProp}
          id={props.id}
          //   name={inputState.name}
          //   className={`${inputState.className}-input`}
          disabled={inputFlagState.isDisabled}
          /* Accessability */
          label={props.label}
          /* Type */
          type={props.type}
          variant={"outlined"}
          /* Value Manipulation */
          autoComplete={false}
          options={inputState.options}
          value={inputState.dirtyValue}
          //   defaultValue={inputState.defaultValue}
          //   rawValue={inputState.rawValue}
          dirtyValue={inputState.dirtyValue}
          /* Handlers */
          onMouseOver={(event) =>
            handleHoverEnter(event, setStore, props.inputRef)
          }
          onMouseLeave={(event) =>
            handleHoverLeave(event, setStore, props.inputRef)
          }
          onFocus={(event) => {
            handleFocus(event, setStore, props.inputRef);
            setErrorMessage("");
          }}
          onBlur={(event) => {
            handleBlur(event, setStore, props.inputRef);
            handleErrorMessage();
          }}
          onChange={(event) => {
            handleChange(event, setStore, inputRef, props.id);
            setErrorMessage("");
            setGridSubconscious((preState) => ({
              ...preState,
              editUpdateValues: {
                ...preState.editUpdateValues,
                [row.id]: {
                  ...preState.editUpdateValues[String(row.id)],
                  [props.id]: event.target.value.trim(),
                },
              },
            }));
            setUpdatingRowValues((preState) => ({
              ...preState,
              [row.id]: {
                ...preState[row.id],
                [props.id]: event.target.value,
              },
            }));
          }}
          onSubmit={(event) => handleSubmit(event, setStore, props.inputRef)}
          onValidation={handleValidation}
          //   setStore={setStore}
          //   /* Key */
          onKeyPress={(event) => setKeyPress({ key: event.id })}
          //   /* Ref */
          //   inputRef={props.inputRef}
          /* Color */
          labelColor={inputColorState.labelColor}
          borderColor={inputColorState.borderColor}
          backgroundColor={inputColorState.backgroundColor}
          /* Color on Hover */
          labelColorOnHover={inputColorState.labelColor}
          borderColorOnHover={inputColorState.borderColorOnHover}
          backgroundColorOnHover={inputColorState.backgroundColorOnHover}
          /* Color on Focus */
          labelColorOnFocus={inputColorState.labelColorOnFocus}
          borderColorOnFocus={inputColorState.borderColorOnFocus}
          backgroundColorOnFocus={inputColorState.backgroundColorOnFocus}
          /* can override everything above and able to add new props */
          // {...override}
        />

        <HELPER_CONTAINER
          // display={helperState.length !== 0}
          display={errorMessage}
        >
          {/* {helperState.map((helperText) => ( */}
          <HELPER_WRAPPER
            key={`HELPER_TEXT_${key}`}
            borderColor={helperColorState.helperBorderColor}
            backgroundColor={helperColorState.helperBackgroundColor.concat(
              "08",
            )}
          >
            <HELPER
              textColor={helperColorState.helperBorderColor}
              style={{
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              {errorMessage}
            </HELPER>
          </HELPER_WRAPPER>
          {/* ))} */}
        </HELPER_CONTAINER>
      </INPUT_WRAPPER>

      <ToolerTip title={"Restore to Default"}>
        <BUTTON_WRAPPER display={inputState.value !== inputState.dirtyValue}>
          <BUTTON_GROUP>
            <BUTTON
              onClick={(event) => {
                handleReset(event, setStore, inputRef);
                handleErrorMessage("restore");
              }}
            >
              <SettingsBackupRestoreSharpIcon
                fontSize="small"
                color="primary"
              />
            </BUTTON>
          </BUTTON_GROUP>
        </BUTTON_WRAPPER>
      </ToolerTip>
    </CONTENT_WRAPPER>
  );
}

export default Input;

const BUTTON_WRAPPER = styled(Box)`
  position: absolute;
  top: -0.5em;
  right: -0.5em;
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  background: #ceecff;
  display: ${({ display }) => (display ? "grid" : "none")};
  place-items: center;
`;

const BUTTON_GROUP = styled(Box)`
  width: 1.5em;
  height: 1.5em;
  border-radius: 0.25em;
  display: grid;
  place-items: center;
`;

const BUTTON = styled(IconButton)`
  padding: 0.1em;
  background: #3b82f620;
  color: #1f2937;
  /* top: -3px; */
  /* right: -0.5em; */
  /* right: 6px; */

  & svg {
    font-size: 0.7em;
  }

  &:hover {
    background: #3b82f640;
  }
`;
