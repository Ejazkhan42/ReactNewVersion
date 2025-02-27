import React, { useContext,useState,useEffect } from 'react';
import { AuthLoginInfo } from './AuthLogin';
import { Navigate } from 'react-router-dom';
import './Styles/loadingPage.css';
import { useSession } from '@toolpad/core';
function PrivateRoute({ children }) {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  return user ? children : <Navigate to="/login" />;

}
export default PrivateRoute
