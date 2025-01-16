import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Autocomplete,
  CircularProgress
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import VncScreen from "./Browser";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Grid from '@mui/material/Grid2';
import { useLocation } from "react-router-dom";
import { base } from '../config';
import WebSocketManager from '../AuthComponents/useWebSocket';
const API_URL = base(window.env.AP)

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
    color: "#FF8225"
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
  return (
    <Paper>
      <Typography variant="h4" align="center" gutterBottom>
        Excel Data
      </Typography>
      {excelData.length === 0 && <Typography variant="h6" align="center" gutterBottom> No Data Found</Typography>}
      {excelData.length > 0 &&

        <DataGrid
          rows={excelData?.map((row, index) => ({ ...row, id: index }))}
          columns={Object.keys(excelData?.[0]).map((key) => ({ field: key, headerName: key, width: 150 }))}
          pageSize={10}
          checkboxSelection
        />}
    </Paper>
  );
};

const ResponsivePage = ({ pathname, navigate }) => {

  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { excelData } = location?.state?.excelData ? location?.state : {
    excelData: sessionStorage.getItem('excelData') ? JSON.parse(sessionStorage.getItem('excelData')) : []
  };
  const [serverDetails, setServerDetails] = useState({ server: "", password: "" });
  const [sessionIds, setSessionIds] = useState(sessionStorage.getItem('browsers_id') ? JSON.parse(sessionStorage.getItem('browsers_id')) : []);
  const [selectedSession, setSelectedSession] = useState(null);
  const [vncConnectionStatus, setVncConnectionStatus] = useState("disconnected");
  useEffect(() => {
    const handleWebSocketData = (data) => {
      if (data.path === "chat" && data?.token === localStorage.getItem('Token') && data?.hasOwnProperty('browserId')) {
        setSessionIds((prevSessionIds) => {
          const updatedSessionIds = [...prevSessionIds, data];
          sessionStorage.setItem("browsers_id", JSON.stringify(updatedSessionIds));
          return updatedSessionIds;
        });

      }
    };

    WebSocketManager.subscribe(handleWebSocketData);
    return () => WebSocketManager.unsubscribe(handleWebSocketData);
  }, []);

  const handleConnect = () => {
    if (selectedSession) {
      setVncConnectionStatus("connecting");
    }

  };

  const handleDisconnect = () => {
    setSelectedSession(null);
    setVncConnectionStatus("disconnected");
    setServerDetails({ server: "", password: "" });
  };

  const handleSessionChange = (event, value) => {
    setSelectedSession(value);
    const session = sessionIds?.find((session) => session.browserId === value?.browserId);
    if (session) {
      setServerDetails({ server: session.server, password: session.password });
    }
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
            <Autocomplete
              options={sessionIds}
              value={selectedSession}
              getOptionLabel={(option) => option?.testcase || ""}
              onChange={handleSessionChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Session"
                  variant="outlined"
                  fullWidth
                  disabled={vncConnectionStatus === "connecting" || vncConnectionStatus === "connected"}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid>
            <Button
              sx={{ marginTop: '1%', marginBottom: '1%', fontSize: '1rem', backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' }, '&:disabled': { backgroundColor: "#FF8225" } }}
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
              sx={{ marginTop: '1%', marginBottom: '1%', fontSize: '1rem', backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' }, '&:disabled': { backgroundColor: "#FF8225" } }}
              onClick={handleDisconnect}
              disabled={vncConnectionStatus === "disconnected"}
            >
              Disconnect
            </Button>
          </Grid>
          {/* I want change marginButton on vncConnectionStatus==connecting margin 50% ==connected margin 4%  */}
          <Grid sx={{ height: "100%", maxHeight: "638px", marginBottom: getMarginBottom() }}>
            {selectedSession && serverDetails?.server && (
              <>
              <Typography variant="h5" align="center" >
                Live View of {selectedSession?.testcase}
              </Typography>
              <VncScreen
                session={selectedSession.browserId}
                SELENOID_URL={serverDetails.server}
                SELENOID_PASSWORD={serverDetails.password}
                onUpdateState={setVncConnectionStatus}
              />
              </>
            )}
          </Grid>
          <Grid sx={{ with: "70%", maxWidth: "1200px" }}>
          </Grid>

          <StyledPaper>
            <DataSetTable excelData={excelData} />
          </StyledPaper>
        </Grid>

      </Box>
    </Container>
  );
};

export default ResponsivePage;