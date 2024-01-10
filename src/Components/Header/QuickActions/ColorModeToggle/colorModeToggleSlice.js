import { createSlice } from "@reduxjs/toolkit";

export const colorModeToggleSlice = createSlice({
  name: "colorMode",
  initialState: "light",
  reducers: {
    toggle: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return state === "light" ? "dark" : "light";
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggle } = colorModeToggleSlice.actions;

export default colorModeToggleSlice.reducer;
