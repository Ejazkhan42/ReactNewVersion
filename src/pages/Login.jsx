import {
  TextField,
  InputAdornment,
  Link
} from '@mui/material';



import React, { useState, useEffect, useMemo, useContext } from 'react';
import { AppProvider, SignInPage } from '@toolpad/core';
import { useTheme } from '@mui/material/styles';
import { Container, Typography, Box, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import './styles/login.css';
import Signup from "./Signup"
import { useLocalStorageState } from '@toolpad/core';
import { AuthLoginInfo } from '../AuthComponents/AuthLogin';
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
const Menu = (role_id) => {
  axios
    .get(`${API_URL}/menuLevel?role=${role_id}`, { withCredentials: true })
    .then((res) => {
      if (res.data) {
        sessionStorage.setItem("menu", JSON.stringify(res.data))

        window.location.href = '/home';
      }
    })
    .catch((error) => {
      console.error('Login error:', error);
    });
};

const User = () => {
  axios
    .get(`${API_URL}/user`, { withCredentials: true })
    .then((res) => {
      if (res.data) {
        sessionStorage.setItem("user", JSON.stringify(res.data))
        Menu(res.data.role_id)
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


const signIn = async (provider, formData) => {
  const username = formData.get('username');
  const password = formData.get('password');

  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    }, { withCredentials: true });

    if (response.data === 'success') {
      User();
    } else {
      throw new Error('Login failed. Please check your username and password.');
    }
  } catch (error) {
    alert(error.message);
  }
};

export default function CredentialsSignInPage() {
  const theme = useTheme();

  return (
    <AppProvider>
      <div className="login-container" sx={{ padding: "0px", maxWidth: "1500px" }}>
        <Box className="login-header">
          <Typography variant="h2" className="login-subtitle">
            DoingERP.com
          </Typography>
        </Box>
        <SignInPage signIn={signIn} slots={{
          emailField: CustomEmailField, signUpLink: SignUpLink,
        }} providers={providers} />
      </div>
    </AppProvider>
  );
}

