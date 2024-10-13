'use client'
import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from "react-dom/client";
import App from './app';
import { AuthLogin } from './AuthComponents/AuthLogin';
import { StyledEngineProvider } from '@mui/material/styles';

createRoot(document.querySelector("#root")).render(
      <StyledEngineProvider injectFirst>
      <React.StrictMode>
        <AuthLogin>
        <App />
        </AuthLogin>
        </React.StrictMode>
      </StyledEngineProvider>
  );