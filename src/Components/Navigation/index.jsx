import * as React from "react";
import { Box, useTheme } from "@mui/material";
import { Styled } from "./navigation.style";

/* Components */
import SubMenu from "./SubMenu";
import { InitMenuState } from "./InitMenuState";

/* Assets */
import backgroundClip from "../../assets/light-mode/navigation-menu-blend-clip.png";

/* Utils */
import genKey from "src/utils/genKey";
import Menu from "./Menu";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useTranslation } from "react-i18next";

const isAdminCached = (ADMINISTRATOR) => {
  const user = JSON.parse(sessionStorage.getItem("profile-preferences")) ?? {};
  return user.role?.includes(ADMINISTRATOR);
};

const responsiveRoute = (isAdmin, t) => {
  const [invisipointClient] = InitMenuState(t).filter(
    (menu) => menu.path === "/invisipoint-client",
  );

  return isAdmin
    ? InitMenuState(t)
    : [
        {
          ...invisipointClient,
          isSelected: true,
        },
      ];
};

const HOME = "home";

const Navigation = (props) => {
  const { palette } = useTheme();

  const location = useLocation();
  const userStore = useSelector((store) => store.user);
  const navigate = useNavigate();

  const { t } = useTranslation();

  const ADMINISTRATOR = "Administrator";

  const isAdministrator = isAdminCached(ADMINISTRATOR);

  const [isSideMenuOpened, setIsSideMenuOpened] = props.IsSideMenuOpenedState;

  const [navigationMenu, setNavigationMenu] = React.useState(() =>
    responsiveRoute(isAdministrator, t),
  );
  const [lastActiveMenuID, setLastActiveMenuID] = React.useState(HOME);

  const toggleSideMenu = () => {
    setIsSideMenuOpened((oldState) => {
      const newState = !oldState;

      if (!newState && isAdministrator) {
        setNavigationMenu((oldState) => {
          const [activeMenu] = oldState.filter((menu) => menu.isSelected);
          const activeMenuID = activeMenu.path.slice(1);

          if (activeMenuID !== lastActiveMenuID) {
            const newState = oldState.map((menu) => ({
              ...menu,
              isSelected: menu.path.slice(1) === lastActiveMenuID,
            }));

            return newState;
          } else {
            return oldState;
          }
        });
      }

      return oldState;
    });
  };

  const handleMenuJump = (ID, isSubMenu) => {
    setNavigationMenu((oldState) => {
      const newState = oldState.map((menu) => {
        const menuID = menu.path.slice(1);

        // * Temporarily Commented
        // if (menu.subMenu.length && !isSubMenu && menuID === ID) {
        //   setIsSideMenuOpened(true);
        // }

        if (!isSubMenu && menuID === ID) {
          if (
            !menu.subMenu.length &&
            !menu.subMenu.filter(({ isSelected }) => isSelected).length
          ) {
            setLastActiveMenuID(menuID);
          }
        }

        return {
          ...menu,
          isSelected: isSubMenu ? menu.isSelected : menuID === ID,
          subMenu: menu.subMenu.map((subMenu) => {
            const subMenuID = subMenu.path.slice(1);

            if (!subMenu.isSelected && subMenuID === ID) {
              setLastActiveMenuID(menuID);
            }

            return {
              ...subMenu,
              isSelected: !subMenu.isSelected && subMenuID === ID,
            };
          }),
        };
      });

      return newState;
    });
  };

  React.useEffect(() => {
    const [currentPath] = location.pathname.split("/").filter((_) => _);
    const isInvisipointClient = currentPath !== "invisipoint-client";

    if (isAdministrator) {
      setNavigationMenu((oldState) =>
        oldState.map((menu) => ({
          ...menu,
          isSelected:
            (currentPath === undefined && menu.path === `/${HOME}`) ||
            menu.path === `/${currentPath}`,
        })),
      );
    }

    if (!isAdministrator && !currentPath) {
      navigate("invisipoint-client");
    }

    if (!isAdministrator && isInvisipointClient && currentPath) {
      throw new Error("Only Administrator Can Access This Page ⚠️");
    }
  }, [isAdministrator, location.pathname, navigate, userStore.role]);

  return (
    <Styled.Wrapper
      $isSideMenuOpened={isSideMenuOpened}
      $backgroundColor={palette.secondary.main}
      $backgroundImage={backgroundClip}
    >
      {/*
      <ToggleSideMenu
        isSideMenuOpened={isSideMenuOpened}
        toggleSideMenu={toggleSideMenu}
      />
      */}

      {navigationMenu.map((menuItem) => {
        return (
          <Box key={genKey(menuItem.path.slice(1))}>
            <Menu
              menuItem={menuItem}
              isSideMenuOpened={isSideMenuOpened}
              handleMenuJump={handleMenuJump}
            />

            <SubMenu
              menuItem={menuItem}
              isSideMenuOpened={isSideMenuOpened}
              handleMenuJump={handleMenuJump}
            />
          </Box>
        );
      })}
    </Styled.Wrapper>
  );
};

export default Navigation;
