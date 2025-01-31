import React, { useState } from 'react';
import { Snackbar, FormControl, Container, Paper, Typography, TextField, Button, Box, IconButton, InputLabel, OutlinedInput, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { base } from '../config';
const API_URL = base(window.env.AP)

// export default function Signup() {
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [userId, setUser_id] = useState('');
//   const [qrCode, setQrCode] = useState('');
//   const [token, setOtpCode] = useState(null);
//   const [verify2FA, setVerify2FA] = useState(true);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
//   const [newUserDetails, setNewUserDetails] = useState({
//     FirstName: "",
//     LastName: "",
//     username: "",
//     Email: "",
//     PhoneNumber: "",
//     password: "",
//     role: 3,
//   });

//   const handleEnable2FA = async (userId) => {
//     // If 2FA is not enabled
//     try {


//       const { data } = await axios.post(`${API_URL}/enable-2fa`, null, {
//         params: { id: userId },
//       }, { withCredentials: true });

//       const qrResponse = await axios.get(`${API_URL}/generate_QR`, {
//         params: { secret: data.secret },
//       });

//       setQrCode(qrResponse.data.imageUrl);

//       setSnackbar({
//         open: true,
//         message: "2FA enabled successfully! Scan the QR code below.",
//         severity: "success",
//       });

//     } catch (error) {
//       console.error("Error enabling 2FA:", error);
//       setSnackbar({
//         open: true,
//         message: "Failed to enable 2FA. Please try again.",
//         severity: "error",
//       });

//     }
//   };


//   const handleSubmit = () => {
//     let errorMessage = '';

//     // Validate required fields
//     if (!newUserDetails.FirstName) errorMessage += 'First Name is required. ';
//     if (!newUserDetails.LastName) errorMessage += 'Last Name is required. ';
//     if (!newUserDetails.username) errorMessage += 'Username is required. ';
//     if (!newUserDetails.Email) errorMessage += 'Email is required. ';
//     if (!newUserDetails.password) errorMessage += 'Password is required. ';
//     if (!confirmPassword) errorMessage += 'Confirm Password is required. ';

//     if (newUserDetails.password !== confirmPassword) {
//       errorMessage += 'Passwords do not match. ';
//     }

//     if (errorMessage) {
//       setError(errorMessage);
//       return;
//     }

//     axios.post(`${API_URL}/signup`, { userDetails: newUserDetails }, { withCredentials: true })
//       .then(res => {

//         if (res.data.message == "success") {
//           setUser_id(res.data.id);
//           handleEnable2FA(res.data.id);

//         }
//       })
//       .catch(err => {
//         console.error('Signup error:', err);
//         setError(`An error occurred. Please try again later. ${res.data} `);
//       });
//   };

//   const handleOtpVerify = async () => {

//     try {

//       await axios.post(`${API_URL}/verify-2fa`, { userId, token }, { withCredentials: true }).then((res) => {
//         if (res.data.message === 'Login successful') {
//           setVerify2FA(true);
//           setSnackbar({
//             open: true,
//             message: "2FA enabled successfully.",
//             severity: "success",
//           });
//         } else {
//           throw new Error('Invalid OTP');
//         }
//       });
//     } catch (error) {
//       console.error("OTP verification failed:", error);
//       setSnackbar({
//         open: true,
//         message: "Invalid OTP. Please try again.",
//         severity: "error",
//       });
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="login-container" sx={{ padding: "0px", maxWidth: "1500px" }}>
//       <div className="login-header">
//         <Typography variant="h4" className="login-title">

//         </Typography>
//         <Typography variant="h2" className="login-subtitle">

//         </Typography>
//       </div>
//       <Container className="login-content" style={{ display: 'flex', justifyContent: 'center' }}>
//         <Paper elevation={3} className="login-paper">
//           <Box px={2} pt={2}>
//             {error && (
//               <Box mb={2} textAlign="center">
//                 <Typography color="error" variant="body2">
//                   {error}
//                 </Typography>
//               </Box>
//             )}
//             <Box mb={2}>
//               <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "" }}>SIGN UP</Typography>
//             </Box>

//             {/* First Name & Last Name Row */}
//             <Box display="flex" gap={2} mb={2}>
//               <TextField
//                 id="FirstName"
//                 label="First Name"
//                 variant="outlined"
//                 fullWidth
//                 required
//                 value={newUserDetails.FirstName}
//                 onChange={(e) => setNewUserDetails({ ...newUserDetails, FirstName: e.target.value })}
//                 sx={{ flex: 1 }}
//               />
//               <TextField
//                 id="LastName"
//                 label="Last Name"
//                 variant="outlined"
//                 fullWidth
//                 required
//                 value={newUserDetails.LastName}
//                 onChange={(e) => setNewUserDetails({ ...newUserDetails, LastName: e.target.value })}
//                 sx={{ flex: 1 }}
//               />
//             </Box>

//             {/* Username & Email Row */}
//             <Box display="flex" gap={2} mb={2}>
//               <TextField
//                 id="username"
//                 label="Username"
//                 variant="outlined"
//                 fullWidth
//                 required
//                 value={newUserDetails.username}
//                 onChange={(e) => setNewUserDetails({ ...newUserDetails, username: e.target.value })}
//                 sx={{ flex: 1 }}
//               />
//               <TextField
//                 id="Email"
//                 label="Email"
//                 variant="outlined"
//                 type="email"
//                 defaultValue="Small"
//                 fullWidth
//                 required
//                 value={newUserDetails.Email}
//                 onChange={(e) => setNewUserDetails({ ...newUserDetails, Email: e.target.value })}
//                 sx={{ flex: 1 }}
//               />
//             </Box>

//             {/* Phone Number (Full Width) */}
//             <Box mb={2}>
//               <TextField
//                 id="PhoneNumber"
//                 label="Phone Number"
//                 variant="outlined"
//                 type="tel"
//                 fullWidth
//                 value={newUserDetails.PhoneNumber}
//                 onChange={(e) => setNewUserDetails({ ...newUserDetails, PhoneNumber: e.target.value })}
//               />
//             </Box>

//             {/* Password & Confirm Password Row */}
//             <Box display="flex" gap={2} mb={2}>

//               <FormControl fullWidth variant="outlined">
//                 <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
//                 <OutlinedInput
//                   id="password"
//                   type={showPassword ? 'text' : 'password'}
//                   onChange={(e) => setNewUserDetails({ ...newUserDetails, password: e.target.value })}
//                   endAdornment={
//                     <InputAdornment position="end">
//                       <IconButton
//                         aria-label={
//                           showPassword ? 'hide the password' : 'display the password'
//                         }
//                         onClick={togglePasswordVisibility}

//                         edge="end"
//                       >
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   }
//                   label="Password"
//                 /> </FormControl>
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
//                 <OutlinedInput
//                   id="confirmpassword"
//                   type={showPassword ? 'text' : 'password'}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   endAdornment={
//                     <InputAdornment position="end">
//                       <IconButton
//                         aria-label={
//                           showPassword ? 'hide the password' : 'display the password'
//                         }
//                         onClick={togglePasswordVisibility}

