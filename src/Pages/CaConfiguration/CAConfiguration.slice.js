import { createSlice } from "@reduxjs/toolkit";

export const CAConfigurationSlice = createSlice({
  name: "CAConfigurationType",
  initialState: "Private Key",
  reducers: {
    toggle: (state, param) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return param.payload === "Private Key" ? "Windows CA" : "Private Key";
    },
    setType: (state, param) => {
      return param.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggle, setType } = CAConfigurationSlice.actions;

export default CAConfigurationSlice.reducer;
