import { Styled } from "./Menu.style";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Icons
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

const Menu = (props) => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  const clickHandler = () => {
    setTimeout(() => {
      props.handleMenuJump(props.menuItem.path.slice(1));
      navigate(props.menuItem.path === "/home" ? "/" : props.menuItem.path);
    }, 300);
  };

  return (
    <Styled.ButtonBase
      onClick={clickHandler}
      $isSelected={props.menuItem.isSelected}
      $backgroundColor={palette.primary.main}
      $isSelectedBackgroundColor={palette.primary[600]}
    >
      <Styled.MenuWrapper color={palette.grey["100"]}>
        <Styled.IconWrapper>{props.menuItem.iconElement}</Styled.IconWrapper>

        <Styled.MenuTextWrapper $isSideMenuOpened={props.isSideMenuOpened}>
          <Styled.MenuText $isSelected={props.menuItem.isSelected}>
            {props.menuItem.name}
          </Styled.MenuText>
        </Styled.MenuTextWrapper>

        <Styled.AccordionWrapper
          $isSideMenuOpened={props.isSideMenuOpened}
          $isSubMenu={props.menuItem.subMenu.length}
        >
          {props.menuItem.isSelected ? (
            <KeyboardArrowUpOutlinedIcon />
          ) : (
            <KeyboardArrowDownOutlinedIcon />
          )}
        </Styled.AccordionWrapper>
      </Styled.MenuWrapper>
    </Styled.ButtonBase>
  );
};

export default Menu;
