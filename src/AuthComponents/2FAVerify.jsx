import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { base } from '../config';

const API_URL = base(window.env.AP);

export default function TwoFA({ userId, onVerifySuccess, user }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [resendTimeout, setResendTimeout] = useState(30); // Start with 1 minute
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state for Verify button

  useEffect(() => {
    if (!canResend && resendTimeout > 0) {
      const timer = setTimeout(() => {
        setResendTimeout((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (resendTimeout === 0) {
      setCanResend(true);
    }
  }, [resendTimeout, canResend]);

  const handleVerify = async () => {
    setLoading(true); // Disable the Verify button
    setError(''); // Clear any previous errors

    try {
      const response = await axios.post(`${API_URL}/verify-2fa`, { userId, token }, { withCredentials: true });

      if (response.data.message === 'Login successful') {
        onVerifySuccess();
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error verifying 2FA');

      // Increase resend timeout if OTP is incorrect
      if (!canResend) {
        setResendTimeout((prev) => prev + 30); // Add 1 minute to the timeout
      }
      setCanResend(false); // Disable resend until the timer resets
    } finally {
      setLoading(false); // Re-enable the Verify button
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await axios.post(`${API_URL}/send-2fa`, user, { withCredentials: true });
      setResendTimeout(60); // Reset timeout to 1 minute after resend
      setCanResend(false); // Disable resend
    } catch (err) {
      setError('Error resending 2FA code');
    }
  };

  return (
    <Dialog
      open={userId !== null}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      scroll="body"
    >
      <DialogTitle sx={{ textAlign: 'center' }} id="alert-dialog-title">
        {"2FA Verification"}
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          Enter 2FA Code
        </Typography>
        <Typography variant="body2">
          Please enter the 6-digit code sent to your Email
        </Typography>
        <TextField
          label="2FA Code"
          sx={{ textAlign: 'center' }}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
          error={!!error}
          helperText={error}
        />
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            {canResend
              ? 'You can resend the code now.'
              : `Resend code in ${resendTimeout} seconds`}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleVerify}
          disabled={loading} // Disable the button while loading
          fullWidth
        >
          {loading ? 'Verifying...' : 'Verify'} {/* Show loading text */}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleResend}
          disabled={!canResend}
          fullWidth
        >
          Resend Code
        </Button>
      </DialogActions>
    </Dialog>
  );
}
