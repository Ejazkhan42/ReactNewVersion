import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Container,
  CardMedia,
  Link,
} from "@mui/material";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import IconButton from '@mui/material/IconButton';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import { AuthLoginInfo } from "../AuthComponents/AuthLogin";
import Grid from '@mui/material/Grid2';
import { PageContainer } from '@toolpad/core/PageContainer';
import Box from '@mui/material/Box';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import "./styles/home.css";
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { base } from '../config';
import WebSocketManager from '../AuthComponents/useWebSocket';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  useGridApiContext,
  gridPaginatedVisibleSortedGridRowIdsSelector,
  GridToolbarExport,
} from '@mui/x-data-grid';
import clsx from 'clsx';
const API_URL = base(window.env.AP)

function CustomToolbar() {
  const apiRef = useGridApiContext();

  const getRowsFromCurrentPage = ({ apiRef }) => {
    // Get all rows from the current page
    const rowIds = gridPaginatedVisibleSortedGridRowIdsSelector(apiRef);

    // Filter out rows where test_status is "Running"
    const filteredRows = rowIds.filter((id) => {
      const row = apiRef.current.getRow(id);
      return row.test_status !== "Running";
    });

    return filteredRows;
  };

  const handleExport = (options) => {
    apiRef.current.exportDataAsCsv({
      ...options,
      fileName: `TEST_CASES_REPORT_${new Date().toLocaleDateString()}`,
      includeHeaders: true,
      includeColumnGroupsHeaders: true,
      includeFilters: true,
    });
  };
  const handleExportAll = () => {
    apiRef.current.exportDataAsCsv({
      fileName: `TEST_CASES_REPORT_${new Date().toLocaleDateString()}`,
      includeHeaders: true,
      includeColumnGroupsHeaders: true,
      includeFilters: true,
    });
  };
  return (
    <GridToolbarContainer>
      <Button
        onClick={() => handleExport({ getRowsToExport: getRowsFromCurrentPage })}
      >
        Export Current Page Report
      </Button>
      <Button onClick={handleExportAll}>
        Export All Report
      </Button>
    </GridToolbarContainer>
  );
}
function VideoView({ video, setOpen, open }) {
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('sm');
  const handlfullScreen = () => {
    setMaxWidth('xl');
  }
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title" style={{textAlign:"center"}}>{"TEST CASE VIDEO"}</DialogTitle>
      <DialogContent >
        <DialogContentText sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} id="alert-dialog-description">
          <video component="iframe" src={video} alt="Video"  width={"600"} style={{width:"550px",height:"300px",background:"black"}}  controls></video>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}


