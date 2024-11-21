import React, { useState } from "react";
import {
  Typography,
  AppBar,
  Tabs,
  Tab,
  Box,
  Container
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import UsersSetting from "../Components/AdminPanelComponents/UsersSetting";


function AdminPanel() {

  return (
    <div>
    <UsersSetting/>
    </div>
  );
}


export default AdminPanel;
