// EnvPage.jsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import { base } from '../config';
const API_URL=base(window.env.AP)


const EnvPage = ({pathname, navigate}) => {
  // const navigate = useNavigate();
  const location = useLocation();
  const env= JSON.parse(localStorage.getItem('env'))

  


  const handleRowClick = (variable) => {
    const variables = env.find((env) => env.instance_url === variable);
    localStorage.setItem('instance', JSON.stringify([variables]));
    navigate('/modules', { state: { variable } });
  };

  return (
    <Box style={{ display: 'flex', justifyContent: 'center', padding: '16px 16px' }}>
      <Paper style={{ width: '100%', maxWidth: '800px', padding: '16px' }}>
        <Typography variant="h4" style={{ fontSize: '1.2rem', marginBottom: '16px', fontWeight:"bolder" }}>Environment</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: '1.2rem' }}>Icon</TableCell>
                <TableCell style={{ fontSize: '1.2rem' }}>Environment Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {env && env.map((env, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => handleRowClick(env.instance_url)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell style={{ fontSize: '1.2rem', width: '60px', textAlign: 'center' }}>
                    <IconButton>
                      <DeviceHubIcon color="primary" style={{ fontSize: '1.2rem' }} />
                    </IconButton>
                  </TableCell>
                  <TableCell  style={{ fontSize: '1.2rem' }}>{env.envName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default EnvPage;
