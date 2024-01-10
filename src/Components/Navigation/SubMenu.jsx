import { Box, ButtonBase, Typography, useTheme } from "@mui/material";
import { styled } from "styled-components";

// Utils
import genKey from "../../utils/genKey";

const SubMenu = (props) => {
  const { palette } = useTheme();

  const clickHandler = (subMenuItem) => {
    setTimeout(() => {
      props.handleMenuJump(subMenuItem.path.slice(1), true);
    }, 300);
  };

  return (
    <Styled.SubMenuWrapper
      $isSideMenuOpened={props.isSideMenuOpened}
      $isSelected={props.menuItem.isSelected}
    >
      {props.menuItem.subMenu.map((subMenuItem) => (
        <Box key={genKey(subMenuItem.path.slice(1))}>
          <Styled.ButtonBase
            id={subMenuItem.path.slice(1)}
            onClick={() => clickHandler(subMenuItem)}
            $isSelected={subMenuItem.isSelected}
            $backgroundColor={palette.primary.main}
            $isSelectedBackgroundColor={palette.primary[600]}
          >
            <Styled.MenuWrapper color={palette.grey["100"]}>
              <Styled.IconWrapper>
                {/* {subMenuItem.iconElement} */}
              </Styled.IconWrapper>

              <Styled.MenuTextWrapper
                $isSideMenuOpened={props.isSideMenuOpened}
              >
                <Styled.MenuText $isSelected={subMenuItem.isSelected}>
                  {subMenuItem.name}
                </Styled.MenuText>
              </Styled.MenuTextWrapper>
            </Styled.MenuWrapper>
          </Styled.ButtonBase>
        </Box>
      ))}
    </Styled.SubMenuWrapper>
  );
};

export default SubMenu;

const Styled = {
  ButtonBase: styled(ButtonBase)`
    width: 100%;
    background-color: ${(props) =>
      props.$isSelected ? props.$isSelectedBackgroundColor : ""};

    :hover {
      background-color: ${(props) => props.$backgroundColor};
    }
  `,
  MenuWrapper: styled(Box)`
    height: 2.6rem;
    width: 100%;
    display: flex;
    /* justify-content: space-between; */
    align-items: center;
  `,
  IconWrapper: styled(Box)`
    height: 100%;
    width: 58px;
    display: grid;
    place-items: center;
    margin-left: 0.4rem;
  `,
  MenuTextWrapper: styled(Box)`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    display: ${(props) => (props.$isSideMenuOpened ? "auto" : "none")};
  `,
  MenuText: styled(Typography)`
    font-size: 0.8rem;
    font-weight: ${(props) => (props.$isSelected ? 500 : 400)};
  `,
  SubMenuWrapper: styled(Box)`
    width: 100%;
    height: max-content;
    background: #ffffff10;
    display: ${(props) =>
      props.$isSelected && props.$isSideMenuOpened ? "auto" : "none"};
  `,
};
