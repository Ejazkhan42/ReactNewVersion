
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


function Types() {
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [lodding, setLodding] = useState(false);
    const [flowData, setFlowData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [deleteId, setDeleteId] = useState(null)
    useEffect(() => {
        const handleWebSocketData = (data) => {
            if (Array.isArray(data) && data[0]?.type && !data[0]?.Test_Case) {
                setFlowData(data);
                setTotalFetchedRows(data.length);
            }
            setLodding(false);
        };

        WebSocketManager.subscribe(handleWebSocketData);
        WebSocketManager.sendMessage({ path: "data", type: "list", table: "object_types" });

        return () => WebSocketManager.unsubscribe(handleWebSocketData);
    }, [openAdd, openUpdate, lodding]);

    const handleUpdateClick = (row) => {
        setSelectedRow(row);

        setOpenUpdate(true);
    };
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        
    };
    const handleDeleteConfirm = () => {
    
        WebSocketManager.sendMessage({ path: 'data', type: 'delete', table: 'object_types', id: `${deleteId}` });
        setLodding(true);
        setDeleteId(null);

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
            field: "type",
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
                        Are you sure you want to delete this Types?
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
export default Types

const AddModal = ({ Open, setOpen }) => {

    const [object_type, setobject_type] = useState('');
    const [Description, setDescription] = useState('');

    const handleOpen = () => {
        setOpen(true);
    };



    const handleSubmit = (event) => {
        event.preventDefault();
        WebSocketManager.sendMessage({
            path: 'data',
            type: 'insert',
            table: 'object_types',
            columns: ['type', 'description'],
            values: [object_type, Description],
        });

        const handleWebSocketData = (data) => {
            if (data?.status == "inserted" && data?.tableName == "object_types") {
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
                    <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Add New Type</Typography>
                    <TextField fullWidth label="Types" variant="outlined" value={object_type} onChange={(e) => setobject_type(e.target.value)} />
                    <TextField fullWidth label="Description" variant="outlined" value={Description} onChange={(e) => setDescription(e.target.value)} />
                    <Button variant="contained" color="secondary" type="submit">Submit</Button>
                </Box>
            </Modal>
        </div>
    );
};

const UpdatesModal = ({ rows, Open, setOpen }) => {
    const [type_name, settype_name] = useState('');
    const [Description, setDescription] = useState('');
    const [object_type, setobject_type] = useState([])


   useEffect(() => {
        setobject_type(rows || null);
        settype_name(rows?.type || '')
        setDescription(rows?.description || '')
    }, [rows]);

    const handleSubmit = (event) => {
        event.preventDefault();
        WebSocketManager.sendMessage({
            path: 'data',
            type: 'update',
            table: 'object_types',
            whereCondition: "id=?",
            whereValues: [object_type.id],
            columns: ['type', 'description'],
            values: [type_name, Description],
        });

        const handleWebSocketData = (data) => {
            if (data?.status == "updated" && data?.tableName == "object_types") {
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
                    <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Update Types</Typography>
                    <TextField fullWidth label="Type Name" variant="outlined" value={type_name} onChange={(e) => settype_name(e.target.value)} />
                    <TextField fullWidth label="Description" variant="outlined" value={Description} onChange={(e) => setDescription(e.target.value)} />
                    <Button variant="contained" color="secondary" type="submit">Submit</Button>
                </Box>
            </Modal>
        </div>
    );
};
