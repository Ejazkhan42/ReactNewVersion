
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


function Componenets() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [lodding, setLodding] = useState(false);
  const [flowData, setFlowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const handleWebSocketData = (data) => {
      if (Array.isArray(data) && data[0]?.component_name && !data[0]?.Test_Case) {
        setFlowData(data);
        setTotalFetchedRows(data.length);
      }
      setLodding(false);
    };

    WebSocketManager.subscribe(handleWebSocketData);
    WebSocketManager.sendMessage({ path: "data", type: "list", table: "comp" });

    return () => WebSocketManager.unsubscribe(handleWebSocketData);
  }, [openAdd,openUpdate,lodding]);

  const handleUpdateClick = (row) => {
    setSelectedRow(row);

    setOpenUpdate(true);
  };
  const handleDeleteClick = (id) => {
    WebSocketManager.sendMessage({path: 'data', type: 'delete', table: 'comp',id:`${id}`});
    setLodding(true);
  };
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
      field: "component_name",
      headerName: 'Name',
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
<AddModal Open={openAdd} setOpen={setOpenAdd} />
<UpdatesModal Open={openUpdate} setOpen={setOpenUpdate} rows={selectedRow} />
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
    </Container>
  );
};
export default Componenets

const AddModal = ({Open,setOpen}) => {
  
  const [component_name, setcomponent_name] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };



  const handleSubmit = (event) => {
    event.preventDefault();
    WebSocketManager.sendMessage({
      path: 'data',
      type: 'insert',
      table: 'comp',
      columns: ['component_name'],
      values: [component_name],
    });

    const handleWebSocketData = (data) => {
      if (data?.status== "inserted" && data?.tableName == "comp") {
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
          <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Add New Component</Typography>
          <TextField fullWidth label="Component Name" variant="outlined" value={component_name} onChange={(e) => setcomponent_name(e.target.value)} />
          <Button variant="contained" color="secondary" type="submit">Submit</Button>
        </Box>
      </Modal>
    </div>
  );
};

const UpdatesModal = ({ rows, Open, setOpen }) => {
  const [component_name, setcomponent_name] = useState('');
  const [comp, setcomp] = useState([])
 
 
  useEffect(() => {
    setcomp(rows || null);
    setcomponent_name(rows?.component_name || '')
  }, [rows]);

  const handleSubmit = (event) => {
    event.preventDefault();
    WebSocketManager.sendMessage({
      path: 'data',
      type: 'update',
      table: 'comp',
      whereCondition: "id=?",
      whereValues: [comp.id],
      columns: ['component_name'],
      values: [component_name],
    });

    const handleWebSocketData = (data) => {
      if (data?.status== "updated" && data?.tableName == "comp" ) {
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
          <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Update Component</Typography>
          <TextField fullWidth label="Component Name" variant="outlined" value={component_name} onChange={(e) => setcomponent_name(e.target.value)} />
          <Button variant="contained" color="secondary" type="submit">Submit</Button>
        </Box>
      </Modal>
    </div>
  );
};