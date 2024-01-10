import React from "react";

const initialHelperColorState = {
  helperTextColor: "#F9F9F9",
  helperBorderColor: "#EF4444",
  helperBackgroundColor: "#EF4444",
};

export const useHelperColorState = (initialState = initialHelperColorState) => {
  const [state, setState] = React.useState(() =>
    typeof initialState === "function" ? initialState() : initialState,
  );

  return [state, setState];
};
