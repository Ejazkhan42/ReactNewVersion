import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';

function refreshMessages() {
  const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));
  return Array.from(new Array(50)).map(
    () => messageExamples[getRandomInt(messageExamples.length)],
  );
}

export default function FixedBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);
  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    // Load messages from local storage when the component mounts
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    setMessages(storedMessages);
  }, []);

  // Optional: Listen for changes in local storage
  React.useEffect(() => {
    const handleStorageChange = () => {
      const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
      setMessages(storedMessages);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  React.useEffect(() => {
    ref.current.ownerDocument.body.scrollTop = 0;
  }, [value]);

  const deleteMessage = (index) => {
    const newMessages = messages.filter((_, i) => i !== index);
    setMessages(newMessages);
    localStorage.setItem('messages', JSON.stringify(newMessages));
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('messages');
  };

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <List>
        {messages.map((message, index) => (
          <ListItemButton key={index}>
            <ListItemText 
              primary={`Test: ${message.Test} | Job ID: ${message.JobID}`}  
              secondary={`Status: ${message.Status} | User: ${message.Username} | Note: ${message.message}`} 
            />
            <IconButton onClick={() => deleteMessage(index)}>
              <DeleteIcon />
            </IconButton>
          </ListItemButton>
        ))}
      </List>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Clear All" icon={<RestoreIcon />} onClick={clearMessages} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
