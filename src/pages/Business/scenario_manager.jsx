
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Modal,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Autocomplete,
  Paper,
} from '@mui/material';
import WebSocketManager from '../../AuthComponents/useWebSocket';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer, GridToolbarExport
} from '@mui/x-data-grid';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  display: "grid",
  p: 4,
};

function CustomToolbar({ handleAddClick }) {

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleAddClick} >
        Add record
      </Button>
      <GridToolbarExport printOptions={{ disableToolbarButton: true }} />

    </GridToolbarContainer>
  );
}

function scenario_manager() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [lodding, setLodding] = useState(false);
  const [Testcase, setTestcase] = useState([]);
  const [Scenario, setScenario] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteId, setDeleteId] = useState(null)
  useEffect(() => {
    const handleWebSocketData = (data) => {
      if (Array.isArray(data) && data[0]?.Modules_id && data[0]?.Test_Case) {
        setTestcase(data);
        setTotalFetchedRows(data.length);
      } else if (Array.isArray(data) && data[0]?.Test_Scenario && !data[0]?.Test_Case) {
        setScenario(data);
      }
      setLodding(false);
    };

    WebSocketManager.subscribe(handleWebSocketData);
    WebSocketManager.sendMessage({ path: "data", type: "list", table: "testcase" });
    WebSocketManager.sendMessage({ path: "data", type: "list", table: "scenario_manager" });

    return () => WebSocketManager.unsubscribe(handleWebSocketData);
  }, [openAdd, openUpdate, lodding]);

  const handleUpdateClick = (row) => {
    setSelectedRow(row);

    setOpenUpdate(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id)

  };
  const handleDeleteConfirm = () => {
    WebSocketManager.sendMessage({ path: 'data', type: 'delete', table: 'scenario_manager', id: `${deleteId}` });
    setLodding(true);
    setDeleteId(null)
  }

  const handleAddClick = () => {
    setOpenAdd(true);
  }
  const columns = [
    {
      field: "id",
      headerName: 'Id',
      flex: 0.3,
      resizable: false,
      minWidth: 100,
    },
    {
      field: "Test_Scenario",
      headerName: 'Scenario Name',
      flex: 1,
      resizable: false,
      minWidth: 150,
    },
    {
      field: "SSO",
      headerName: 'SSO',
      flex: 1,
      resizable: false,
      minWidth: 100,
    },
    {
      field: "Execute",
      headerName: 'Execute',
      flex: 1,
      resizable: false,
      minWidth: 100,
    },
    {
      field: "Browser",
      headerName: 'Browser',
      flex: 1,
      resizable: false,
      minWidth: 100,
    },
    {
      field: "Platform",
      headerName: 'Platform',
      flex: 1,
      resizable: false,
      minWidth: 100,
    },
    {
      field: "Device",
      headerName: 'Device',
      flex: 1,
      resizable: false,
      minWidth: 100,
    },
    {
      field: "Iteration_Mode",
      headerName: 'Iteration Mode',
      flex: 1,
      resizable: false,
      minWidth: 100,
    },
    {
      field: "Start_Iteration",
      headerName: 'Start Iteration ',
      flex: 1,
      resizable: false,
      minWidth: 100,
    },
    {
      field: "End_Iteration",
      headerName: 'End Iteration',
      flex: 1,
      resizable: false,
      minWidth: 100,
    },
    {
      field: 'Test_Case',
      headerName: 'Test Case',
      width: 170,
      valueGetter: (value, row) => Testcase.find((tc) => tc.id === row.test_case_id)?.Test_Case || 'Unknown',
    },
    {
      field: 'actions',
      sortable: false,
      filter: false,
      headerName: 'Actions',
      flex: 0.3,
      resizable: false,
      filterable: false,
      minWidth: 100,
      renderCell: (params) => (
        [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleUpdateClick(params.row)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(params.row.id)}
            color="inherit"
          />
        ]
      ),
    },
  ];
  const paginationModel = { page: 0, pageSize: 5 };
  return (
    <Container>
      <AddModal Open={openAdd} setOpen={setOpenAdd} />
      <UpdatesModal open={openUpdate} setOpen={setOpenUpdate} rows={selectedRow} />
      <Paper color="primary"
        variant="outlined"
        shape="rounded" sx={{ height: 410, width: '100%' }}>
        <DataGrid
          columns={columns}
          rows={Scenario}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 25, 100]}
          slots={{
            toolbar: () => <CustomToolbar handleAddClick={handleAddClick} />, // Pass handleAddClick to CustomToolbar
          }}
        />
      </Paper>
      <Dialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Scenario?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
export default scenario_manager

