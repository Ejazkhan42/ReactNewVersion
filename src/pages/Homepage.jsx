import React, { useState, useEffect, useContext,useMemo } from "react";
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
  TableCell,
  TextField,
  TableContainer,
  Table,
  TableSortLabel, 
  TableHead,
  TableBody,
  TableRow,
  Paper,
  TablePagination,
  Container,
} from "@mui/material";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import { AuthLoginInfo } from "../AuthComponents/AuthLogin";
import Grid from '@mui/material/Grid2';
import { PageContainer } from '@toolpad/core/PageContainer';
import Box from '@mui/material/Box';
import { useNavigate,useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import "./styles/home.css";
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';

import { base } from '../config';
const API_URL=base(window.env.AP)




function Homepage() {
  const [data,setdata]=useState(true)    
  const [Focus, setFocus] = useState(false);

  const [order, setOrder] = useState('desc'); // Sort direction
  const [orderBy, setOrderBy] = useState('test_status'); // Column to sort by
  const [dashboardData, setDashboardData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const headCells = [
  { id: 'id', label: 'ID' },
  { id: 'test_name', label: 'Name' },
  { id: 'start_time', label: 'Job Run' },
  { id: 'test_status', label: 'Status' },
];

  useEffect(() => {
    axios
      .get(`${API_URL}/getlogs`, { withCredentials: true })
      .then((res) => {
        if (res.data) {
          setDashboardData(res.data);
          processChartData(res.data);
        //   setdata(false)
        }
      });
  }, []);

  const processChartData = (data) => {
    const pieCounts = { pass: 0, fail: 0, Running: 0 };
    data.forEach((item) => {
      pieCounts[item.test_status] += 1;
    });
    setPieData([
      { name: "Pass", value: pieCounts.pass },
      { name: "Fail", value: pieCounts.fail },
      { name: "Running", value: pieCounts.Running },
    ]);

    // Aggregate line chart data
    const lineCounts = {};
    data.forEach((item) => {
      const date = new Date(item.start_time).toLocaleDateString("default", {
        // year: "numeric",
        month: "short",
        day: "numeric",
      });
      if (!lineCounts[date]) {
        lineCounts[date] = { date, Pass: 0, Failed: 0 };
      }
      if (!lineCounts[date][item.test_name]) {
        lineCounts[date][item.test_name] = { Pass: 0, Failed: 0 };
      }
      if (item.test_status === 'pass') {
        lineCounts[date][item.test_name].Pass += 1;
        lineCounts[date].Pass += 1; // Total pass count for the date
      } else if (item.test_status === 'fail') {
        lineCounts[date][item.test_name].Failed += 1;
        lineCounts[date].Failed += 1; // Total fail count for the date
      }
    });
    setLineData(Object.values(lineCounts));
  };
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

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const getStatusColor = (status) => {
    switch (status) {
      case "fail":
        return { color: "red", borderColor: "darkred" };
      case "pass":
        return { color: "green", borderColor: "darkgreen" };
      case "Running":
        return { color: "orange", borderColor: "darkorange" };
      default:
        return { color: "black", borderColor: "transparent" };
    }
  };

  const scrollToTable = () => {
    const tableElement = document.getElementById("table-component");
    tableElement.scrollIntoView({ behavior: "smooth" });
  };
  
 
 
 const handleSort = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const createSortHandler = (column) => () => {
    handleSort(column);
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      if (order === 'asc') {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
          
        return a[orderBy] > b[orderBy] ? -1 : 1;
      }
    });
  };
 

 
 
 
 


  

  function ButtonComponent() {
    const [isClicked, setIsClicked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      let timeoutId;

      if (isClicked) {
        timeoutId = setTimeout(() => setIsClicked(false), 2000);
      }

      return () => {
        clearTimeout(timeoutId);
      };
    }, [isClicked]);

    const handleClick = () => {
      setIsClicked(true);
      navigate('/customers');
    };

    return (
      <Container>
      <a
        className={`btn ${isClicked ? 'is-clicked' : ''}`}
        onClick={handleClick}
      >
        Run Test Case
      </a>
      </Container>

    );
  }



  const TopPanel = () => {
    return (
      <Box>
        <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 2, sm: 8, md: 12 }}>
          <Grid size={{ xs: 2, sm: 4, md: 3 }}>
            <Item onClick={scrollToTable}>
              <div>
                <h3>Total Cases in Library</h3>
                <div>
                  <LibraryBooksRoundedIcon />
                </div>
                <h1>{dashboardData.length}</h1>
              </div>
            </Item>
          </Grid>
          <Grid size={{ xs: 2, sm: 4, md: 3 }}>
            <Item className="card" onClick={scrollToTable}>
              <div>
                <h3>Total Cases Run</h3>
                <div>
                  <PlayArrowRoundedIcon />
                </div>
                <h1>{pieData.reduce((acc, d) => acc + d.value, 0)}</h1>
              </div>
            </Item>
          </Grid>
          {/* <Grid size={{ xs: 2, sm: 4, md: 4.3 }}>
            <Item onClick={scrollToTable}>
              <div>
                <h3>Total Cases in Progress</h3>
                <div>
                  <EventNoteRoundedIcon />
                </div>
                <h1>{pieData.find((d) => d.name === "Running")?.value || 0}</h1>
              </div>
            </Item>
          </Grid> */}
          <Grid size={{ xs: 2, sm: 4, md: 3 }}>
            <Item onClick={scrollToTable}>
              <div>
                <h3>Total Failed</h3>
                <div>
                  <TrendingUpRoundedIcon />
                </div>
                <h1>{pieData.find((d) => d.name === "Fail")?.value || 0}</h1>
              </div>
            </Item>
          </Grid>
          <Grid size={{ xs: 2, sm: 4, md: 3 }}>
            <Item onClick={scrollToTable}>
              <div>
                <h3>Total Passed</h3>
                <div>
                  <PaymentsRoundedIcon />
                </div>
                <h1>{pieData.find((d) => d.name === "Pass")?.value || 0}</h1>
              </div>
            </Item>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const ChartComponent = () => {
    const customNames = [
      "Recruiting Campaigns",
      "Offer Management",
      "Requisition Management",
      "Candidate Management",
      "Onboarding",
      "Selection",
      "Candidate Management",
      "Agency Management",
      "Candidate Application",
      "Hiring",
      "Configuration",
    ];

    return (

      <Box sx={{paddingTop:"10px"}} >
        <Grid container spacing={{ xs: 4, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid size={{ xs: 4, sm: 4, md: 8 }}>
            <Item>
              <h3>Performance</h3>
              <ResponsiveContainer width="100%" height={400}>

                <LineChart
                  data={lineData}
                  margin={{ top: 1, right: 1, left: 1, bottom: 1 }}
                >
                  <Legend
                    payload={customNames.map((name, index) => ({
                      id: name,
                      type: "line",
                      value: name,
                      color: "#8884d8",
                    }))}
                  />
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />

                  <Tooltip />

                  <Line type="monotone" dataKey="Pass" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="Failed" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Item>

          </Grid>
          <Grid size={{ xs: 4, sm: 4, md: 4 }}>
            <Item>
              <h3>Test Status Distribution</h3>
              <ResponsiveContainer width="100%" height={379}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="legend">
                {pieData.map((entry, index) => (
                  <span key={`legend-${index}`} style={{paddingInline:"4px"}}>
                    <span
                      className="legend-color"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    {entry.name}
                  </span>
                ))}
              </div>
            </Item>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

   const handleSearchChange = (event) => {
    setFocus(true)
    setSearchTerm(event.target.value);
    setPage(0);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

const sortedData = useMemo(() => {
  return sortData(
    dashboardData.filter((data) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      // Check if test_name, _test_status, or id contains the searchTerm
      const matchesTestName = data.test_name.toLowerCase().includes(lowerCaseSearchTerm);
      const matchesTestStatus = data.test_status.toLowerCase().includes(lowerCaseSearchTerm);
      const matchesId = data.id.toString().includes(lowerCaseSearchTerm); // Assuming id can be filtered too
      
      // Return true if any condition matches
      return matchesTestName || matchesTestStatus || matchesId;
    })
  );
}, [dashboardData, orderBy, searchTerm, order]);


  const slicedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const TableComponent = () => {
    
    return (
      <Box  sx={{paddingTop:"10px"}} id="table-component">

        <Grid>
          <Item>
          <h3>Recent Run Test Case</h3>
           <TextField
            autoFocus={Focus}
              style={{ marginTop: "0px" }}
              label="Search By Id, Name, Status"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
              sx={{paddingBottom:"10px"}}
              
            />
        <TableContainer sx={{ maxHeight: 500}} component={Paper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                 {headCells.map((headCell) => (
                    <TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={createSortHandler(headCell.id)}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {slicedData.map((row) => (
                <TableRow hover role="checkBox" tabIndex={-1} key={row.id}>
                  <TableCell>
                    {row.id}
                  </TableCell>
                  <TableCell>
                    {row.test_name}
                  </TableCell>
                  
                  <TableCell>
                    {new Date(row.start_time).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        ...getStatusColor(row.test_status),
                        padding: "6px 12px",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                        border: `1px solid ${getStatusColor(row.test_status).borderColor
                          }`,
                      }}
                    >
                      {row.test_status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={sortedData.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </TableContainer>
          </Item>
   
        </Grid>
      </Box>
    );
  };

  return (

    <Box sx={{padding:"10px"}}>
      <ButtonComponent/>
      <TopPanel/>
      <ChartComponent />
      <TableComponent />
    </Box>

  );
}

export default Homepage;