function Homepage({ pathname, navigate }) {
  const token = sessionStorage.getItem('token');
  const ctx = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
  
  const [dashboardData, setDashboardData] = useState([]);
  
  useEffect(() => {
    if (ctx.role_id === 1) {
      const handleWebSocketData = (data) => {
        if (Array.isArray(data) && data[0]?.hasOwnProperty('test_name') && data[0]?.hasOwnProperty("test_status")) {
          setDashboardData(data);
          processChartData(data);
        }
      };
      WebSocketManager.subscribe(handleWebSocketData);
      WebSocketManager.sendMessage({token:token, path: "data", type: "find", table: "logs" ,whereCondition: "start_time BETWEEN DATE_SUB(NOW(), INTERVAL 15 DAY) AND NOW()", whereValues: [] });
    }
    else {
      const handleWebSocketData = (data) => {
        if (Array.isArray(data) && data[0]?.hasOwnProperty('test_name') && data[0]?.hasOwnProperty("test_status") && data[0]?.username === ctx.username) {
          setDashboardData(data);
          processChartData(data);
        }
      };
      WebSocketManager.subscribe(handleWebSocketData);
      WebSocketManager.sendMessage({ path: "data", type: "find", table: "logs", whereCondition: "username=? AND start_time BETWEEN DATE_SUB(NOW(), INTERVAL 15 DAY) AND NOW()", whereValues: [ctx.username] });
    }
  }, []);




  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));



  const TableComponent = () => {
    const [openview, setOpenview] = useState(false);
    const [video, setvideo] = useState("");

    const handleVideoView = (video) => {
      setvideo(video)
      setOpenview(true)
    }
    const getExeclReport = (value, row) => {
      return `${API_URL}/download?path=${row.jenkinsPath || ''}&build=${row.build || ''}&type=excel`;
    };
    const getHtmlReport = (value, row) => {
      return `${API_URL}/download?path=${row.jenkinsPath || ''}&build=${row.build || ''}&type=html`;
    }
    const columns = [
      {
        field: "id",
        headerName: 'Id',
        flex: 0.2,
        resizable: false,
        minWidth: 80,
      },
      {
        field: "test_name",
        headerName: 'Job Name',
        flex: 1,
       
        minWidth: 150,
      },
      {
        field: "customer",
        headerName: 'Customer Name',
        flex: 1,
       
        minWidth: 150,
      },
      {
        field: "instance",
        headerName: 'Instance Name',
        flex: 0.3,
      
        minWidth: 150,
      },
      {
        field: "Video",
        headerName: 'Video View',
        flex: 0.2,
        
        minWidth: 80,
        renderCell: (params) => (
          <GridActionsCellItem
            icon={<PlayCircleOutlineIcon />}
            label="Video"
            title="Click to view video"
            onClick={() => handleVideoView(params.row.Video)}
          />),
      },
      {
        field: "excelReport", // Unique field for Excel Report
        headerName: 'Excel Report',
        flex: 0.2,
        minWidth: 80,
        valueGetter: getExeclReport,
        renderCell: (params) => (
          <Link
            variant="contained"
            href={params.value} // Use the value returned by valueGetter
            target="_blank"
            rel="noopener noreferrer"
          >
            Excel Report
          </Link>
        ),
      },
      {
        field: "htmlReport", // Unique field for HTML Report
        headerName: 'Html Report',
        flex: 0.2,
        minWidth: 80,
        valueGetter: getHtmlReport,
        renderCell: (params) => (
          <Link
            variant="contained"
            href={params.value} // Use the value returned by valueGetter
            target="_blank"
            rel="noopener noreferrer"
          >
            Html Report
          </Link>
        ),
      },
      {
        field: "start_time",
        headerName: 'Start Time',
        flex: 0.2,
     
        minWidth: 80,
        type: 'string',
        valueGetter: (value) => value && new Date(value).toLocaleString(),
      },
      {
        field: "end_time",
        headerName: 'End Time',
        flex: 0.2,
     
        minWidth: 80,
        type: 'string',
        valueGetter: (value) => value && new Date(value).toLocaleString(),
      },
      {
        field: "test_status",
        headerName: 'Status',
        flex: 0.2,
       
        minWidth: 80,
        cellClassName: (params) => {
          if (params.value == null) {
            return '';
          }

          return clsx('super-app', {
            fail: params.value == 'fail',
            pass: params.value == 'pass',
            running: params.value == "Running"
          });
        },
      },
    ];
    const paginationModel = { page: 0, pageSize: 20 };
    return (
      <Box sx={{
        paddingTop: "10px",
        width: '100%',
        '& .super-app-theme--cell': {
          backgroundColor: 'rgba(224, 183, 60, 0.55)',
          color: '#1a3e72',
          fontWeight: '600',
        },
        '& .super-app.fail': {
          color: 'floralwhite',
          backgroundColor: "darkred",
          textTransform: 'uppercase',
          fontWeight: '600',
        },
        '& .super-app.running': {
          color: "floralwhite",
          backgroundColor: "darkorange",
          textTransform: 'uppercase',
          fontWeight: '600',
        },
        '& .super-app.pass': {
          color: "floralwhite",
          backgroundColor: 'green',
          textTransform: 'uppercase',
          fontWeight: '600',
        },
      }} id="table-component">

        <Grid>

          <Item>
            <h3>Reports Of Test Case</h3>

            <DataGrid
  
              columns={columns}
              rows={dashboardData}
              initialState={{
                
                pagination: { 
                  paginationModel 
                }, 
                sorting: {
                  sortModel: [{ field: 'end_time', sort: 'desc' }],
                },
              }}
              slots={{
                toolbar: () => <CustomToolbar/>, // Pass handleAddClick to CustomToolbar
              }}
              pageSizeOptions={[20, 40, 80, 100]} />

          </Item>
          <VideoView video={video} setOpen={setOpenview} open={openview} />
        </Grid>
      </Box>
    );
  };

  return (

    <Box sx={{
      padding: "10px",


    }}>

      <TableComponent />


    </Box>

  );
}

export default Homepage;
