/* Style */
import { Styled } from "./footer.style";
import { useTheme } from "@mui/material";

const Footer = () => {
  const ProjectName = "InvisiNet";
  const copyRightedYear = new Date().getFullYear();

  const { palette } = useTheme();

  return (
    <Styled.Wrapper>
      <Styled.Version color={palette.grey[500]} style={{ display: "none" }}>
        {import.meta.env.VITE_APP_VERSION}
      </Styled.Version>

      <Styled.Text color={palette.grey[500]}>
        © {copyRightedYear} {ProjectName}
      </Styled.Text>
    </Styled.Wrapper>
  );
};

export default Footer;
