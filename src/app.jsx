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
  const location = useLocation();
  const [breadCrumbs, setBreadCrumbs] = useState([{title:"Home",path:"/"}]);
  useEffect(() => {
    const path = location.pathname;
    const segment = path.split('/').filter(Boolean);
   
    const title = segment.map(seg => seg.charAt(0).toUpperCase() + seg.slice(1)).join(' / ');
    const newBreadcrumb = { title, path };
    setBreadCrumbs((prev) => {
      const exists = prev.find(breadcrumb => breadcrumb.path === newBreadcrumb.path);
      return exists ? prev : [...prev, newBreadcrumb];
    });
  });

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            
            {/* <PageContainer title="Home" breadCrumbs={breadCrumbs}/> */}
            <AdminRoute/>
           
          </PrivateRoute>
        } 
      />
      {/* <Route 
        path="/home" 
        element={
          
            <AdminRoute>
            <PageContainer title="Home"breadCrumbs={breadCrumbs}>
              <Homepage />
            </PageContainer>
            </AdminRoute>
         
        } 
      />
      <Route 
        path="/instances" 
        element={
        
            <AdminRoute>
            <PageContainer title="Instance"breadCrumbs={breadCrumbs}>
              <Instance />
             </PageContainer>
             </AdminRoute>
          
        } 
      />
      <Route 
        path="/customers" 
        element={
    
            <AdminRoute>
            <PageContainer title="Customers" breadCrumbs={breadCrumbs}>
              <Customers />
            </PageContainer>
            </AdminRoute>
         
        } 
      />
      <Route 
        path="/env" 
        element={

            <AdminRoute>
            <PageContainer title="Environment" breadCrumbs={breadCrumbs}>
              <Env />
            </PageContainer>
            </AdminRoute>
       
        } 
      />
      <Route 
        path="/modules" 
        element={

            <AdminRoute>
            <PageContainer title="Modules" breadCrumbs={breadCrumbs}>
              <Modules />
            </PageContainer>
            </AdminRoute>
      
        } 
      />
      <Route 
        path="/jobs" 
        element={
   
            <AdminRoute>
            <PageContainer title="Jobs"  breadCrumbs={breadCrumbs}>
              <TestCase />
            </PageContainer>
            </AdminRoute>
  
        } 
      />
      <Route 
        path="/progress" 
        element={
 
            <AdminRoute>
            <PageContainer title="Progress" breadCrumbs={breadCrumbs}>
              <Progress />
            </PageContainer>
            </AdminRoute>

        } 
      />
     <Route 
        path="/worklist" 
        element={
   
            <AdminRoute>
            <PageContainer title="WorkList" breadCrumbs={breadCrumbs}>
              <Worklist />
            </PageContainer>
            </AdminRoute>

        } 
      />
      <Route 
        path="/business/:path" 
        element={

            <AdminRoute>
            <PageContainer title="business" breadCrumbs={breadCrumbs}>
              <Business />
            </PageContainer>
            </AdminRoute>

        } 
      />
    <Route 
        path="/business/components/:path" 
        element={

            <AdminRoute>
            <PageContainer title="components" breadCrumbs={breadCrumbs}>
              <Business />
            </PageContainer>
            </AdminRoute>

        } 
      />
       <Route 
        path="/AdminPanel" 
        element={
          <PrivateRoute>
            <PageContainer title="AdminPanel" breadCrumbs={breadCrumbs}>
              <AdminPanel />
            </PageContainer>
          </PrivateRoute>
        } 
      />*/}
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

