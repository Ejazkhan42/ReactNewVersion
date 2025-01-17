import React, { useEffect, useState, useContext } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import { AuthLoginInfo } from "../AuthComponents/AuthLogin";
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { base } from '../config';
import WebSocketManager from '../AuthComponents/useWebSocket';
const API_URL=base(window.env.AP)

const iconMap = {
  'Recruitment': <TrendingUpIcon style={{ fontSize: 40 }} />,
  'Absence': <SupervisorAccountRoundedIcon style={{ fontSize: 40 }} />,
  'Core Hr': <EventNoteRoundedIcon style={{ fontSize: 40 }} />,
};

function Orders({pathname, navigate}) {
  // const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const [modules, setModules] = useState([]);
  const [ctx,setctx] = useState(JSON.parse(sessionStorage.getItem("user")));

  useEffect(() => {
    const handleWebSocketData = (data) => {
    if (Array.isArray(data) && data[0]?.hasOwnProperty('User_id') && data[0]?.hasOwnProperty('JOB')) {
      setModules(data);
    }
  };
  WebSocketManager.subscribe(handleWebSocketData);
  WebSocketManager.sendMessage({token:token, path: "data", type: "find", table: "modules_view",whereCondition:"User_id=?",whereValues:[ctx.id] });
}, [ctx.id]);
  // useEffect(() => {
  //   const fetchModules = async () => {
  //     try {
  //       const response = await axios.get(`${API_URL}/module?user_id=${ctx.id}`, { withCredentials: true });
  //       setModules(response.data);
  //     } catch (error) {
  //       console.error('Error fetching modules:', error);
  //     }
  //   };
  //   fetchModules();
  // }, [ctx.id]);

  const handleCardClick = (moduleId, moduleName,JOB) => {
    WebSocketManager.sendMessage({token:token, path: "data", type: "find", table: "testcase",whereCondition:"Modules_id=?",whereValues:[moduleId] });
    navigate('/Jobs', { moduleId, moduleName,JOB});
  };

  return (
    <Box p={3}>
      {/* <Typography variant="h4" gutterBottom align="center" style={{ fontSize: '3rem', color: 'white' }}>
        Modules
      </Typography> */}
      <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 4, md: 8 }}>
        {modules.map((module) => (
          <Grid size={{ xs: 2, sm: 4, md: 2 }} key={module.Id}>
            <Card  sx={{ maxWidth: 500,maxHeight:500, height:"200px", display:"flex",justifyContent:"center",alignItems:"center" }}
              onClick={() => handleCardClick(module.Id, module.name,module.JOB)}>
              <CardContent>
                <Box display="flex" justifyContent="center" mb={2}>
                  {iconMap[module.name] || <PaymentsRoundedIcon style={{ fontSize: 40 }} />}
                </Box>
                <Typography variant="h6" component="div" align="center" style={{ fontSize: '1rem' }}>
                  {module.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Orders;
