import React, { useEffect, useState } from "react";
import {
    Container,
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    Switch,
    Avatar,
    FormControlLabel,
    Snackbar,
    Alert,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { styled } from "@mui/system";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import WebSocketManager from "../AuthComponents/useWebSocket";
import { base } from '../config';
import { create } from "@mui/material/styles/createTransitions";
const API_URL = base(window.env.AP)


const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: "24px",
    marginBottom: "24px",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: "120px",
    height: "120px",
    marginBottom: "16px",
}));

const UserProfile = () => {
    const [userId, setUserId] = useState(null);
    const [profileData, setProfileData] = useState(sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem("user")) : {});
    const [update, setUpdate] = useState(false);
    const [image, setImage] = useState(null);
    const tokens = sessionStorage.getItem('token');
    const [passwordData, setPasswordData] = useState({
        id: profileData.id || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [updateUserDetails, setUpdateUserDetails] = useState({
        id: profileData.id,
        FirstName: profileData.FirstName || "",
        LastName: profileData.LastName || "",
        PhoneNumber: profileData.PhoneNumber || "",
        password: profileData.password || "",
        Email: profileData.Email || "",
        isTwoFAEnabled: profileData.isTwoFAEnabled || 0,
        role_id: profileData.role_id || 0,
        image: image || "",
        username: profileData.username || "",
    });
    const [verify2FA, setVerify2FA] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [qrCode, setQrCode] = useState(null);
    const [token, setOtpCode] = useState(null);

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    useEffect(() => {
        WebSocketManager.sendMessage({
            token: tokens,
            path: 'data',
            type: 'find',
            table: 'users',
            whereCondition: 'id= ?',
            whereValues: [profileData.id],
            columns: [],
        });
        const handleWebSocketData = (data) => {
            if (data[0]?.hasOwnProperty('username') && data[0]?.hasOwnProperty('password') && data[0]?.hasOwnProperty('Email')) {
                setProfileData(data[0])
                setTwoFactorEnabled(data[0].isTwoFAEnabled === 1 ? true : false);
                sessionStorage.setItem("user", JSON.stringify(data[0]));
            }
        }
        WebSocketManager.subscribe(handleWebSocketData);
        return () => WebSocketManager.unsubscribe(handleWebSocketData);
    }, [update, image]);
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        WebSocketManager.sendMessage({
            token: tokens,
            path: 'data',
            type: 'update',
            table: 'users',
            whereCondition: "id=?",
            whereValues: [updateUserDetails.id],
            columns: ["FirstName", "LastName", "PhoneNumber", "image"],
            values: [updateUserDetails.FirstName, updateUserDetails.LastName, updateUserDetails.PhoneNumber, updateUserDetails.image]
        });

        const handleWebSocketData = (data) => {
            if (data?.status == "updated" && data?.tableName == "users") {
                setSnackbar({
                    open: true,
                    message: "Profile updated successfully!",
                    severity: "success",
                });
                setUpdate(true);
            }
        }

        WebSocketManager.subscribe(handleWebSocketData);
        return () => WebSocketManager.unsubscribe(handleWebSocketData);



    };

    const handlePasswordReset = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setSnackbar({
                open: true,
                message: "Passwords do not match!",
                severity: "error",
            });
            return;
        }
        axios.post(`${API_URL}/resetpasword`, passwordData, { withCredentials: true });
        setSnackbar({
            open: true,
            message: "Password reset successfully!",
            severity: "success",
        });
        setPasswordData({ id: profileData.id, currentPassword: "", newPassword: "", confirmPassword: "" });
    };

    const handleImageUpload = (e) => {
        const MAX_FILE_SIZE_KB = 5; // Maximum file size in KB (10 KB)
        const MAX_WIDTH = 400; // Max width for resizing (reduce to even smaller dimensions)
        const MAX_HEIGHT = 400; // Max height for resizing

        const file = e.target.files[0];

        if (file) {
            // Check file size first
            if (file.size > MAX_FILE_SIZE_KB * 1024) {
                alert(`File size exceeds ${MAX_FILE_SIZE_KB} KB. Compressing to fit.`);
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    // Create a canvas element
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Calculate new dimensions to resize the image
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = Math.round((height * MAX_WIDTH) / width);
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = Math.round((width * MAX_HEIGHT) / height);
                            height = MAX_HEIGHT;
                        }
                    }

                    // Set canvas size
                    canvas.width = width;
                    canvas.height = height;

                    // Draw the image on the canvas
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress and convert to base64
                    let quality = 0.8; // Start with 80% quality
                    let imageData = canvas.toDataURL(file.type, quality);

                    // Check the image size and adjust quality if necessary
                    while (imageData.length > MAX_FILE_SIZE_KB * 1024 && quality > 0.1) {
                        quality -= 0.05; // Decrease quality by 5% each time
                        imageData = canvas.toDataURL(file.type, quality);
                    }

                    // Display the resized image preview
                    setImage({
                        preview: imageData,
                    });
                    console.log(imageData);
                    // Set the updated user details
                    setUpdateUserDetails({ ...updateUserDetails, image: imageData });
                };

                img.src = reader.result; // Load the image into the Image object
            };

            reader.readAsDataURL(file); // Start reading the file as a Data URL
        }
    };


    const handleEnable2FA = async () => {
        if (profileData.isTwoFAEnabled === 0) {  // If 2FA is not enabled
            try {

                axios.defaults.headers.common['Authorization'] = `Bearer ${tokens}`;
                const { data } = await axios.post(`${API_URL}/enable-2fa`, null, {
                    params: { id: profileData.id },
                }, { withCredentials: true });

                axios.defaults.headers.common['Authorization'] = `Bearer ${tokens}`;
                const qrResponse = await axios.get(`${API_URL}/generate_QR`, {
                    params: { secret: data.secret },
                });

                setUserId(profileData.id);
                setQrCode(qrResponse.data.imageUrl);

                // Update state to reflect that 2FA has been enabled
                setTwoFactorEnabled(true);
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
        }
    };

    const handleOtpVerify = async () => {

        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${tokens}`;
            await axios.post(`${API_URL}/verify-2fa`, { userId, token }, { withCredentials: true }).then((res) => {
                if (res.data.message === 'Login successful') {
                    setVerify2FA(true);
                    setSnackbar({
                        open: true,
                        message: "2FA enabled successfully.",
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
    const handleDisable2FA = async () => {
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${tokens}`;
            const res = await axios.post(`${API_URL}/disable-2fa`, null, {
                params: { id: profileData.id },
            }, { withCredentials: true });

            if (res.data.message === '2FA disabled successfully') {
                // Update state to reflect that 2FA has been disabled
                setTwoFactorEnabled(false);
                setSnackbar({
                    open: true,
                    message: "2FA disabled successfully.",
                    severity: "success",
                });
            } else {
                throw new Error('Failed to disable 2FA');
            }
        } catch (error) {
            console.error("Error disabling 2FA:", error);
            setSnackbar({
                open: true,
                message: "Failed to disable 2FA. Please try again.",
                severity: "error",
            });
        }
    };
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <StyledPaper elevation={3}>
                        <Typography variant="h4" gutterBottom>
                            Profile Settings
                        </Typography>
                        <Grid container justifyContent="center" alignItems="center">
                            <Grid item xs={12} textAlign="center">
                                <input
                                    accept="image/*"
                                    type="file"
                                    id="profile-image-upload"
                                    onChange={handleImageUpload}
                                    style={{ display: "none" }}
                                />
                                <label htmlFor="profile-image-upload">
                                    <StyledAvatar
                                        src={updateUserDetails.image || image?.preview || profileData.image}
                                        alt={updateUserDetails.FirstName}
                                    />
                                    <IconButton
                                        component="span"
                                        sx={{ position: "relative", top: "-40px", right: "-40px" }}
                                    >
                                    </IconButton>
                                </label>
                            </Grid>
                        </Grid>
                        <form onSubmit={handleProfileUpdate}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="First Name"
                                        value={updateUserDetails.FirstName}
                                        onChange={(e) =>
                                            setUpdateUserDetails({ ...updateUserDetails, FirstName: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="Last Name"
                                        value={updateUserDetails.LastName}
                                        onChange={(e) =>
                                            setUpdateUserDetails({ ...updateUserDetails, LastName: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="Username"
                                        value={profileData.username}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="email"
                                        label="Email Address"
                                        value={profileData.Email}
                                        disabled
                                        // onChange={(e) =>
                                        //     setProfileData({ ...profileData, Email: e.target.value })
                                        // }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        value={profileData.PhoneNumber}
                                        onChange={(e) =>
                                            setUpdateUserDetails({ ...updateUserDetails, PhoneNumber: e.target.value })
                                        }
                                    // required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<PersonIcon />}
                                    >
                                        Update Profile
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </StyledPaper>

                    <StyledPaper elevation={3}>
                        <Typography variant="h5" gutterBottom>
                            Two-Factor Authentication
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={twoFactorEnabled}
                                    onChange={(event) => {
                                        // Toggle 2FA based on the switch position
                                        if (event.target.checked) {
                                            handleEnable2FA(); // Enable 2FA
                                        } else {
                                            handleDisable2FA(); // Disable 2FA
                                        }
                                    }}
                                />
                            }
                            label={twoFactorEnabled ? "Enabled" : "Disabled"}
                        />
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                            Two-factor authentication adds an extra layer of security to your account.
                            {twoFactorEnabled && qrCode && (
                                <>

                                    {!verify2FA && (
                                        <>
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
                                        </>

                                    )}
                                </>
                            )}

                        </Typography>
                    </StyledPaper>
                    <StyledPaper elevation={3}>
                        <Typography variant="h5" gutterBottom>
                            Reset Password
                        </Typography>
                        <form onSubmit={handlePasswordReset}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type={showPassword.current ? "text" : "password"}
                                        label="Current Password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                currentPassword: e.target.value,
                                            })
                                        }
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() =>
                                                            setShowPassword({
                                                                ...showPassword,
                                                                current: !showPassword.current,
                                                            })
                                                        }
                                                    >
                                                        {showPassword.current ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type={showPassword.new ? "text" : "password"}
                                        label="New Password"
                                        value={passwordData.newPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                newPassword: e.target.value,
                                            })
                                        }
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() =>
                                                            setShowPassword({
                                                                ...showPassword,
                                                                new: !showPassword.new,
                                                            })
                                                        }
                                                    >
                                                        {showPassword.new ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type={showPassword.confirm ? "text" : "password"}
                                        label="Confirm New Password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() =>
                                                            setShowPassword({
                                                                ...showPassword,
                                                                confirm: !showPassword.confirm,
                                                            })
                                                        }
                                                    >
                                                        {showPassword.confirm ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<LockIcon />}
                                    >
                                        Reset Password
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </StyledPaper>
                </Grid>
            </Grid>

            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default UserProfile;