//                         edge="end"
//                       >
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   }
//                   label="Password"
//                 /> </FormControl>

//             </Box>

//             <Box mt={3} textAlign="center">
//               <Button
//                 variant="contained"
//                 onClick={handleSubmit}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     handleSubmit();
//                   }
//                 }}
//                 className="sign-in-button"
//                 style={{ background: "#333", fontSize: "0.9rem" }}
//               >
//                 Sign Up
//               </Button>
//             </Box>
//           </Box>
//         </Paper>
//       </Container>
//       <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
//         Two-factor authentication adds an extra layer of security to your account.
//         {userId && qrCode && (
//           <>

//             {!verify2FA && (
//               <>
//                 <Typography variant="body1" sx={{ mt: 2 }}>
//                   Scan this QR code with your authentication app:
//                 </Typography>
//                 <img src={qrCode} alt="QR Code" style={{ marginTop: "10px", maxWidth: "100%", alignContent: 'center' }} />
//                 <TextField
//                   fullWidth
//                   label="Enter OTP"
//                   value={token}
//                   onChange={(e) => setOtpCode(e.target.value)}
//                   sx={{ mb: 2, mt: 2 }}
//                 />
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleOtpVerify}
//                 >
//                   Verify OTP
//                 </Button>
//               </>

//             )}
//           </>
//         )}

//       </Typography>
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         message={snackbar.message}
//         severity={snackbar.severity}
//       />
//     </div>
//   );
// }

