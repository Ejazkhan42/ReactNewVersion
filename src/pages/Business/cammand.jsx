
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Modal,
  TextField,
  Typography,
  Button,
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


function Cammands() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [lodding, setLodding] = useState(false);
  const [cammandData, setcammandData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const handleWebSocketData = (data) => {
      if (Array.isArray(data) && data[0]?.cammand && !data[0]?.Test_Case) {
        setcammandData(data);
        setTotalFetchedRows(data.length);
      }
      setLodding(false);
    };

    WebSocketManager.subscribe(handleWebSocketData);
    WebSocketManager.sendMessage({ path: "data", type: "list", table: "cammand" });

    return () => WebSocketManager.unsubscribe(handleWebSocketData);
  }, [openAdd,openUpdate,lodding]);

  const handleUpdateClick = (row) => {
    setSelectedRow(row);

    setOpenUpdate(true);
  };
  const handleDeleteClick = (id) => {
    WebSocketManager.sendMessage({path: 'data', type: 'delete', table: 'cammand',id:`${id}`});
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
<AddModal Open={openAdd} setOpen={setOpenAdd} />
<UpdatesModal Open={openUpdate} setOpen={setOpenUpdate} rows={selectedRow} />
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
    </Container>
  );
};
export default Cammands

const AddModal = ({Open,setOpen}) => {
  
  const [cammand_name, setcammand_name] = useState('');
  const [Description,setDescription] = useState('');


  const handleSubmit = (event) => {
    event.preventDefault();
    WebSocketManager.sendMessage({
      path: 'data',
      type: 'insert',
      table: 'cammand',
      columns: ['cammand','description'],
      values: [cammand_name,Description],
    });

    const handleWebSocketData = (data) => {
      if (data?.status== "inserted" && data?.tableName == "cammand") {
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
    </div>
  );
};

const UpdatesModal = ({ rows, Open, setOpen }) => {
  const [cammand_name, setcammand_name] = useState('');
  const [Description,setDescription] = useState('');
  const [cammand, setcammand] = useState([])



  useEffect(() => {
    setcammand(rows || null);
    setcammand_name(rows?.cammand || '')
    setDescription(rows?.description || '')
  }, [rows]);

  const handleSubmit = (event) => {
    event.preventDefault();
    WebSocketManager.sendMessage({
      path: 'data',
      type: 'update',
      table: 'cammand',
      whereCondition: "id=?",
      whereValues: [cammand.id],
      columns: ['cammand','description'],
      values: [cammand_name,Description],
    });

    const handleWebSocketData = (data) => {
      if (data?.status== "updated" && data?.tableName == "cammand" ) {
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
    </div>
  );
};
