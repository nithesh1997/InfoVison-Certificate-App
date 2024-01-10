import { Fade, Tooltip } from "@mui/material";
import React from "react";

const ToolerTip = ({ children, ...props }) => {
  return (
    <React.Fragment>
      <Tooltip
        arrow
        disableFocusListener
        enterDelay={100}
        enterNextDelay={100}
        leaveDelay={0}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
        {...props}
      >
        {children}
      </Tooltip>
    </React.Fragment>
  );
};

export default ToolerTip;
