import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import { base } from '../config';

const API_URL = base(window.env.AP);

export default function TwoFA({ userId, onVerifySuccess }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      const response = await axios.post(`${API_URL}/verify-2fa`, { userId, token }, { withCredentials: true });
      
      if (response.data.message === 'Login successful') {
        onVerifySuccess();
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error verifying 2FA');
    }
  };

  return (
    <Box className="two-fa-container">
      <Typography variant="h6">Enter 2FA Code</Typography>
      <TextField
        label="2FA Code"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        fullWidth
        variant="outlined"
        margin="normal"
        error={!!error}
        helperText={error}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleVerify}
        fullWidth
      >
        Verify
      </Button>
    </Box>
  );
}
