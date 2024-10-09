import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import './Styles/loadingPage.css';

function LoginRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }


    setLoading(false); 
  }, []);

  if(user === null) {
    // return (
    //   <div className="loading-page-wrapper">
    //     <div className="loading-page">
    //       <div className="spinner"></div>
    //     </div>
    //   </div>
    // )
  }

  return user?.id ? <Navigate to='../' /> : children;

}
export default LoginRoute