export default function Signup() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUser_id] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [token, setOtpCode] = useState(null);
  const [verify2FA, setVerify2FA] = useState(false); // Initially set to false as user hasn't verified 2FA yet
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [newUserDetails, setNewUserDetails] = useState({
    FirstName: "", LastName: "", username: "", Email: "", PhoneNumber: "", password: "", role: 7
  });

  const handleEnable2FA = async (userId) => {
    try {
      const { data } = await axios.post(`${API_URL}/enable-2fa`, null, {
        params: { id: userId },
      }, { withCredentials: true });

      const qrResponse = await axios.get(`${API_URL}/generate_QR`, {
        params: { secret: data.secret },
      });

      setQrCode(qrResponse.data.imageUrl);
      setSnackbar({
        open: true,
        message: "2FA enabled successfully! Scan the QR code below.",
        severity: "success",
      });

    } catch (error) {
      console.error("Error enabling 2FA:", error);
      setSnackbar({
        open: true,
        message: "Failed to enable 2FA. Please try again.",
        severity: "error",
      });
    }
  };

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

    axios.post(`${API_URL}/signup`, { userDetails: newUserDetails }, { withCredentials: true })
      .then(res => {
        if (res.data.message == "success") {
          setUser_id(res.data.id);
          handleEnable2FA(res.data.id);
          setVerify2FA(true); // Update state to show 2FA enabled
        }
      })
      .catch(err => {
        console.error('Signup error:', err);
        setError(`An error occurred. Please try again later. ${res.data} `);
      });
  };

  const handleOtpVerify = async () => {
    try {
      await axios.post(`${API_URL}/verify-2fa`, { userId, token }, { withCredentials: true })
        .then((res) => {
          if (res.data.message === 'Login successful') {
            window.location.href = '/login'; // Redirect to home page
            setVerify2FA(true); // Update state to show 2FA verified
            setSnackbar({
              open: true,
              message: "2FA verified successfully.",
              severity: "success",
            });
          } else {
            throw new Error('Invalid OTP');
          }
        });
    } catch (error) {
      console.error("OTP verification failed:", error);
      setSnackbar({
        open: true,
        message: "Invalid OTP. Please try again.",
        severity: "error",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container" sx={{ padding: "0px", maxWidth: "1500px" }}>
      <div className="login-header">
        <Typography variant="h4" className="login-title"></Typography>
        <Typography variant="h2" className="login-subtitle"></Typography>
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
            {!verify2FA && (
              <>
                <Box mb={2}>
                  <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "" }}>SIGN UP</Typography>
                </Box>

                {/* First Name & Last Name Row */}
                <Box display="flex" gap={2} mb={2}>
                  <TextField
                    id="FirstName"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={newUserDetails.FirstName}
                    onChange={(e) => setNewUserDetails({ ...newUserDetails, FirstName: e.target.value })}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    id="LastName"
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={newUserDetails.LastName}
                    onChange={(e) => setNewUserDetails({ ...newUserDetails, LastName: e.target.value })}
                    sx={{ flex: 1 }}
                  />
                </Box>

                {/* Username & Email Row */}
                <Box display="flex" gap={2} mb={2}>
                  <TextField
                    id="username"
                    label="Username"
                    variant="outlined"
                    fullWidth
                    required
                    value={newUserDetails.username}
                    onChange={(e) => setNewUserDetails({ ...newUserDetails, username: e.target.value })}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    id="Email"
                    label="Email"
                    variant="outlined"
                    type="email"
                    fullWidth
                    required
                    value={newUserDetails.Email}
                    onChange={(e) => setNewUserDetails({ ...newUserDetails, Email: e.target.value })}
                    sx={{ flex: 1 }}
                  />
                </Box>

                {/* Phone Number (Full Width) */}
                <Box mb={2}>
                  <TextField
                    id="PhoneNumber"
                    label="Phone Number"
                    variant="outlined"
                    type="tel"
                    fullWidth
                    value={newUserDetails.PhoneNumber}
                    onChange={(e) => setNewUserDetails({ ...newUserDetails, PhoneNumber: e.target.value })}
                  />
                </Box>

                {/* Password & Confirm Password Row */}
                <Box display="flex" gap={2} mb={2}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      onChange={(e) => setNewUserDetails({ ...newUserDetails, password: e.target.value })}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={showPassword ? 'hide the password' : 'display the password'}
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                    <OutlinedInput
                      id="confirmpassword"
                      type={showPassword ? 'text' : 'password'}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={showPassword ? 'hide the password' : 'display the password'}
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password"
                    />
                  </FormControl>
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
              </>
            )}

            {/* 2FA Verification */}
            {verify2FA && (
              <Box sx={{ textAlign: "center" }}> 
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Scan this QR code with your authentication app:
                </Typography>
                <img src={qrCode} alt="QR Code" style={{ marginTop: "10px", maxWidth: "100%", alignContent: 'center' }} />
                <TextField
                  fullWidth
                  label="Enter OTP"
                  value={token}
                  onChange={(e) => setOtpCode(e.target.value)}
                  sx={{ mb: 2, mt: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOtpVerify}
                >
                  Verify OTP
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </div>
  );
}