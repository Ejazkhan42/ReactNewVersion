
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


function Cammands() {
  const token = sessionStorage.getItem('token');
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [lodding, setLodding] = useState(false);
  const [cammandData, setcammandData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteId, setDeleteId] = useState(null)
  useEffect(() => {
    const handleWebSocketData = (data) => {
      if (Array.isArray(data) && data[0]?.cammand && !data[0]?.Test_Case) {
        setcammandData(data);
        setTotalFetchedRows(data.length);
      }
      setLodding(false);
    };

    WebSocketManager.subscribe(handleWebSocketData);
    WebSocketManager.sendMessage({ token: token, path: "data", type: "list", table: "cammand" });

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
    WebSocketManager.sendMessage({ token: token, path: 'data', type: 'delete', table: 'cammand', id: `${deleteId}` });
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
      // resizable: false,
      minWidth: 100,
    },
    {
      field: "cammand",
      headerName: 'Name',
      flex: 1,
      // resizable: false,
      minWidth: 150,
    },
    {
      field: "description",
      headerName: 'Description',
      flex: 1,
      // resizable: false,
      minWidth: 150,
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
      <UpdatesModal Open={openUpdate} setOpen={setOpenUpdate} rows={selectedRow} token={token} />
      <Paper color="primary"
        variant="outlined"
        shape="rounded" sx={{ height: 410, width: '100%' }}>
        <DataGrid
          columns={columns}
          rows={cammandData}
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
            Are you sure you want to delete this Command?
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
export default Cammands

const AddModal = ({ Open, setOpen, token }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [cammand_name, setcammand_name] = useState('');
  const [Description, setDescription] = useState('');


  const handleSubmit = (event) => {
    event.preventDefault();
    WebSocketManager.sendMessage({
      token: token,
      path: 'data',
      type: 'insert',
      table: 'cammand',
      columns: ['cammand', 'description'],
      values: [cammand_name, Description],
    });

    const handleWebSocketData = (data) => {
      if (data?.status == "inserted" && data?.tableName == "cammand") {
        setSnackbar({ open: true, message: "Cammand Added Successfully", severity: "success" });
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
          <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Add New Cammmand</Typography>
          <TextField fullWidth label="Cammand Name" variant="outlined" value={cammand_name} onChange={(e) => setcammand_name(e.target.value)} />
          <TextField fullWidth label="Description" variant="outlined" value={Description} onChange={(e) => setDescription(e.target.value)} />
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

const UpdatesModal = ({ rows, Open, setOpen, token }) => {
  const [cammand_name, setcammand_name] = useState('');
  const [Description, setDescription] = useState('');
  const [cammand, setcammand] = useState([])
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });


  useEffect(() => {
    setcammand(rows || null);
    setcammand_name(rows?.cammand || '')
    setDescription(rows?.description || '')
  }, [rows]);

  const handleSubmit = (event) => {
    event.preventDefault();
    WebSocketManager.sendMessage({
      token: token,
      path: 'data',
      type: 'update',
      table: 'cammand',
      whereCondition: "id=?",
      whereValues: [cammand.id],
      columns: ['cammand', 'description'],
      values: [cammand_name, Description],
    });

    const handleWebSocketData = (data) => {
      if (data?.status == "updated" && data?.tableName == "cammand") {
        setSnackbar({ open: true, message: "Cammand Updated Successfully", severity: "success" });
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
          <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Update Cammand</Typography>
          <TextField fullWidth label="Cammand Name" variant="outlined" value={cammand_name} onChange={(e) => setcammand_name(e.target.value)} />
          <TextField fullWidth label="Description" variant="outlined" value={Description} onChange={(e) => setDescription(e.target.value)} />
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
