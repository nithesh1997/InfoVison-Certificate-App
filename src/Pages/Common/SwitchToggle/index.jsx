import * as React from "react";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { Box } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import "./style.css";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 26,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    // margin: 1,
    padding: 0,
    transitionDuration: "300ms",
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" class="ionicon"  height="15" width="15" viewBox="0 0 512 512"><path fill="${encodeURIComponent(
          "#203865",
        )}" stroke="${encodeURIComponent(
          "#fff",
        )}" stroke-linecap="round" stroke-linejoin="round" stroke-width="40" d="M32 415.5l120-320 120 320M230 303.5H74M326 239.5c12.19-28.69 41-48 74-48h0c46 0 80 32 80 80v144"/><path d="M320 358.5c0 36 26.86 58 60 58 54 0 100-27 100-106v-15c-20 0-58 1-92 5-32.77 3.86-68 19-68 58z" fill="${encodeURIComponent(
          "#203865",
        )}" stroke="${encodeURIComponent(
          "#fff",
        )}" stroke-linecap="round" stroke-linejoin="round" stroke-width="40"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "transparent",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#203865",
    width: 24,
    height: 24,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" class="ionicon"  height="15" width="15" viewBox="0 0 512 512"><path d="M200.66 352H144a96 96 0 010-192h55.41M312.59 160H368a96 96 0 010 192h-56.66M169.07 256h175.86" fill="${encodeURIComponent(
        "#203865",
      )}" stroke="${encodeURIComponent(
        "#fff",
      )}" stroke-linecap="round" stroke-miterlimit="10" stroke-width="44"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 0.7,
    backgroundColor: "transparent",
    borderRadius: 20 / 2,
  },
}));

const ContainerBox = styled(Box)`
  background-color: ${(props) =>
    props.selectedOption === "textField" ? "#87CEFA" : "#afdefbc2"};
  height: 29px;
  width: 47px;
  border-radius: 20px;
  padding: 2px 0;
`;

export default function CustomizedSwitches({ selectedField }) {
  const { selectedOption, setSelectedOption } = selectedField;
  return (
    <ContainerBox selectedOption={selectedOption}>
      <FormControlLabel
        control={
          <MaterialUISwitch
            onClick={() => {
              setSelectedOption(
                selectedOption === "file" ? "textField" : "file",
              );
            }}
            sx={{ m: 1 }}
            defaultChecked={selectedOption === "textField"}
          />
        }
      />
    </ContainerBox>
  );
}
