
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Modal,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
  FormControl,
  Autocomplete,
  TableFooter,
  Paper,
  TableContainer,
  TablePagination
} from '@mui/material';
import WebSocketManager from '../../AuthComponents/useWebSocket';
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
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer, GridToolbarExport
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
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
const useWebSocketData = (subscriptions, Load, setLoad) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const handleWebSocketData = (incomingData) => {
      if (Array.isArray(incomingData)) {
        subscriptions.forEach(({ condition, stateSetter }) => {
          if (condition(incomingData)) {
            stateSetter(incomingData);

          }
        });
      }
    };

    WebSocketManager.subscribe(handleWebSocketData);
    setLoad(false);
    return () => {
      WebSocketManager.unsubscribe(handleWebSocketData);
    };
  }, [subscriptions, Load]);

  return data;
};
const TestFlow = ({ selectedTestCase, flowData, paginationModel, setPaginationModel, setLoad }) => {
  const columns = [
    { field: "id", headerName: 'Id', flex: 0.3, minWidth: 100 },
    { field: "Test_Case", headerName: 'Name', flex: 1, minWidth: 150 },
    { field: "flow", headerName: 'Stage No', flex: 0.3, minWidth: 100 },
    { field: "component_name", headerName: 'Component', flex: 0.3, minWidth: 100 },
    { field: "Customer", headerName: 'Customer', flex: 0.3, minWidth: 100 },
    {
      field: 'actions', sortable: false, filter: false, headerName: 'Actions', flex: 0.3, minWidth: 100,
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
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [rows, setRows] = useState([]);
  const [type, setType] = useState('flow');
  const handleAddClick = () => {
    setOpenAdd(true);
  };



  const handleUpdateClick = (row) => {
    setRows(row);
    setOpenUpdate(true);
  }
  const handleDeleteClick = (id) => {
    WebSocketManager.sendMessage({path: 'data', type: 'delete', table: 'flow_data',id:`${id}`});
    setLoad(true);
  };
  return (
    <div>
      <Paper>
        <AddModal Open={openAdd} setOpen={setOpenAdd} setLoad={setLoad} rows={selectedTestCase} type={type} />
        <UpdatesModal rows={rows} open={openUpdate} setOpen={setOpenUpdate} type={type} setLoad={setLoad} />
        <DataGrid
          columns={columns}
          rows={flowData}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 100]}
          slots={{
            toolbar: () => <CustomToolbar handleAddClick={handleAddClick} />, // Pass handleAddClick to CustomToolbar
          }}
        />
      </Paper>
    </div>
  );
};

