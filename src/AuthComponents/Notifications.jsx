import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import WebSocketManager from './useWebSocket';
import { AuthLoginInfo } from './AuthLogin';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom'; 
import Badge from '@mui/material/Badge';
import wavFile from './notification.wav';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Popover from '@mui/material/Popover';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Typography from '@mui/material/Typography';
import {ThemeSwitcher  } from '@toolpad/core';


function AlignItemsList({ notifications }) {
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {notifications.map((notification, index) => (
        <React.Fragment key={index}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
             <CheckCircleIcon/>
            </ListItemAvatar>
            <ListItemText
              primary={notification.Test}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: 'text.primary', display: 'inline' }}
                  >
                  </Typography>
                  <br/>
                  Message:{notification.message}
                  <Link href="/worklist" underline="hover">Show More</Link>
                </React.Fragment>
              }
            />
          </ListItem>
          {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>

  );
}


function Notifications() {
  const user = React.useContext(AuthLoginInfo);
  const [notificationCount, setNotificationCount] = React.useState(0);
  const [alertMessages, setAlertMessages] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  React.useEffect(() => {
    const handleWebSocketData = (data) => {
      // Ensure data has the correct structure
      if (data && data.path === 'chat' && data.Username === user?.username ) {
        // Format the message content
        const message = `
          Test: ${data.Test}
          Job ID: ${data.JobID}
          Status: ${data.Status}
          User: ${data.Username}
          Note: ${data.message}
        `;
        toast.success(message);
        
        const audio = new Audio(wavFile);
         audio.play().catch((error) => console.error("Error playing audio:", error));
        setNotificationCount((prevCount) => prevCount + 1);
        setAlertMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, data];
          localStorage.setItem('messages', JSON.stringify(updatedMessages)); // Save to local storage
          return updatedMessages;
        });
      }
    };

    WebSocketManager.subscribe(handleWebSocketData);

    return () => WebSocketManager.unsubscribe(handleWebSocketData); // Cleanup on unmount
  }, [user]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAlertMessages([]);  // Optionally clear alerts when the popover is closed
    setNotificationCount(0);  // Reset notification count when popover is closed
  };

  const open = Boolean(anchorEl);

  return (
    <>
    <Tooltip title="Notifications" enterDelay={1000}>
      <IconButton
        aria-label="notifications"
        onClick={handleClick}
        sx={{
          display: { xs: 'inline', md: 'block' },
        }}
      >
        <Badge badgeContent={notificationCount} color="success">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div>
          <AlignItemsList notifications={alertMessages} />
        </div>
      </Popover>

      <ToastContainer position="top-center" autoClose={10000} />
    </Tooltip>
    <ThemeSwitcher/>
    </>
  );
}

export default Notifications;



