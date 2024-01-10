import { Tooltip } from "@mui/material";

function TooltipIconArrow({ textContent, children }) {
  return (
    <>
      <Tooltip
        title={<span style={{ fontSize: "0.653rem" }}>{textContent}</span>}
        arrow
      >
        {children}
      </Tooltip>
    </>
  );
}

export function TooltipIconDisable({ children }) {
  return <Tooltip disabled>{children}</Tooltip>;
}

export default TooltipIconArrow;
