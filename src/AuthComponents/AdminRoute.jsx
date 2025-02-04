import React, { useState,useEffect } from "react";
import { AppProvider, DashboardLayout, PageContainer, ThemeSwitcher } from '@toolpad/core';

import axios from "axios";
import { createTheme } from '@mui/material/styles';
import "./Styles/loadingPage.css";
import { base } from '../config';
const API_URL = base(window.env.AP)
import Notifications from './Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DescriptionIcon from '@mui/icons-material/Description';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import SchemaIcon from '@mui/icons-material/Schema';
import ApartmentIcon from '@mui/icons-material/Apartment';
import FenceIcon from '@mui/icons-material/Fence';
import AirIcon from '@mui/icons-material/Air';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import DataObjectIcon from '@mui/icons-material/DataObject';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ManageAccountsSharpIcon from '@mui/icons-material/ManageAccountsSharp';
import ModelTrainingSharpIcon from '@mui/icons-material/ModelTrainingSharp';
import CasesSharpIcon from '@mui/icons-material/CasesSharp';
import ListIcon from '@mui/icons-material/List';
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt"
import SettingsIcon from '@mui/icons-material/Settings';
import Person3Icon from '@mui/icons-material/Person3';
import DangerousIcon from '@mui/icons-material/Dangerous';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { useDemoRouter } from './Route';
import { Box } from "@mui/material";
import { useLocation, Outlet } from "react-router-dom";
import { useActivePage } from "@toolpad/core";
import Fade from '@mui/material/Fade';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import logo from "./350.png";
const logout = () => {
  axios
    .get(`${API_URL}/logout`, { withCredentials: true })
    .then((res) => {
      if (res.data === "success") {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
      }
    });
};
const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const iconMapping = {
  "DashboardIcon": <DashboardIcon />,
  "ShoppingCartIcon": <ShoppingCartIcon />,
  "DescriptionIcon": <DescriptionIcon />,
  "AdminPanelSettingsIcon": <AdminPanelSettingsIcon />,
  "SupervisorAccountIcon": <SupervisorAccountIcon />,
  "SchemaIcon": <SchemaIcon />,
  "ViewModuleIcon": <ViewModuleIcon />,
  "ApartmentIcon": <ApartmentIcon />,
  "FenceIcon": <FenceIcon />,
  "AirIcon": <AirIcon />,
  "EmojiObjectsIcon": <EmojiObjectsIcon />,
  "AdsClickIcon": <AdsClickIcon />,
  "DataObjectIcon": <DataObjectIcon />,
  "SupportAgentIcon": <SupportAgentIcon />,
  "ListIcon": <ListIcon />,
  "ManageAccountsSharpIcon": <ManageAccountsSharpIcon />,
  "CasesSharpIcon": <CasesSharpIcon />,
  "ModelTrainingSharpIcon": <ModelTrainingSharpIcon />,
  "AppSettingsAltIcon": <AppSettingsAltIcon />,
  "Person3Icon": <Person3Icon />,
  "SettingsIcon": <SettingsIcon />,
  "DangerousIcon": <DangerousIcon />,
  "LiveTvIcon": <LiveTvIcon />
};
function ScrollTop(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 10,
  });

  const handleClick = () => {
    const scrollWindow = window || globalThis || document;
    if (scrollWindow.scrollTo) {
      scrollWindow.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}
function AdminRoute({ pathname }) {
  const [user, setuser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [Menu, setMenu] = useState(JSON.parse(sessionStorage.getItem("menu")));
  const [session, setSession] = useState({
    user: {
      id: String(user.id),
      name: user.FirstName,
      email: user.Email,
      image: user.image,
    }
  });


  const authentication = {
    signIn: () => {
      return session;
    },
    signOut: () => {
      setSession(null);
      logout();
    },
  };
  const router = useDemoRouter('/');

  const NAVIGATION = Menu ? Menu : []
  const updatedNavigation = NAVIGATION?.map(item => {
    // If the item has a string 'icon', replace it with the corresponding JSX element
    if (typeof item.icon === 'string' && iconMapping[item.icon]) {
      item.icon = iconMapping[item.icon];
    }
    // Parse children if it is a JSON string 
    if (item.children && typeof item.children === 'string') { item.children = JSON.parse(item.children); }

    // If children exist, update their icons too
    if (Array.isArray(item.children)) {

      item.children = item.children.map(child => {
        if (typeof child.icon === 'string' && iconMapping[child.icon]) {
          child.icon = iconMapping[child.icon];
        }
        return child;
      });
    }
    return item;
  });
  const location = useLocation();
  const title = location.pathname.split("/")[1].replaceAll("_", " ").toUpperCase();
  const path = location.pathname === '/' ? '/home' : location.pathname;
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    // Check if the current breadcrumb (title, path) is already in the breadcrumbs array
    setBreadcrumbs((prevBreadcrumbs) => {
      // Avoid adding the same breadcrumb twice
      const isDuplicate = prevBreadcrumbs.some(
        (breadcrumb) => breadcrumb.path === path
      );
      
      // Only add the new breadcrumb if it's not already present
      if (!isDuplicate) {
        return [...prevBreadcrumbs, { title, path }];
      }
      
      return prevBreadcrumbs; // No change if it's a duplicate
    });
  }, [location,title, path]);
  
  


  return (
    <AppProvider
      id="backToHome"
      navigation={updatedNavigation}

      session={session}
      authentication={authentication}
      router={router}
      branding={{
        logo: (
          <img
            src={logo}
            alt="KAIROS FUNCATIOANAL VISUAL SUITE"
          />
        ),
        title: '',
      }}
      theme={demoTheme}
    >
      <DashboardLayout slots={{ toolbarActions: Notifications }}>
        <PageContainer title={title} breadcrumbs={breadcrumbs} />
        <Outlet />
      </DashboardLayout>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </AppProvider>
  );
}
export default AdminRoute;


