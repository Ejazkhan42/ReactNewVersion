import {useContext,useState,useEffect}  from 'react';
import { BrowserRouter, Routes, Route,useNavigate,useLocation } from 'react-router-dom';
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
import TestCase from "./pages/TestCase"
import Progress from "./pages/Progress"
import Signup from "./pages/Signup"
import AdminPanel from "./pages/AdminPanel"
import { PageContainer } from '@toolpad/core';
import Worklist from "./pages/worklist"



const AppRoutes = () => {
  const locations=useLocation()
  return (
    <Routes>
      <Route 
        path="/*" 
        element={
          <PrivateRoute>
            
            {/* <PageContainer title="Home" breadCrumbs={breadCrumbs}/> */}
            <AdminRoute/>
           
          </PrivateRoute>
        } 
      />
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            
            {/* <PageContainer title="Home" breadCrumbs={breadCrumbs}/> */}
            <AdminRoute/>
           
          </PrivateRoute>
        } 
      />
      <Route 
        path="/env" 
        element={
          <PrivateRoute>
            
            {/* <PageContainer title="Home" breadCrumbs={breadCrumbs}/> */}
            <AdminRoute pathname={location.pathname}/>
           
          </PrivateRoute>
        } 
      />
      <Route 
        path="/home" 
        element={
          
                 
          <AdminRoute pathname={location.pathname}/>
         
        } 
      />
      <Route 
        path="/instances" 
        element={
          <AdminRoute pathname={location.pathname}/>
        } 
      />
      <Route 
        path="/customers" 
        element={
          <AdminRoute pathname={location.pathname}/>
         
        } 
      />
      <Route 
        path="/env" 
        element={

          <AdminRoute pathname={location.pathname}/>
       
        } 
      />
      <Route 
        path="/modules" 
        element={

          <AdminRoute pathname={location.pathname}/>
      
        } 
      />
      <Route 
        path="/jobs" 
        element={
   
          <AdminRoute pathname={location.pathname}/>
  
        } 
      />
      <Route 
        path="/progress" 
        element={
          <AdminRoute pathname={location.pathname}/>
        } 
      />
     <Route 
        path="/worklist" 
        element={
   
          <AdminRoute pathname={location.pathname}/>

        } 
      />

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
    <BrowserRouter>
      <AppRoutes />  
    </BrowserRouter>
  );
}

export default App;