const ComponentFlow = ({ SelectedComponent, componentData, paginationModel1, setPaginationModel1, setLoad }) => {
  const columns = [
    { field: "id", headerName: 'Id', flex: 0.3, minWidth: 100 },
    { field: "component_name", headerName: 'Name', flex: 1, minWidth: 150 },
    { field: "Cammand", headerName: 'Command', flex: 0.3, minWidth: 100 },
    { field: "Description", headerName: 'Description', flex: 0.3, minWidth: 100 },
    { field: "object_name", headerName: 'Target', flex: 0.3, minWidth: 100 },
    { field: "Value", headerName: 'Value', flex: 0.3, minWidth: 100 },
    { field: "steps", headerName: 'Step No', flex: 0.3, minWidth: 90 },
    {
      field: 'actions', sortable: false, filter: false, headerName: 'Actions', flex: 0.3, minWidth: 100,
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
  const [openAdd, setOpenAdd] = useState(false);
  const [rows, setRows] = useState([]);
  const [type, setType] = useState('Component');
  const handleAddClick = () => {
    setOpenAdd(true);
  };
  const [openUpdate, setOpenUpdate] = useState(false);
  const handleUpdateClick = (row) => {
    setRows(row);
    setOpenUpdate(true);
  };
  const handleDeleteClick = (id) => {
    WebSocketManager.sendMessage({path: 'data', type: 'delete', table: 'comp_data',id:`${id}`});
    setLoad(true);
  };

  return (
    <div>
      <AddModal Open={openAdd} setOpen={setOpenAdd} setLoad={setLoad} type={type} rows={SelectedComponent} />
      <UpdatesModal rows={rows} open={openUpdate} setOpen={setOpenUpdate} type={type} setLoad={setLoad} />
      <Paper>
        <DataGrid
          columns={columns}
          rows={componentData}
          paginationModel={paginationModel1}
          onPaginationModelChange={setPaginationModel1}
          pageSizeOptions={[5, 10, 25, 100]}
          slots={{
            toolbar: () => <CustomToolbar handleAddClick={handleAddClick} />, // Pass handleAddClick to CustomToolbar
          }}
        />
      </Paper>
    </div>
  );
};
const Flow = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [Load, setLoad] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [flowData, setFlowData] = useState([]);
  const [componentList, setComponentList] = useState([]);
  const [componentData, setComponentData] = useState([]);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [SelectedComponent, setSelectedComponent] = useState(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [paginationModel1, setPaginationModel1] = useState({ page: 0, pageSize: 5 });
  useEffect(() => {
    WebSocketManager.sendMessage({ path: 'data', type: 'list', table: 'testcase' });
  }, []);
  const subscriptions = [
    { condition: data => data[0]?.hasOwnProperty('Modules_id'), stateSetter: setTestCases },
    { condition: data => data[0]?.hasOwnProperty('flow'), stateSetter: setFlowData },
    { condition: data => data[0]?.hasOwnProperty('Cammand'), stateSetter: setComponentData },
  ];

  const data = useWebSocketData(subscriptions, Load, setLoad);

  useEffect(() => {
    if (selectedTestCase) {
      WebSocketManager.sendMessage({
        path: 'data',
        type: 'find',
        table: 'flow_data_view',
        whereCondition: 'Test_Case = ?',
        whereValues: [selectedTestCase.Test_Case],
        columns: [],
      });
    }
  }, [selectedTestCase, Load]);

  useEffect(() => {
    if (SelectedComponent) {
      WebSocketManager.sendMessage({
        path: 'data',
        type: 'find',
        table: 'comp_data_view',
        whereCondition: 'comp_id = ?',
        whereValues: [SelectedComponent.id],
        columns: [],
      });
    }
  }, [Load, SelectedComponent]);

  useEffect(() => {
    if (selectedTestCase?.id && flowData.length > 0) {
      const filteredComponents = flowData
        .filter(f => f.testcase_id === selectedTestCase.id)
        .map(f => ({ id: f.comp_id, component_name: f.component_name }));
      setComponentList(filteredComponents);
      setSelectedComponent(filteredComponents[0]);
    }
  }, [flowData, selectedTestCase,]);


  const handleSelectionChange = (event, newValue) => {
    setSelectedTestCase(newValue);
  };

  const handleSelectionCompChange = (event, newValue) => {
    setSelectedComponent(newValue);
  };

  return (
    <Container>
      <Typography variant="h6">Flow Data</Typography>
      <FormControl variant="outlined" fullWidth>
        <Autocomplete
          options={testCases}
          getOptionLabel={(option) => option?.Test_Case}
          onChange={handleSelectionChange}
          renderInput={(params) => <TextField {...params} label="Select Your Test Case" />}
        />
      </FormControl>
      <TestFlow
        setLoad={setLoad}
        selectedTestCase={selectedTestCase}
        testCases={testCases}
        flowData={flowData}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}

      />
      <Typography variant="h6">Component Data</Typography>
      <FormControl variant="outlined" fullWidth>
        <Autocomplete
          value={SelectedComponent}
          options={componentList}
          getOptionLabel={(option) => option?.component_name}
          onChange={handleSelectionCompChange}
          renderInput={(params) => <TextField {...params} label="Select Components" />}
        />
      </FormControl>

      <ComponentFlow
        setLoad={setLoad}
        SelectedComponent={SelectedComponent}
        componentList={componentList}
        componentData={componentData}
        paginationModel1={paginationModel1}
        setPaginationModel1={setPaginationModel1}
      />
    </Container>
  );
};
export default Flow;
const AddModal = ({ Open, setOpen, rows, setLoad, type }) => {

  const [testCases, setTestCases] = useState([]);
  const [components, setComponents] = useState([]);
  const [objects, setObjects] = useState([]);
  const [commands, setCommands] = useState([]);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [stageNo, setStageNo] = useState('');
  const [stepNo, setStepNo] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [customerName, setCustomerName] = useState('A');
  useEffect(() => {
    WebSocketManager.sendMessage({ path: 'data', type: 'list', table: 'testcase' });
    WebSocketManager.sendMessage({ path: 'data', type: 'list', table: 'comp' });
    WebSocketManager.sendMessage({ path: 'data', type: 'list', table: 'object_repo' });
    WebSocketManager.sendMessage({ path: 'data', type: 'list', table: 'cammand' });
  }, [Open]);
  useEffect(() => {
    const handleWebSocketData = (data) => {
      if (Array.isArray(data)) {
        switch (true) {
          case data[0]?.hasOwnProperty('Modules_id'):
            setTestCases(data);
            break;
          case data[0]?.hasOwnProperty('component_name') && !data[0]?.hasOwnProperty("Test_Case"):
            setComponents(data);
            break;
          case data[0]?.hasOwnProperty('object_name') && !data[0]?.hasOwnProperty("Test_Case"):
            setObjects(data);
            break;
          case data[0]?.hasOwnProperty('cammand') && !data[0]?.hasOwnProperty("Test_Case"):
            setCommands(data);
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
    if (type === 'Component') {
      setSelectedComponent(components.find(comp => comp?.component_name === rows?.component_name) || null);
         }
    else if (type === 'flow') {
      setSelectedTestCase(testCases.find(testCase => testCase?.Test_Case === rows?.Test_Case) || null);
    }
  }, [rows,type]);
  const handleSubmit = (event) => {
    event.preventDefault();

    if (type === 'flow') {

      WebSocketManager.sendMessage({
        path: 'data',
        type: 'insert',
        table: 'flow_data',
        columns: ['Scenrio_id', 'comp_id', 'Steps_order', 'Customer'],
        values: [selectedTestCase.id, selectedComponent.id, stageNo, customerName],
      });
      const handleWebSocketData = (data) => {
        if (data?.status == "inserted" && data?.tableName == "flow_data") {
          setOpen(false);
          setLoad(true);
        }
      };
      WebSocketManager.subscribe(handleWebSocketData);
      return () => WebSocketManager.unsubscribe(handleWebSocketData);

    }
    else if (type === 'Component') {
      WebSocketManager.sendMessage({
        path: 'data',
        type: 'insert',
        table: 'comp_data',
        columns: ['comp_id', 'Target', 'Cammand', 'steps', 'Description', 'Value'],
        values: [selectedComponent.id, selectedObject.id, selectedCommand.id, stepNo, description, value],
      });
      const handleWebSocketData = (data) => {
        if (data?.status == "inserted" && data?.tableName == "comp_data") {
          setOpen(false);
          setLoad(true);
        }
      };
      WebSocketManager.subscribe(handleWebSocketData);
      return () => WebSocketManager.unsubscribe(handleWebSocketData);
    }
  };
  return (
    <div>
      <Modal open={Open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box component="form" sx={style} onSubmit={handleSubmit}>
          <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">{type} Data</Typography>
          {type === 'flow' && (
            <>
              <FormControl variant="outlined" fullWidth>
                <Autocomplete
                  value={selectedTestCase}
                  options={testCases}
                  getOptionLabel={(option) => option?.Test_Case || ""}
                  onChange={(event, newValue) => setSelectedTestCase(newValue)}
                  renderInput={(params) => <TextField {...params} label="Test Case Name" variant="outlined" />}

                />
              </FormControl>
              <TextField fullWidth label="Stage No" variant="outlined" value={stageNo} onChange={(e) => setStageNo(e.target.value)} />
              <TextField fullWidth label="Customer (Default is A)" variant="outlined" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </>
          )}


          <FormControl variant="outlined" fullWidth>
            <Autocomplete
            value={selectedComponent}
              options={components}
              getOptionLabel={(option) => option?.component_name || ""}
              onChange={(event, newValue) => setSelectedComponent(newValue)}
              renderInput={(params) => <TextField {...params} label="Component Name" variant="outlined" />}

            />
          </FormControl>

          {type === 'Component' && (
            <>
              <FormControl variant="outlined" fullWidth>
                <Autocomplete
                  options={objects}
                  getOptionLabel={(option) => option?.object_name || ""}
                  onChange={(event, newValue) => setSelectedObject(newValue)}
                  renderInput={(params) => <TextField {...params} label="Objects" variant="outlined" />}
                />
              </FormControl>
              <FormControl variant="outlined" fullWidth>
                <Autocomplete
                  options={commands}
                  getOptionLabel={(option) => option?.cammand || ""}
                  onChange={(event, newValue) => setSelectedCommand(newValue)}
                  renderInput={(params) => <TextField {...params} label="Command" variant="outlined" />}
                />
              </FormControl>
              <TextField fullWidth label="Step No" variant="outlined" value={stepNo} onChange={(e) => setStepNo(e.target.value)} />
              <TextField fullWidth label="Description" variant="outlined" multiline rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
              <TextField fullWidth label="Value" variant="outlined" value={value} onChange={(e) => setValue(e.target.value)} />
            </>
          )}


          <Button startIcon={<SaveIcon />} variant="contained" color="secondary" type="submit">Submit</Button>
        </Box>
      </Modal>
    </div>
  );
};

const UpdatesModal = ({ rows, open, setOpen, setLoad, type }) => {
  const [testCases, setTestCases] = useState([]);
  const [components, setComponents] = useState([]);
  const [objects, setObjects] = useState([]);
  const [commands, setCommands] = useState([]);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [stageNo, setStageNo] = useState('');
  const [stepNo, setStepNo] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [customerName, setCustomerName] = useState('A');
  useEffect(() => {
    WebSocketManager.sendMessage({ path: 'data', type: 'list', table: 'testcase' });
    WebSocketManager.sendMessage({ path: 'data', type: 'list', table: 'comp' });
    WebSocketManager.sendMessage({ path: 'data', type: 'list', table: 'object_repo' });
    WebSocketManager.sendMessage({ path: 'data', type: 'list', table: 'cammand' });
  }, [rows]);

  useEffect(() => {
    const handleWebSocketData = (data) => {
      if (Array.isArray(data)) {
        switch (true) {
          case data[0]?.hasOwnProperty('Modules_id'):
            setTestCases(data);
            break;
          case data[0]?.hasOwnProperty('component_name') && !data[0]?.hasOwnProperty("Test_Case"):
            setComponents(data);
            break;
          case data[0]?.hasOwnProperty('object_name') && !data[0]?.hasOwnProperty("Test_Case"):
            setObjects(data);
            break;
          case data[0]?.hasOwnProperty('cammand') && !data[0]?.hasOwnProperty("Test_Case"):
            setCommands(data);
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
    if (type === 'Component') {
      setSelectedComponent(components.find(comp => comp?.component_name === rows?.component_name) || null);
      setSelectedObject(objects.find(object => object?.object_name === rows?.object_name) || null);
      setSelectedCommand(commands.find(command => command?.cammand === rows?.Cammand) || null);
      setDescription(rows?.Description || '');
      setValue(rows?.Value || '');
      setStepNo(rows?.steps || '');
    }
    else if (type === 'flow') {
      setSelectedTestCase(testCases.find(testCase => testCase?.Test_Case === rows?.Test_Case) || null);
      setSelectedComponent(components.find(comp => comp?.component_name === rows?.component_name) || null);
      setStageNo(rows?.flow || '');
      setCustomerName(rows?.Customer || 'A');
    }
  }, [rows, testCases, components, objects, commands]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (type === 'flow') {
      WebSocketManager.sendMessage({
        path: 'data',
        type: 'update',
        table: 'flow_data',
        whereCondition: "id=?",
        whereValues: [rows?.id],
        columns: ['Scenrio_id', 'comp_id', 'Steps_order', 'Customer'],
        values: [selectedTestCase?.id, selectedComponent?.id, stageNo, customerName],
      });
      const handleWebSocketData = (data) => {
        if (data?.status == "updated" && data?.tableName == "flow_data") {
          setOpen(false);
          setLoad(true);
        }
      }
      WebSocketManager.subscribe(handleWebSocketData);
      return () => WebSocketManager.unsubscribe(handleWebSocketData);
    }

    if (type === 'Component') {
      WebSocketManager.sendMessage({
        path: 'data',
        type: 'update',
        table: 'comp_data',
        whereCondition: "id=?",
        whereValues: [rows?.id],
        columns: ['comp_id', 'Cammand', 'Target', 'Description', 'Value', 'steps'],
        values: [selectedComponent?.id, selectedCommand?.id, selectedObject?.id, description, value, stepNo],
      });
      const handleWebSocketData = (data) => {
        if (data?.status == "updated" && data?.tableName == "comp_data") {

          setOpen(false);
          setLoad(true);


        }
      }
      WebSocketManager.subscribe(handleWebSocketData);
      return () => WebSocketManager.unsubscribe(handleWebSocketData);
    };

  };

  return (
    <div>
      <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box component="form" sx={style} onSubmit={handleSubmit}>
          <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Test Case Data</Typography>
          {type === 'flow' && (
            <>
              <FormControl variant="outlined" fullWidth>
                <Autocomplete
                  value={selectedTestCase}
                  options={testCases}
                  getOptionLabel={(option) => option?.Test_Case || ""}
                  onChange={(event, newValue) => setSelectedTestCase(newValue)}
                  renderInput={(params) => <TextField {...params} label="Test Case Name" variant="outlined" />}

                />
              </FormControl>
              <TextField fullWidth label="Stage No" variant="outlined" value={stageNo} onChange={(e) => setStageNo(e.target.value)} />
              <TextField fullWidth label="Customer (Default is A)" variant="outlined" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </>
          )}


          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={selectedComponent}
              options={components}
              getOptionLabel={(option) => option?.component_name || ""}
              onChange={(event, newValue) => setSelectedComponent(newValue)}
              renderInput={(params) => <TextField {...params} label="Component Name" variant="outlined" />}

            />
          </FormControl>

          {type === 'Component' && (
            <>
              <FormControl variant="outlined" fullWidth>
                <Autocomplete
                  value={selectedObject}
                  options={objects}
                  getOptionLabel={(option) => option?.object_name || ""}
                  onChange={(event, newValue) => setSelectedObject(newValue)}
                  renderInput={(params) => <TextField {...params} label="Objects" variant="outlined" />}
                />
              </FormControl>
              <FormControl variant="outlined" fullWidth>
                <Autocomplete
                  value={selectedCommand}
                  options={commands}
                  getOptionLabel={(option) => option?.cammand || ""}
                  onChange={(event, newValue) => setSelectedCommand(newValue)}
                  renderInput={(params) => <TextField {...params} label="Command" variant="outlined" />}
                />
              </FormControl>
              <TextField fullWidth label="Step No" variant="outlined" value={stepNo} onChange={(e) => setStepNo(e.target.value)} />
              <TextField fullWidth label="Description" variant="outlined" multiline rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
              <TextField fullWidth label="Value" variant="outlined" value={value} onChange={(e) => setValue(e.target.value)} />
            </>
          )}


          <Button startIcon={<SaveIcon />} variant="contained" color="secondary" type="submit">Submit</Button>
        </Box>
      </Modal>
    </div>
  );
};
