import { Grid } from "@mui/material";
import { Card } from "./Card";
import cards from "./cardData";
import { useNavigate } from "react-router-dom/dist";
import { Styled } from "./Home.style";
import genKey from "src/utils/genKey";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Styled.Wrapper>
      {cards.map((e) => (
        <Grid key={genKey(e.path.slice(1))} onClick={() => navigate(e.path)}>
          <Card label={e.label} translationMap={e.translationMap}>
            <img src={e.src} alt={e.label} />
          </Card>
        </Grid>
      ))}
    </Styled.Wrapper>
  );
};

export default Home;