const AddModal = ({ Open, setOpen }) => {
  const [TestScenario, setTestScenario] = useState('Sample');
  const [SSO, setSSO] = useState([{ id: 'NO' }, { id: 'YES' }]);
  const [selectedSSO, setSelectedSSO] = useState(SSO[0]); // Default selection for SSO

  const [browsers, setBrowsers] = useState([
    { id: 'Chrome' },
    { id: 'Firefox' },
    { id: 'Safari' },
    { id: 'Edge' },
    { id: 'Mobile' }
  ]);
  const [selectedBrowser, setSelectedBrowser] = useState(browsers[0]); // Default selection for browser

  const [platforms, setPlatforms] = useState([
    { id: 'Windows' },
    { id: 'MacOS' }
  ]);
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0]); // Default selection for platform

  const [executeOptions, setExecuteOptions] = useState([
    { id: 'NO' },
    { id: 'Yes' }
  ]);
  const [selectedExecute, setSelectedExecute] = useState(executeOptions[0]); // Default selection for Execute

  const [devices, setDevices] = useState([
    { id: 'iPhone X' },
    { id: 'iPhone 6/7/8' },
    { id: 'iPhone 6/7/8 Plus' },
    { id: 'iPad' },
    { id: 'iPad Pro' },
    { id: 'Galaxy S5' },
    { id: 'Pixel 2' },
    { id: 'Pixel 2 XL' },
    { id: 'Nexus 5X' },
    { id: 'Nexus 6P' }
  ]);
  const [selectedDevice, setSelectedDevice] = useState(devices[0]); // Default selection for device

  const [iterationModes, setIterationModes] = useState([
    { id: 'RunAllIterations' },
    { id: 'RunOneIterationOnly' },
    { id: 'RunRangeOfIterations' }
  ]);
  const [selectedIterationMode, setSelectedIterationMode] = useState(iterationModes[0])
  const [Start_Iteration, setStart_Iteration] = useState(null);
  const [End_Iteration, setEnd_Iteration] = useState(null);
  const [SelectTestcase, setSelectTescase] = useState(null);
  const [Testcase, setTestcase] = useState([]);
  useEffect(() => {
    WebSocketManager.sendMessage({ path: 'data', type: 'list', table: 'testcase' });

  }, []);

  useEffect(() => {
    const handleWebSocketData = (data) => {
      if (Array.isArray(data)) {
        switch (true) {
          case data[0]?.hasOwnProperty('Test_Case') && data[0]?.hasOwnProperty("Modules_id"):
            setTestcase(data);
            break;
          default:
            break;
        }
      }
    };
    WebSocketManager.subscribe(handleWebSocketData);
    return () => WebSocketManager.unsubscribe(handleWebSocketData);
  }, []);
  const handleOpen = () => {
    setOpen(true);
  };



  const handleSubmit = (event) => {
    event.preventDefault();
    WebSocketManager.sendMessage({
      path: 'data',
      type: 'insert',
      table: 'scenario_manager',
      columns: ['Test_Scenario', 'SSO', 'Execute', 'Browser', 'Platform', 'Device', 'Iteration_Mode', 'Start_Iteration', 'End_Iteration', 'test_case_id'],
      values: [TestScenario, selectedSSO.id, selectedExecute.id, selectedBrowser.id, selectedPlatform.id, selectedDevice.id, selectedIterationMode.id, Start_Iteration, End_Iteration, SelectTestcase.id],
    });
    const handleWebSocketData = (data) => {
      if (data?.status == "inserted" && data?.tableName == "scenario_manager") {
        setOpen(false);
      }
    }
    WebSocketManager.subscribe(handleWebSocketData);
    return () => WebSocketManager.unsubscribe(handleWebSocketData);
  };



  return (
    <div>

      <Modal open={Open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-SSO">
        <Box component="form" sx={style} onSubmit={handleSubmit}>
          <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Add New Scenario</Typography>
          <TextField fullWidth label="Test Scenario" variant="outlined" value={TestScenario} onChange={(e) => setTestScenario(e.target.value)} />
          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={SelectTestcase}
              options={Testcase}
              getOptionLabel={(option) => option?.Test_Case}
              onChange={(event, newValue) => setSelectTescase(newValue)}
              renderInput={(params) => <TextField {...params} label="Test Case" variant="outlined" />}

            />
          </FormControl>
          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={selectedSSO}
              options={SSO}
              getOptionLabel={(option) => option?.id}
              onChange={(event, newValue) => setSelectedSSO(newValue)}
              renderInput={(params) => <TextField {...params} label="SSO" variant="outlined" />}

            />
          </FormControl>
          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={selectedExecute}
              options={executeOptions}
              getOptionLabel={(option) => option?.id}
              onChange={(event, newValue) => setSelectedExecute(newValue)}
              renderInput={(params) => <TextField {...params} label="Exectue" variant="outlined" />}

            />
          </FormControl>
          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={selectedBrowser}
              options={browsers}
              getOptionLabel={(option) => option?.id}
              onChange={(event, newValue) => setSelectedBrowser(newValue)}
              renderInput={(params) => <TextField {...params} label="Browser" variant="outlined" />}

            />
          </FormControl>
          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={selectedPlatform}
              options={platforms}
              getOptionLabel={(option) => option?.id}
              onChange={(event, newValue) => setSelectedPlatform(newValue)}
              renderInput={(params) => <TextField {...params} label="Platfrom" variant="outlined" />}

            />
          </FormControl>
          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={selectedDevice}
              options={devices}
              getOptionLabel={(option) => option?.id}
              onChange={(event, newValue) => setSelectedDevice(newValue)}
              renderInput={(params) => <TextField {...params} label="Devices" variant="outlined" />}

            />
          </FormControl>
          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={selectedIterationMode}
              options={iterationModes}
              getOptionLabel={(option) => option?.id}
              onChange={(event, newValue) => setSelectedIterationMode(newValue)}
              renderInput={(params) => <TextField {...params} label="Iterations Mode" variant="outlined" />}

            />
          </FormControl>
          <TextField fullWidth label="Start Iteration" variant="outlined" value={Start_Iteration} onChange={(e) => setStart_Iteration(e.target.value)} />
          <TextField fullWidth label="End Iteration" variant="outlined" value={End_Iteration} onChange={(e) => setEnd_Iteration(e.target.value)} />
          <Button variant="contained" color="secondary" type="submit">Submit</Button>
        </Box>
      </Modal>
    </div>
  );
};

