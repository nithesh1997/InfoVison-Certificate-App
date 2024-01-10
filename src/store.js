import { configureStore } from "@reduxjs/toolkit";

/* Reducers */
import userReducer from "components/User/userSlice";
import colorModeToggleReducer from "components/Header/QuickActions/ColorModeToggle/colorModeToggleSlice";
import CAConfigurationReducer from "pages/CaConfiguration/CAConfiguration.slice";

export default configureStore({
  reducer: {
    user: userReducer,
    colorMode: colorModeToggleReducer,
    CAConfigurationType: CAConfigurationReducer,
  },
});
