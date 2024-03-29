// import Box from "@material-ui/core/Box";
// import Skeleton from "@material-ui/lab/Skeleton";
import { Box } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import styled from "@emotion/styled";

const Styled = {
  SkeletonFiller: styled(Box)`
    width: 100%;
    height: ${(props) => props.height};
  `,

  Skeleton: styled(Skeleton)`
    height: ${(props) => props.height};
    border-radius: 0.5em;
    background-color: ${(props) => props.bg};
  `,
};

export default Styled;
