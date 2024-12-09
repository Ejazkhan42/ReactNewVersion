'use client';

import useWebSocket, { ReadyState } from 'react-use-websocket';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { createTheme } from '@mui/material/styles';
import { Account, AuthenticationContext, SessionContext,useSession } from '@toolpad/core';
import { AppProvider } from '@toolpad/core/AppProvider';
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
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { ToastContainer, toast } from 'react-toastify';
import Login from "./../pages/Login";
import Signup from "./../pages/Signup";
import './Styles/loadingPage.css';
import React, { createContext, useEffect, useMemo, useState, useRef} from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { base } from '../config';
import Notifications from './Notifications';

import wavFile from './notification.wav';
import 'react-toastify/dist/ReactToastify.css';

const API_URL=base(window.env.AP)

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#F9F9FE',
          paper: '#EEEEF9',
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: '#2A4364',
          paper: '#112E4D',
        },
      },
    },
  },
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
  "DashboardIcon": <DashboardIcon/>,
  "ShoppingCartIcon": <ShoppingCartIcon/>,
  "DescriptionIcon": <DescriptionIcon/>,
  "AdminPanelSettingsIcon":<AdminPanelSettingsIcon/>,
  "SupervisorAccountIcon":<SupervisorAccountIcon/>,
  "SchemaIcon":<SchemaIcon/>,
  "ViewModuleIcon":<ViewModuleIcon/>,
  "ApartmentIcon":<ApartmentIcon/>,
  "FenceIcon":<FenceIcon/>,
  "AirIcon":<AirIcon/>,
  "EmojiObjectsIcon":<EmojiObjectsIcon/>,
  "AdsClickIcon":<AdsClickIcon/>,
  "DataObjectIcon":<DataObjectIcon/>,
  "SupportAgentIcon":<SupportAgentIcon/>,
  "ListIcon":<ListIcon/>,
  "ManageAccountsSharpIcon":<ManageAccountsSharpIcon/>,
  "CasesSharpIcon":<CasesSharpIcon/>,
  "ModelTrainingSharpIcon":<ModelTrainingSharpIcon/>,
  "AppSettingsAltIcon":<AppSettingsAltIcon/>,
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
export const AuthLoginInfo = createContext({});

export function AuthLogin(props) {
  // const U=useSession()
  const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [Menu, setMenu] = useState(null);
  // const [session, setSession] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // setSession({
      //   user: {
      //     id: parsedUser.id,
      //     name: parsedUser.FirstName,
      //     email: parsedUser.Email,
      //     image: 'https://avatars.githubusercontent.com/u/19550456',
      //   }
      // });
    }

    const storedMenu = sessionStorage.getItem("menu");
    if (storedMenu) {
      setMenu(JSON.parse(storedMenu));
    }
  },[]);
 

const NAVIGATION = Menu? Menu:[]
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

//   const authentication = {
//     signIn: () => {
//       return session;
//     },
//     signOut: () => {
//       setSession(null);
//       setLoading(true)
//       logout();
//     },
//   };
//   const isLoggedIn = Boolean(user?.username); // Check if user is logged in

//   const isLoginPage =U?.user? false : true;
//   const isSignupPage=location.pathname==='/signup'
  return (
    <AuthLoginInfo.Provider value={user}>
  
      {/* <SessionContext.Provider value={session}>

        {!isLoginPage && (
        

          <AppProvider
            id="backToHome"
            navigation={NAVIGATION}
            theme={demoTheme}
            session={session}
            authentication={authentication}
            branding={{
              logo: (
                <img
                  src="https://doingerp.com/wp-content/uploads/2023/11/New-Project-1-1.png"
                  alt="MUI logo"
                />
              ),
              title: '',
            }}
          >

     

        <DashboardLayout slots={{ toolbarActions: Notifications}}>
       */}

        {props.children}

    </AuthLoginInfo.Provider>
  );
};


      //   {/* </DashboardLayout>

      //   <ScrollTop>
      //   <Fab size="small" aria-label="scroll back to top">
      //     <KeyboardArrowUpIcon />
      //   </Fab>
      // </ScrollTop>
      
      // </AppProvider>
      //   )}
      //  {isLoginPage && !isSignupPage && <Login />}
      
      // {/* Render the signup page if the current path is '/signup' */}
      // {isSignupPage && <Signup />}
      
      // </SessionContext.Provider> */}