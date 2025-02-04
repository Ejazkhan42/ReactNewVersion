
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
  Snackbar,
  Alert,
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
function Objects() {
  const token = sessionStorage.getItem('token');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [lodding, setLodding] = useState(false);
  const [object_types, setobject_types] = useState([]);
  const [flowData, setFlowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [deleteId, setDeleteId] = useState(null)
  useEffect(() => {
    const handleWebSocketData = (data) => {
      if (Array.isArray(data) && data[0]?.hasOwnProperty('object_name')) {
        setFlowData(data);
        setTotalFetchedRows(data.length)

      }
      else if (Array.isArray(data) && data[0]?.hasOwnProperty("type")) {
        setobject_types(data)
      }
      setLodding(false);
    };
    WebSocketManager.subscribe(handleWebSocketData);
    WebSocketManager.sendMessage({ token: token, path: "data", type: "list", table: "object_repo" });
    WebSocketManager.sendMessage({ token: token, path: "data", type: "list", table: "object_types" });
    return () => WebSocketManager.unsubscribe(handleWebSocketData);
  }, [openUpdate, openAdd, lodding]);




  const handleUpdateClick = (row) => {
    setSelectedRow(row);
    setOpenUpdate(true);

  };
  const handleAddClick = () => {
    setOpenAdd(true);
  };
  const handleDeleteClick = (id) => {

    setDeleteId(id)
  };
  const handleDeleteConfirm = () => {
    WebSocketManager.sendMessage({ token: token, path: 'data', type: 'delete', table: 'object_repo', id: `${deleteId}` });
    const handleWebSocketData = (data) => {
      if (data?.status == "deleted" && data?.tableName == "object_repo") {
        setSnackbar({ open: true, message: "Object deleted successfully", severity: "success" });
        setLodding(true);
        setDeleteId(null)

      }

    }
    WebSocketManager.subscribe(handleWebSocketData);
    return () => WebSocketManager.unsubscribe(handleWebSocketData);
  }

  const columns = [
    {
      field: "id",
      headerName: 'Id',
      flex: 0.3,
      // resizable: false,
      minWidth: 100,
    },
    {
      field: "object_name",
      headerName: 'Name',
      flex: 1,
      // resizable: false,
      minWidth: 150,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 170,
      valueGetter: (value, row) => object_types.find((type) => type.id === row.object_type_id)?.type || 'Unknown',
    },

    {
      field: "object_value",
      headerName: 'Value',
      flex: 0.3,
      // resizable: false,
      minWidth: 150,
    },

    {
      field: "object_page",
      headerName: 'Page',
      flex: 0.3,
      // resizable: false,
      minWidth: 120,
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
      <AddModal Open={openAdd} setOpen={setOpenAdd} token={token} />
      <UpdatesModal open={openUpdate} setOpen={setOpenUpdate} rows={selectedRow} token={token} />
      <Paper color="primary"
        variant="outlined"
        shape="rounded" sx={{ height: 410, width: '100%' }}>
        <DataGrid
          columns={columns}
          rows={flowData}
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
            Are you sure you want to delete this Objects?
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Objects

const AddModal = ({ Open, setOpen, token }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [Object_types, setObject_types] = useState([]);
  const [Objects_name, setObjects_name] = useState('');
  const [Objects_value, setObjects_value] = useState('');
  const [Selectedobject_types, setSelectedobject_types] = useState(null);
  const [PageName, setPageName] = useState('');

  useEffect(() => {
    WebSocketManager.sendMessage({ path: 'data', type: 'list', table: 'object_types' });
    const handleWebSocketData = (data) => {
      if (Array.isArray(data)) {
        switch (true) {
          case data[0]?.hasOwnProperty('type'):
            setObject_types(data);
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

    if (!Objects_name || !Selectedobject_types) {
      setSnackbar({ open: true, message: "Please fill in all fields", severity: "error" });
      return;
    }

    WebSocketManager.sendMessage({
      token: token,
      path: 'data',
      type: 'insert',
      table: 'object_repo',
      columns: ['object_name', 'object_value', 'object_page', 'object_type_id'],
      values: [Objects_name, Objects_value, PageName, Selectedobject_types.id],
    });
    const handleWebSocketData = (data) => {
      if (data?.status == "inserted" && data.tableName == "object_repo") {
        setSnackbar({ open: true, message: "Object added successfully", severity: "success" });
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
          <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Add New Object</Typography>
          <TextField fullWidth label="Object Name" variant="outlined" value={Objects_name} onChange={(e) => setObjects_name(e.target.value)} />

          <FormControl variant="outlined" fullWidth>
            <Autocomplete

              options={Object_types}
              getOptionLabel={(option) => option?.type}
              onChange={(event, newValue) => setSelectedobject_types(newValue)}
              renderInput={(params) => <TextField {...params} label="Type" variant="outlined" />}

            />
          </FormControl>
          <TextField fullWidth label="Object Value" variant="outlined" value={Objects_value} onChange={(e) => setObjects_value(e.target.value)} />
          <TextField fullWidth label="Page name" variant="outlined" value={PageName} onChange={(e) => setPageName(e.target.value)} />
          <Button variant="contained" color="secondary" type="submit">Submit</Button>
        </Box>
      </Modal>
      <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

const UpdatesModal = ({ rows, open, setOpen, token }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [Object_types, setObject_types] = useState([]);
  const [Objects_name, setObjects_name] = useState('');
  const [Objects_value, setObjects_value] = useState('');
  const [Selectedobject_types, setSelectedobject_types] = useState(null);
  const [PageName, setPageName] = useState('');

  useEffect(() => {
    WebSocketManager.sendMessage({ path: 'data', type: 'list', table: 'object_types' });
  }, []);

  useEffect(() => {
    const handleWebSocketData = (data) => {
      if (Array.isArray(data)) {
        switch (true) {
          case data[0]?.hasOwnProperty('type'):
            setObject_types(data);
          default:
            break;
        }
      }
    };
    WebSocketManager.subscribe(handleWebSocketData);
    return () => WebSocketManager.unsubscribe(handleWebSocketData);
  }, []);

  useEffect(() => {
    setObjects_name(rows.object_name || null);
    setObjects_value(rows.object_value || null);
    setPageName(rows.object_page || null);
    setSelectedobject_types(Object_types.find((type) => type.id === rows.object_type_id) || 'null');
  }, [rows, Object_types]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!Objects_name || !Selectedobject_types) {
      alert('Please fill in all fields.');
      return;
    }

    WebSocketManager.sendMessage({
      token: token,
      path: 'data',
      type: 'update',
      table: 'object_repo',
      whereCondition: "id=?",
      whereValues: [rows.id],
      columns: ['object_name', 'object_value', 'object_page', 'object_type_id'],
      values: [Objects_name, Objects_value, PageName, Selectedobject_types.id],
    });
    const handleWebSocketData = (data) => {
      if (data?.status == "updated" && data?.tableName == "object_repo") {
        setSnackbar({ open: true, message: "Object updated successfully", severity: "success" });
        setOpen(false);
      }
    }
    WebSocketManager.subscribe(handleWebSocketData);
    return () => WebSocketManager.unsubscribe(handleWebSocketData);
  };

  return (
    <div>
      <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box component="form" variant="outlined" sx={style} onSubmit={handleSubmit}>
          <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Update Object</Typography>
          <TextField fullWidth label="Object Name" variant="outlined" value={Objects_name} onChange={(e) => setObjects_name(e.target.value)} />

          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              value={Selectedobject_types}
              options={Object_types}
              getOptionLabel={(option) => option?.type}
              onChange={(event, newValue) => setSelectedobject_types(newValue)}
              renderInput={(params) => <TextField {...params} label="Type" variant="outlined" />}

            />
          </FormControl>
          <TextField fullWidth label="Object Value" variant="outlined" value={Objects_value} onChange={(e) => setObjects_value(e.target.value)} />
          <TextField fullWidth label="Page name" variant="outlined" value={PageName} onChange={(e) => setPageName(e.target.value)} />
          <Button variant="contained" color="secondary" type="submit">Submit</Button>
        </Box>
      </Modal>
      <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