const UpdatesModal = ({ rows, open, setOpen }) => {
  const [TestScenario, setTestScenario] = useState('Sample');
  const [SSO, setSSO] = useState([{ id: 'NO' }, { id: 'YES' }]);
  const [selectedSSO, setSelectedSSO] = useState(SSO[0]); // Default selection for SSO

  const [browsers, setBrowsers] = useState([
    { id: 'Chrome' },
    { id: 'Firefox' },
    { id: 'Safari' },
    { id: 'Edge' },
    { id: 'Mobile' }
  ]);
  const [selectedBrowser, setSelectedBrowser] = useState(browsers[0]); // Default selection for browser

  const [platforms, setPlatforms] = useState([
    { id: 'Windows' },
    { id: 'MacOS' }
  ]);
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0]); // Default selection for platform

  const [executeOptions, setExecuteOptions] = useState([
    { id: 'NO' },
    { id: 'Yes' }
  ]);
  const [selectedExecute, setSelectedExecute] = useState(executeOptions[0]); // Default selection for Execute

  const [devices, setDevices] = useState([
    { id: 'iPhone 6S' },
    { id: 'iPhone X' },
    { id: 'iPhone 6/7/8' },
    { id: 'iPhone 6/7/8 Plus' },
    { id: 'iPad' },
    { id: 'iPad Pro' },
    { id: 'Galaxy S5' },
    { id: 'Pixel 2' },
    { id: 'Pixel 2 XL' },
    { id: 'Nexus 5X' },
    { id: 'Nexus 6P' }
  ]);
  const [selectedDevice, setSelectedDevice] = useState(devices[0]); // Default selection for device

  const [iterationModes, setIterationModes] = useState([
    { id: 'RunAllIterations' },
    { id: 'RunOneIterationOnly' },
    { id: 'RunRangeOfIterations' }
  ]);
  const [selectedIterationMode, setSelectedIterationMode] = useState(iterationModes[0])
  const [Start_Iteration, setStart_Iteration] = useState(null);
  const [End_Iteration, setEnd_Iteration] = useState(null);
  const [SelectTestcase, setSelectTescase] = useState(null);
  const [Testcase, setTestcase] = useState([]);
  const [TestScenario_id, setTestScenario_id] = useState([])
  useEffect(() => {
    WebSocketManager.sendMessage({ path: 'data', type: 'list', table: 'testcase' });

  }, []);

  useEffect(() => {
    const handleWebSocketData = (data) => {
      if (Array.isArray(data)) {
        switch (true) {
          case data[0]?.hasOwnProperty('Test_Case') && data[0]?.hasOwnProperty("Modules_id"):
            setTestcase(data);
            break;
          default:
            break;
        }
      }
    };
    WebSocketManager.subscribe(handleWebSocketData);
    return () => WebSocketManager.unsubscribe(handleWebSocketData);
  }, []);

  useEffect(() => {
    setTestScenario_id(rows?.id || '')
    setTestScenario(rows?.Test_Scenario || '')
    setSelectedSSO(SSO.find((SSO) => SSO.id.toLowerCase() === rows?.SSO.toLowerCase()) || null);
    setSelectedExecute(executeOptions.find((Execute) => Execute.id.toLowerCase() === rows?.Execute.toLowerCase()) || null);
    setSelectedBrowser(browsers.find((Browser) => Browser.id.toLowerCase() === rows?.Browser.toLowerCase()) || null);
    setSelectedPlatform(platforms.find((Platform) => Platform.id.toLowerCase() === rows?.Platform.toLowerCase()) || null);
    setSelectedDevice(devices.find((Device) => Device.id.toLowerCase() === rows?.Device.toLowerCase()) || null);
    setSelectedIterationMode(iterationModes.find((Iteration_Mode) => Iteration_Mode.id.toLowerCase() === rows?.Iteration_Mode.toLowerCase()) || null);
    setStart_Iteration(rows?.Start_Iteration || null)
    setEnd_Iteration(rows?.End_Iteration || null)
    setSelectTescase(Testcase.find((tc) => tc.id === rows?.test_case_id) || null);
  }, [rows, SelectTestcase]);

  const handleSubmit = (event) => {
    event.preventDefault();
    WebSocketManager.sendMessage({
      path: 'data',
      type: 'update',
      table: 'scenario_manager',
      whereCondition: "id=?",
      whereValues: [TestScenario_id],
      columns: ['Test_Scenario', "SSO", "test_case_id", "Execute", "Browser", "Platform", "Device", "Iteration_Mode", "Start_Iteration", "End_Iteration"],
      values: [TestScenario, selectedSSO.id, SelectTestcase.id, selectedExecute.id, selectedBrowser.id, selectedPlatform.id, selectedDevice.id, selectedIterationMode.id, Start_Iteration, End_Iteration],
    });
    const handleWebSocketData = (data) => {
      if (data?.status == "updated" && data?.tableName == "scenario_manager") {
        setOpen(false);
      }
    }
    WebSocketManager.subscribe(handleWebSocketData);
    return () => WebSocketManager.unsubscribe(handleWebSocketData);
  };

  return (
    <div>
      <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box component="form" sx={style} onSubmit={handleSubmit}>
          <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Add Upate Scenario</Typography>
          <TextField fullWidth label="Test Case Name" variant="outlined" value={TestScenario} onChange={(e) => setTestScenario(e.target.value)} />
          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={SelectTestcase}
              options={Testcase}
              getOptionLabel={(option) => option?.Test_Case}
              onChange={(event, newValue) => setSelectTescase(newValue)}
              renderInput={(params) => <TextField {...params} label="Type" variant="outlined" />}

            />
          </FormControl>
          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={selectedSSO}
              options={SSO}
              getOptionLabel={(option) => option?.id}
              onChange={(event, newValue) => setSelectedSSO(newValue)}
              renderInput={(params) => <TextField {...params} label="SSO" variant="outlined" />}

            />
          </FormControl>
          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={selectedExecute}
              options={executeOptions}
              getOptionLabel={(option) => option?.id}
              onChange={(event, newValue) => setSelectedExecute(newValue)}
              renderInput={(params) => <TextField {...params} label="Exectue" variant="outlined" />}

            />
          </FormControl>
          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={selectedBrowser}
              options={browsers}
              getOptionLabel={(option) => option?.id}
              onChange={(event, newValue) => setSelectedBrowser(newValue)}
              renderInput={(params) => <TextField {...params} label="Browser" variant="outlined" />}

            />
          </FormControl>
          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={selectedPlatform}
              options={platforms}
              getOptionLabel={(option) => option?.id}
              onChange={(event, newValue) => setSelectedPlatform(newValue)}
              renderInput={(params) => <TextField {...params} label="Platfrom" variant="outlined" />}

            />
          </FormControl>
          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={selectedDevice}
              options={devices}
              getOptionLabel={(option) => option?.id}
              onChange={(event, newValue) => setSelectedDevice(newValue)}
              renderInput={(params) => <TextField {...params} label="Devices" variant="outlined" />}

            />
          </FormControl>
          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={selectedIterationMode}
              options={iterationModes}
              getOptionLabel={(option) => option?.id}
              onChange={(event, newValue) => setSelectedIterationMode(newValue)}
              renderInput={(params) => <TextField {...params} label="Iterations Mode" variant="outlined" />}

            />
          </FormControl>
          <TextField fullWidth label="Start Iteration" variant="outlined" value={Start_Iteration} onChange={(e) => setStart_Iteration(e.target.value)} />
          <TextField fullWidth label="End Iteration" variant="outlined" value={End_Iteration} onChange={(e) => setEnd_Iteration(e.target.value)} />
          <Button variant="contained" color="secondary" type="submit">Submit</Button>
        </Box>
      </Modal>
    </div>
  );
};
