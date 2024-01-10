import React, { useState, createContext } from "react";

const TableContext = createContext();

const TableContextProvider = ({ children, value }) => {
  const [validationHandler, setValidationHandler] = useState({});
  const [filterBy, setFilterBy] = useState(false);
  const [updatingRowValues, setUpdatingRowValues] = useState({});

  return (
    <TableContext.Provider
      value={{
        validationHandler,
        setValidationHandler,
        updatingRowValues,
        setUpdatingRowValues,
        filterBy,
        setFilterBy,
        ...value,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export { TableContextProvider, TableContext };
