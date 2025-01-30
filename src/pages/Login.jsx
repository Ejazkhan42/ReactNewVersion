import {
  TextField,
  InputAdornment,
  Link
} from '@mui/material';



import React, { useState } from 'react';
import { AppProvider, SignInPage } from '@toolpad/core';
import { Typography, Box, IconButton } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TwoFA from '../AuthComponents/2FAVerify';
import axios from 'axios';
import './styles/login.css';
import { base } from '../config';
const API_URL = base(window.env.AP)

const providers = [{ id: 'credentials', name: 'Email and Password' }];
function CustomEmailField() {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="Username"
      name="username"
      type="text"
      size="small"
      required
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircleIcon fontSize="inherit" />
            </InputAdornment>
          ),
        },
      }}
      variant="outlined"
    />
  );
}

const User = (user) => {
  axios
    .get(`${API_URL}/menuLevel?role=${user.role_id}`, { withCredentials: true })
    .then((res) => {
      if (res.data) {
        sessionStorage.setItem("menu", JSON.stringify(res.data))
        sessionStorage.setItem("user", JSON.stringify(user))
        window.location.href = '/dashboard';
      }
    })
    .catch((error) => {
      console.error('Login error:', error);
    });
};


function SignUpLink() {
  return (
    <Link href="/signup" variant="body2">
      Sign up
    </Link>
  );
}


const signIn = async (provider, formData, setStep,setUser) => {
  const username = formData.get('username');
  const password = formData.get('password');

  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    }, { withCredentials: true });
    if (response.data.message === 'success') {
      sessionStorage.setItem('token', response.data.token);
      const token = sessionStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const user = await axios.get(`${API_URL}/user`, { withCredentials: true });
      setUser(user.data);
      if (user.data.isTwoFAEnabled) {
        setStep({ stage: '2fa', userId: user.data.id });
      } else {
        User(user.data);
      }
    } else {
      throw new Error('Login failed. Please check your username and password.');
    }
  } catch (error) {
    alert(error.message);
  }
};



export default function CredentialsSignInPage() {
  const [step, setStep] = useState({ stage: 'login', userId: null });
  const [user, setUser] = useState(null);
  const handle2FASuccess = () => {
    User(user);
  };


  return (
    <AppProvider>
      <div className="login-container">
        <Box className="login-header">
          <Typography variant="h2" className="login-subtitle">
            
          </Typography>
        </Box>
        {step.stage === 'login' ? (
          <SignInPage
          sx={{minHeight: '70vh'}}
            signIn={(provider, formData) => signIn(provider, formData, setStep,setUser)}
            slots={{
              emailField: CustomEmailField,
              signUpLink: SignUpLink,
            }}
            providers={providers}
          />
        ) : (
          <TwoFA userId={step.userId} onVerifySuccess={handle2FASuccess} user={user} />
        )}
      </div>
    </AppProvider>
  );
}

