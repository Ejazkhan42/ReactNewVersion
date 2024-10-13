import {useContext,useState,useEffect}  from 'react';
import { BrowserRouter, Routes, Route,useNavigate,useLocation } from 'react-router-dom';
import Homepage from './pages/Homepage';
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
            <PageContainer title="Home" breadCrumbs={breadCrumbs}/>
              <Homepage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/home" 
        element={
          <PrivateRoute>
            <PageContainer title="Home"breadCrumbs={breadCrumbs}>
              <Homepage />
            </PageContainer>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/instances" 
        element={
          <PrivateRoute>
            <PageContainer title="Instance"breadCrumbs={breadCrumbs}>
              <Instance />
             </PageContainer>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/customers" 
        element={
          <PrivateRoute>
            <PageContainer title="Customers" breadCrumbs={breadCrumbs}>
              <Customers />
            </PageContainer>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/env" 
        element={
          <PrivateRoute>
            <PageContainer title="Environment" breadCrumbs={breadCrumbs}>
              <Env />
            </PageContainer>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/modules" 
        element={
          <PrivateRoute>
            <PageContainer title="Modules" breadCrumbs={breadCrumbs}>
              <Modules />
            </PageContainer>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/jobs" 
        element={
          <PrivateRoute>
            <PageContainer title="Jobs"  breadCrumbs={breadCrumbs}>
              <TestCase />
            </PageContainer>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/progress" 
        element={
          <PrivateRoute>
            <PageContainer title="Progress" breadCrumbs={breadCrumbs}>
              <Progress />
            </PageContainer>
          </PrivateRoute>
        } 
      />
     <Route 
        path="/worklist" 
        element={
          <PrivateRoute>
            <PageContainer title="WorkList" breadCrumbs={breadCrumbs}>
              <Worklist />
            </PageContainer>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/business/:path" 
        element={
          <PrivateRoute>
            <PageContainer title="business" breadCrumbs={breadCrumbs}>
              <Business />
            </PageContainer>
          </PrivateRoute>
        } 
      />
    <Route 
        path="/business/components/:path" 
        element={
          <PrivateRoute>
            <PageContainer title="components" breadCrumbs={breadCrumbs}>
              <Business />
            </PageContainer>
          </PrivateRoute>
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
      <AppRoutes />  {/* Nested AppRoutes within the BrowserRouter */}
    </BrowserRouter>
  );
}

export default App;

