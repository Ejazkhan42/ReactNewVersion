
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

function Testcase() {
  const [openAdd, setOpenAdd] = useState(false);
  const [lodding, setLodding] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [Testcase, setTestcase] = useState([]);
  const [Modules, setModules] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
const [deleteId, setDeleteId] = useState(null)
  useEffect(() => {
    const handleWebSocketData = (data) => {
      if (Array.isArray(data) && data[0]?.Modules_id && data[0]?.Test_Case) {
        setTestcase(data);
        setTotalFetchedRows(data.length);
      } else if (Array.isArray(data) && data[0]?.name && !data[0]?.Test_Case) {
        setModules(data);
      }
      setLodding(false);
    };

    WebSocketManager.subscribe(handleWebSocketData);
    WebSocketManager.sendMessage({ path: "data", type: "list", table: "testcase" });
    WebSocketManager.sendMessage({ path: "data", type: "list", table: "modules" });

    return () => WebSocketManager.unsubscribe(handleWebSocketData);
  }, [openAdd, openUpdate,lodding]);

  const handleUpdateClick = (row) => {
    setSelectedRow(row);

    setOpenUpdate(true);
  };
  const handleDeleteClick = (id) => {
    setDeleteId(id)
  };
  const handleDeleteConfirm = () => {
    WebSocketManager.sendMessage({path: 'data', type: 'delete', table: 'testcase',id:`${deleteId}`});
    setLodding(true);
    setDeleteId(null)
  }
  const handleAddClick = () => {
    setOpenAdd(true);
  };

  const columns = [
    {
      field: "id",
      headerName: 'Id',
      flex: 0.3,
      resizable: false,
      minWidth: 100,
    },
    {
      field: "Test_Case",
      headerName: 'Name',
      flex: 1,
      resizable: false,
      minWidth: 150,
    },
    {
      field: "Description",
      headerName: 'Description',
      flex: 1,
      resizable: false,
      minWidth: 150,
    },
    {
      field: 'name',
      headerName: 'Module Name',
      width: 170,
      valueGetter: (value, row) => Modules.find((Module) => Module.id === row.Modules_id)?.name || 'Unknown',
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
      <AddModal open={openAdd} setOpen={setOpenAdd} />
      <UpdatesModal Open={openUpdate} setOpen={setOpenUpdate} rows={selectedRow} />
      <Paper color="primary"
        variant="outlined"
        shape="rounded" sx={{ height: 410, width: '100%' }}>
        <DataGrid
          columns={columns}
          rows={Testcase}
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
                  Are you sure you want to delete this Testcase?
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
export default Testcase

const AddModal = ({ open, setOpen }) => {
  const [TestcaseName, setTestcaseName] = useState('');
  const [description, setdescription] = useState('');
  const [SelectModules, setSelectModules] = useState(null);
  const [Modules, setModules] = useState([]);

  useEffect(() => {
    WebSocketManager.sendMessage({ path: 'data', type: 'list', table: 'modules' });

  }, []);

  useEffect(() => {
    const handleWebSocketData = (data) => {
      if (Array.isArray(data)) {
        switch (true) {
          case data[0]?.hasOwnProperty('name') && !data[0]?.hasOwnProperty("Test_Case"):
            setModules(data);
            break;
          default:
            break;
        }
      }
    };
    WebSocketManager.subscribe(handleWebSocketData);
    return () => WebSocketManager.unsubscribe(handleWebSocketData);
  }, []);
  


  const handleSubmit = (event) => {
    event.preventDefault();
    WebSocketManager.sendMessage({
      path: 'data',
      type: 'insert',
      table: 'testcase',
      columns: ['Test_Case', 'Description', 'Modules_id'],
      values: [TestcaseName, description, SelectModules.id],
    });


    setOpen(false);
  };

  return (
    <div>
    
      <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box component="form" sx={style} onSubmit={handleSubmit}>
          <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Add New Test Case</Typography>
          <TextField fullWidth label="Test Case Name" variant="outlined" value={TestcaseName} onChange={(e) => setTestcaseName(e.target.value)} />
          <TextField fullWidth label="Descrption" variant="outlined" value={description} onChange={(e) => setdescription(e.target.value)} />
          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={SelectModules}
              options={Modules}
              getOptionLabel={(option) => option?.name}
              onChange={(event, newValue) => setSelectModules(newValue)}
              renderInput={(params) => <TextField {...params} label="Module Name" variant="outlined" />}

            />
          </FormControl>
          <Button variant="contained" color="secondary" type="submit">Submit</Button>
        </Box>
      </Modal>
    </div>
  );
};

const UpdatesModal = ({ rows, Open, setOpen }) => {
  const [TestcaseName, setTestcaseName] = useState('');
  const [description, setdescription] = useState('');
  const [SelectModules, setSelectModules] = useState(null);
  const [Modules, setModules] = useState([]);
  const [Testcase_id, setTestcase_id] = useState([])
  useEffect(() => {
    WebSocketManager.sendMessage({ path: 'data', type: 'list', table: 'modules' });

  }, []);

  useEffect(() => {
    const handleWebSocketData = (data) => {
      if (Array.isArray(data)) {
        switch (true) {
          case data[0]?.hasOwnProperty('name') && !data[0]?.hasOwnProperty("Test_Case"):
            setModules(data);
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
    setTestcase_id(rows?.id || '')
    setTestcaseName(rows?.Test_Case || '')
    setdescription(rows?.Description || '')
    setSelectModules(Modules.find((Module) => Module.id === rows?.Modules_id) || null);
  }, [rows,Testcase_id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    WebSocketManager.sendMessage({
      path: 'data',
      type: 'update',
      table: 'testcase',
      whereCondition: "id=?",
      whereValues: [Testcase_id],
      columns: ['Test_Case', "Description", "Modules_id"],
      values: [TestcaseName, description, SelectModules.id],
    });
    const handleWebSocketData = (data) => {
      if (data?.status == "updated" && data?.tableName == "testcase") {

          setOpen(false);
        
      }
    }
    WebSocketManager.subscribe(handleWebSocketData);
    return () => WebSocketManager.unsubscribe(handleWebSocketData);

  };

  return (
    <div>
      <Modal open={Open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box component="form" sx={style} onSubmit={handleSubmit}>
          <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Update Test Case</Typography>
          <TextField fullWidth label="Test Case Name" variant="outlined" value={TestcaseName} onChange={(e) => setTestcaseName(e.target.value)} />
          <TextField fullWidth label="Descrption" variant="outlined" value={description} onChange={(e) => setdescription(e.target.value)} />
          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={SelectModules}
              options={Modules}
              getOptionLabel={(option) => option?.name}
              onChange={(event, newValue) => setSelectModules(newValue)}
              renderInput={(params) => <TextField {...params} label="Module Name" variant="outlined" />}

            />
          </FormControl>
          <Button variant="contained" color="secondary" type="submit">Submit</Button>
        </Box>
      </Modal>
    </div>
  );
};
