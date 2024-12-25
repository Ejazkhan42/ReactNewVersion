'use client';

import './Styles/loadingPage.css';
import React, { createContext, useEffect, useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';

export const AuthLoginInfo = createContext({});

export function AuthLogin(props) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  },[]);
  return (
    <AuthLoginInfo.Provider value={user}>
  
     

        {props.children}

    </AuthLoginInfo.Provider>
  );
};

