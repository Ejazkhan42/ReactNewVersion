import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  Button,
  TablePagination,
  InputLabel,
  CircularProgress
} from "@mui/material";
import VncScreen from "./Browser";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Grid from '@mui/material/Grid2';
import { useLocation } from "react-router-dom";
import { base } from '../config';
import WebSocketManager from '../AuthComponents/useWebSocket';
const API_URL=base(window.env.AP)

const StyledPaper = styled(Paper)({
  padding: "16px",
  marginBottom: "16px",
  textAlign: "left",
  color: "#333",
});

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
        color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
        p: 1,
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
        ...sx,
      }}
      {...other}
    />
  );
}



const styles = theme => ({
  disabledButton: {
    backgroundColor: '#173B45',
    color:"#FF8225"
  }
});
const SystemLog = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "8px",
});

const LogItem = styled("div")(({ theme, active }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  "&:before": {
    content: '""',
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: active
      ? theme.palette.primary.main
      : theme.palette.grey[400],
  },
}));

const DataSetTable = ({ excelData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = excelData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Paper>
      <Typography variant="h4" align="center" gutterBottom>
        Excel Data
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {excelData.length > 0 &&
                Object.keys(excelData[0]).map((key) => (
                  <TableCell key={key} sx={{ fontSize: "0.9rem" }}>
                    {key}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index}>
                {Object.values(row).map((value, cellIndex) => (
                  <TableCell key={cellIndex} sx={{ fontSize: "0.7rem" }}>
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={excelData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ marginTop: "16px", fontSize: "1.2rem" }}
      />
    </Paper>
  );
};

const ResponsivePage = ({ pathname,navigate }) => {
  
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { excelData,servers } = location.state || { excelData: [],servers:{} };
  console.log(servers)
  const [getSession,setSesssion]=useState(false)
  const [sessionIds, setSessionIds] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [vncConnectionStatus, setVncConnectionStatus] =
  useState("disconnected");
  useEffect(() => {
    const handleWebSocketData = (data) => {
      if (data.path ==="chat" && data?.token === localStorage.getItem('Token')) {
        setSessionIds([data]);
        
      }
    };

    WebSocketManager.subscribe(handleWebSocketData);
    return () => WebSocketManager.unsubscribe(handleWebSocketData);
  }, [getSession]);

  const handleConnect = () => {
    if (selectedSession) {
      setVncConnectionStatus("connecting");
    }
    
  };

  const handleDisconnect = () => {
    setSelectedSession(null);
    setVncConnectionStatus("disconnected");
    setSesssion(true)
  };

  const handleSessionChange = (event) => {
    setLoading(false)
    setSelectedSession(event.target.value)
    
  };
const handleDropdownOpen = () => {
   const handleWebSocketData = (data) => {
      if ( data.path ==="chat" && data?.token === localStorage.getItem('Token')) {
        setSessionIds([data]);
      }
    };

    WebSocketManager.subscribe(handleWebSocketData);
    return () => WebSocketManager.unsubscribe(handleWebSocketData);
};

  const getMarginBottom = () => {
    switch (vncConnectionStatus) {
      case "disconnected":
        return "50%";
      case "connecting":
        return "50%";
      case "connected":
          return "4%";  
      default:
        return "50%";
    }
  };

  return (
    <Container>
     <Box sx={{
        display: 'grid',
        columnGap: 1,
        rowGap: 1,
        gridTemplateColumns: 'repeat(1, 1fr)',
        }}>
        <Grid>
        <Grid>
            <InputLabel id="demo-multiple-checkbox-label" sx={{fontSize: "1.2rem"}}>
        Select Session
            </InputLabel>
        <Select
            value={selectedSession}
            onChange={handleSessionChange}
            onOpen={handleDropdownOpen}
            displayEmpty
            fullWidth
            variant="outlined"
            disabled={
          vncConnectionStatus === "connecting" ||
          vncConnectionStatus === "connected"
            }
      >
        {loading ? (
              <MenuItem disabled>
                    <CircularProgress size={24} style={{ marginRight: '10px' }} />
                    Session ID
              </MenuItem>
            ) : (
              sessionIds.map((session) => (
                <MenuItem key={session.browserId} value={session.browserId}>
                  {session.testcase}
                </MenuItem>
              ))
            )}
          </Select>
    </Grid>
    <Grid>
        <Button
            sx={{ ml: 2, fontSize: '1rem', backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' },'&:disabled':{backgroundColor:"#FF8225"}}}
                 onClick={handleConnect}
             disabled={
                     vncConnectionStatus === "connecting" ||
                     vncConnectionStatus === "connected"
          }
        >
          LIVE VIEW
        </Button>
             <Button
            style={{ marginLeft: "10px" }}
            variant="outlined"
            sx={{ ml: 2, fontSize: '1rem', backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' },'&:disabled':{backgroundColor:"#FF8225"}}}
            onClick={handleDisconnect}
            disabled={vncConnectionStatus === "disconnected"}
        >
          Disconnect
        </Button>
    </Grid>
    {/* I want change marginButton on vncConnectionStatus==connecting margin 50% ==connected margin 4%  */}
    <Grid sx={{height:"100%",maxHeight:"638px",marginBottom:getMarginBottom()}}>
    {selectedSession && (
        <VncScreen
          session={selectedSession}
          SELENOID_URL={servers?.url}
          SELENOID_PASSWORD={servers?.password}
          onUpdateState={setVncConnectionStatus}
        />
      )}
    </Grid>
    <Grid sx={{with:"70%",maxWidth:"1200px"}}>
    </Grid>
    
    <StyledPaper>
    <Typography variant="h6" gutterBottom>
      Data Set
    </Typography>
    <DataSetTable excelData={excelData} />
  </StyledPaper>
    </Grid>

     </Box>
    </Container>
  );
};

export default ResponsivePage;