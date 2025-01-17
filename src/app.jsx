import { useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Homepage from './pages/Homepage';
import AdminRoute from './AuthComponents/AdminRoute';
import PrivateRoute from './AuthComponents/PrivateRoute';
import LoginRoute from './AuthComponents/LoginRoute';
import { AuthLoginInfo } from './AuthComponents/AuthLogin';
import Login from './pages/Login';
import Instance from './pages/Instances'
import Customers from './pages/Customers'
import Env from "./pages/Env"
import Business from "./pages/Business"
import Modules from "./pages/Modules"
import TestCasePage from "./pages/TestCase"
import Progress from "./pages/Progress"
import Signup from "./pages/Signup"
import AdminPanel from "./pages/AdminPanel"
import { PageContainer } from '@toolpad/core';
import Worklist from "./pages/worklist"
import Scenario_manager from "./pages/Business/scenario_manager"
import Menu from './pages/Business/Menu';
import Objects from "./pages/Business/objects"
import FlowPage from "./pages/Business/flows"
import ComponentPage from "./pages/Business/components"
import Testcase from "./pages/Business/testcases"
import Cammands from "./pages/Business/cammand"
import Types from "./pages/Business/object_type"
import Module from "./pages/Business/modules"
import { createTheme } from '@mui/material/styles';
import { useDemoRouter } from './AuthComponents/Route';
import UserProfile from './pages/userprofile';
// import AdminReport from './pages/Business/AdminReport';
import AdminReports from "./pages/Business/AdminReports"

const AppRoutes = () => {
  const router = useDemoRouter('/');
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AdminRoute />
          </PrivateRoute>
        }
      >

        <Route path='/' element={<Homepage pathname={router.pathname} navigate={router.navigate} />} />
        <Route path="/dashboard" element={<Homepage pathname={router.pathname} navigate={router.navigate} />} />
        <Route path="/home" element={<Homepage pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/Instances' element={<Instance pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/customers' element={<Customers pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/business/Scenario' element={<Scenario_manager />} />
        <Route path='/business/objects' element={<Objects pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/env' element={<Env pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/Modules' element={<Modules pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/progress' element={<Progress pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/Jobs' element={<TestCasePage pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/business/manager' element={<FlowPage pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/business/Components' element={<ComponentPage pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/business' element={<FlowPage pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/business/Testcase' element={<Testcase pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/business/command' element={<Cammands pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/business/types' element={<Types pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/AdminPanel' element={<AdminPanel pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/Setting/Modules' element={<Module pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/worklist' element={<Worklist pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/Setting/Menu' element={<Menu pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/Setting' element={<Module pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/profile' element={<UserProfile pathname={router.pathname} navigate={router.navigate} />} />
        <Route path='/AdminReport' element={<AdminReports pathname={router.pathname} navigate={router.navigate} />} />
      </Route>


      <Route
        path="/signup"
        element={
          <LoginRoute>
            <Signup />
          </LoginRoute>
        }
      />
      <Route
        path="/login"
        element={
          <LoginRoute>
            <Login />
          </LoginRoute>
        }
      />

    </Routes>
  );
};

function App() {

  return (
    
    <BrowserRouter future={{ 
      v7_relativeSplatPath: true,
      v7_startTransition: true,
     }}
     //chrome browser not working route 
     
     >
      <AppRoutes />
    </BrowserRouter>
  
  );
}

export default App;

