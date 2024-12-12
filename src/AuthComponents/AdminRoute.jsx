import React, {useState, } from "react";
import {AppProvider,DashboardLayout,PageContainer } from '@toolpad/core';

import axios from "axios";
import { createTheme } from '@mui/material/styles';
import "./Styles/loadingPage.css";
import { base } from '../config';
const API_URL=base(window.env.AP)
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
import { useDemoRouter } from './Route';
import Homepage from "../pages/Homepage";
import Scenario_manager from "../pages/Business/scenario_manager";
import TestCasePage from "../pages/TestCase";
import Customers from "../pages/Customers";
import Instances from "../pages/Instances";
import Env from "../pages/Env";
import Objects from "../pages/Business/objects";
import Modules from "../pages/Modules";
import Progress from "../pages/Progress";
import AdminPanel from "../pages/AdminPanel";
import FlowPage from '../pages/Business/flows'; 
import ComponentPage from '../pages/Business/components';
import Testcase from '../pages/Business/testcases';
import Cammands from '../pages/Business/cammand';
import Types from '../pages/Business/object_type';
import Module from '../pages/Business/modules';
import { Box } from "@mui/material";
import Worklist from '../pages/worklist'
import { Route,useLocation } from "react-router-dom";


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
function AdminRoute({pathname}) {
  const [user,setuser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [Menu, setMenu] = useState(JSON.parse(sessionStorage.getItem("menu")));
  const [session, setSession] = useState({
      user: {
        id: String(user.id),
        name: user.FirstName,
        email: user.Email,
        image: 'https://avatars.githubusercontent.com/u/19550456',
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
  const location=useLocation()
  console.log(router)
  return (
    <AppProvider
            id="backToHome"
            navigation={NAVIGATION}
            theme={demoTheme}
            session={session}
            authentication={authentication}
            router={router}
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
      
        <PageContainer/>
        <DemoPageContent pathname={router.pathname} navigate={router.navigate}/>
        {pathname && router.pathname=="/" && <DemoPageContent pathname={pathname} navigate={router.navigate}/>}
        
      </DashboardLayout>
    </AppProvider>
  );
}
export default AdminRoute;


function DemoPageContent({ pathname,navigate }) {
  return (
      <Box
      sx={{
        py: 4,
              }}>
      {pathname === '/*' && <Homepage pathname={pathname} navigate={navigate} />}
      {pathname === '/' && <Homepage pathname={pathname} navigate={navigate} />}
      {pathname === '/home' && <Homepage pathname={pathname} navigate={navigate} />}
      {pathname === '/Instances' && <Instances />}
      {pathname === '/customers' && <Customers pathname={pathname} navigate={navigate} />}
      {pathname === '/business/Scenario' && <Scenario_manager />}
      {pathname === '/business/objects' && <Objects />}
      {pathname === '/env' && <Env pathname={pathname} navigate={navigate}/>}
      {pathname === '/Modules' && <Modules pathname={pathname} navigate={navigate} />}
      {pathname === '/progress' && <Progress pathname={pathname} navigate={navigate}  />}
      {pathname === '/Jobs' && <TestCasePage pathname={pathname} navigate={navigate}  />}
      {pathname === '/business/manager' && <FlowPage pathname={pathname} navigate={navigate}  />}
      {pathname === '/business/Components' && <ComponentPage pathname={pathname} navigate={navigate}  />}
      {pathname === '/business' && <Testcase pathname={pathname} navigate={navigate}  />}
      {pathname === '/business/Testcase' && <Testcase pathname={pathname} navigate={navigate}  />}
      {pathname === '/business/command' && <Cammands pathname={pathname} navigate={navigate}  />}
      {pathname === '/business/types' && <Types pathname={pathname} navigate={navigate} />}
      {pathname === '/AdminPanel' && <AdminPanel pathname={pathname} navigate={navigate} />}
      {pathname === '/Setting/Modules' && <Module pathname={pathname} navigate={navigate} />}
      {pathname === '/worklist' && <Worklist pathname={pathname} navigate={navigate} />}

      </Box>
  );
}

