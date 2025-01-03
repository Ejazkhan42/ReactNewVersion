import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { base } from '../config';
const API_URL=base(window.env.AP)

export default function Signup() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [newUserDetails, setNewUserDetails] = useState({
    FirstName: "",
    LastName: "",
    username: "",
    Email: "",
    PhoneNumber: "",
    password: "",
    role: 3,
  });

  const handleSubmit = () => {
    let errorMessage = '';

    // Validate required fields
    if (!newUserDetails.FirstName) errorMessage += 'First Name is required. ';
    if (!newUserDetails.LastName) errorMessage += 'Last Name is required. ';
    if (!newUserDetails.username) errorMessage += 'Username is required. ';
    if (!newUserDetails.Email) errorMessage += 'Email is required. ';
    if (!newUserDetails.password) errorMessage += 'Password is required. ';
    if (!confirmPassword) errorMessage += 'Confirm Password is required. ';

    if (newUserDetails.password !== confirmPassword) {
      errorMessage += 'Passwords do not match. ';
    }

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    axios.post(`${API_URL}/newUser`, { userDetails: newUserDetails }, { withCredentials: true })
      .then(res => {
        if (res.data === 'success') {
          window.location.href = '/login';
        }
      })
      .catch(err => {
        console.error('Signup error:', err);
        setError(`An error occurred. Please try again later. ${res.data} `);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container" sx={{padding:"0px",maxWidth:"1500px"}}>
      <div className="login-header">
        <Typography variant="h4" className="login-title">
          Sign Up
        </Typography>
        <Typography variant="h2" className="login-subtitle">
          DoingERP.com
        </Typography>
      </div>
      <Container className="login-content" style={{ display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={3} className="login-paper">
          <Box px={2} pt={2}>
            {error && (
              <Box mb={2} textAlign="center">
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              </Box>
            )}
            <Box display="flex" alignItems="flex-end" mb={1}>
              <TextField
                id="username"
                label="UserName"
                variant="standard"
                fullWidth
                margin="dense"
                required
                value={newUserDetails.username}
                onChange={(e) => setNewUserDetails({ ...newUserDetails, username: e.target.value })}
                InputLabelProps={{ shrink: true }}
                style={{ marginLeft: 10 }}
                sx={{ fontSize: "1.2rem" }}
              />
            </Box>
            <Box display="flex" alignItems="flex-end" mb={1}>
              <TextField
                id="FirstName"
                label="First Name"
                variant="standard"
                fullWidth
                margin="dense"
                required
                value={newUserDetails.FirstName}
                onChange={(e) => setNewUserDetails({ ...newUserDetails, FirstName: e.target.value })}
                InputLabelProps={{ shrink: true }}
                style={{ marginLeft: 10 }}
                sx={{ fontSize: "1.2rem" }}
              />
            </Box>
            <Box display="flex" alignItems="flex-end" mb={2}>
              <TextField
                id="LastName"
                label="Last Name"
                variant="standard"
                fullWidth
                required
                margin="dense"
                value={newUserDetails.LastName}
                onChange={(e) => setNewUserDetails({ ...newUserDetails, LastName: e.target.value })}
                InputLabelProps={{ shrink: true }}
                style={{ marginLeft: 10 }}
                sx={{ fontSize: "1.2rem" }}
              />
            </Box>
            <Box display="flex" alignItems="flex-end" mb={2}>
              <TextField
                id="Email"
                label="Email"
                variant="standard"
                type='email'
                fullWidth
                required
                margin="dense"
                value={newUserDetails.Email}
                onChange={(e) => setNewUserDetails({ ...newUserDetails, Email: e.target.value })}
                InputLabelProps={{ shrink: true }}
                style={{ marginLeft: 10 }}
                sx={{ fontSize: "1.2rem" }}
              />
            </Box>
            <Box display="flex" alignItems="flex-end" mb={2}>
              <TextField
                id="PhoneNumber"
                label="Phone Number"
                variant="standard"
                type='tel'
                fullWidth
                margin="dense"
                value={newUserDetails.PhoneNumber}
                onChange={(e) => setNewUserDetails({ ...newUserDetails, PhoneNumber: e.target.value })}
                InputLabelProps={{ shrink: true }}
                style={{ marginLeft: 10 }}
                sx={{ fontSize: "0.9rem" }}
              />
            </Box>
            <Box display="flex" alignItems="flex-end" mb={2}>
              <TextField
                label="Password"
                id="password"
                variant="standard"
                fullWidth
                required
                margin="dense"
                type={showPassword ? "text" : "password"}
                value={newUserDetails.password}
                onChange={(e) => setNewUserDetails({ ...newUserDetails, password: e.target.value })}
                InputLabelProps={{ shrink: true }}
                style={{ marginLeft: 10, fontSize: "0.9rem" }}
                sx={{ fontSize: "0.9rem" }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  )
                }}
              />
            </Box>
            <Box display="flex" alignItems="flex-end" mb={2}>
              <TextField
                label="Confirm Password"
                id="confirmpassword"
                variant="standard"
                fullWidth
                required
                margin="dense"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputLabelProps={{ shrink: true }}
                style={{ marginLeft: 10, fontSize: "0.9rem" }}
                sx={{ fontSize: "0.9rem" }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  )
                }}
              />
            </Box>
            <Box mt={3} textAlign="center">
              <Button
                variant="contained"
                onClick={handleSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
                className="sign-in-button"
                style={{ background: "#333", fontSize: "0.9rem" }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}
