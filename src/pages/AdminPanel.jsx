import React, { useState } from "react";
import {
  Typography,
  AppBar,
  Tabs,
  Tab,
  Box,
  Paper,
  Container
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import UsersSetting from "../Components/AdminPanelComponents/UsersSetting";


function AdminPanel() {
 const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
 if(user.role_id !== 1){
   window.location.href = '/dashboard';
  }
  return (
    
    <UsersSetting/>
    
  );
}


export default AdminPanel;
