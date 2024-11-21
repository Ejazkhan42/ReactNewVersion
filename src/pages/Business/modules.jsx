
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


function Modules() {
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [lodding, setLodding] = useState(false);
    const [modulesData, setmodulesData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {
        const handleWebSocketData = (data) => {
            if (Array.isArray(data) && data[0]?.hasOwnProperty('jenkinsPath') && !data[0]?.hasOwnProperty('test_case')) {
                setmodulesData(data);
               }
            setLodding(false);
        };

        WebSocketManager.subscribe(handleWebSocketData);
        WebSocketManager.sendMessage({ path: "data", type: "list", table: "modules" });

        return () => WebSocketManager.unsubscribe(handleWebSocketData);
    }, [openAdd, openUpdate, lodding]);

    const handleUpdateClick = (row) => {
        setSelectedRow(row);

        setOpenUpdate(true);
    };
    const handleDeleteClick = (id) => {
        WebSocketManager.sendMessage({ path: 'data', type: 'delete', table: 'modules', id: `${id}` });
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
            field: "name",
            headerName: 'Name',
            flex: 1,
            // resizable: false,
            minWidth: 150,
        },
        {
            field: "imagespath",
            headerName: 'Images Path',
            flex: 1,
            // resizable: false,
            minWidth: 150,
        },
        {
            field: "jenkinsPath",
            headerName: 'Jenkins Path',
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
                    rows={modulesData}
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
export default Modules

const AddModal = ({ Open, setOpen }) => {

    const [modulename, setmodulename] = useState('');
    const [imagepath, setimagepath] = useState('');
    const [jenkinsPath, setjenkinsPath] = useState('');

    const handleOpen = () => {
        setOpen(true);
    };



    const handleSubmit = (event) => {
        event.preventDefault();
        WebSocketManager.sendMessage({
            path: 'data',
            type: 'insert',
            table: 'modules',
            columns: ['name', 'imagespath', 'jenkinsPath'],
            values: [modulename, imagepath, jenkinsPath],
        });

        const handleWebSocketData = (data) => {
            if (data?.status == "inserted" && data?.tableName == "modules") {
                setOpen(false);
            }
        }
        WebSocketManager.subscribe(handleWebSocketData);
        return () => WebSocketManager.unsubscribe(handleWebSocketData);
    };

    return (
        <div>
            <Modal open={Open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-imagepath">
                <Box component="form" sx={style} onSubmit={handleSubmit}>
                    <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Add New Type</Typography>
                    <TextField fullWidth label="Modules" variant="outlined" value={modulename} onChange={(e) => setmodulename(e.target.value)} />
                    <TextField fullWidth label="imagepath" variant="outlined" value={imagepath} onChange={(e) => setimagepath(e.target.value)} />
                    <TextField fullWidth label="Jenkins Path" variant="outlined" value={jenkinsPath} onChange={(e) => setjenkinsPath(e.target.value)} />
                    <Button variant="contained" color="secondary" type="submit">Submit</Button>
                </Box>
            </Modal>
        </div>
    );
};

const UpdatesModal = ({ rows, Open, setOpen }) => {
    const [module_name, setmodule_name] = useState('');
    const [imagepath, setimagepath] = useState('');
    const [jenkinsPath, setjenkinsPath] = useState('');
    const [modules, setmodules] = useState([])


   useEffect(() => {
        setmodules(rows || null);
        setmodule_name(rows?.name || '')
        setimagepath(rows?.imagespath || '')
        setjenkinsPath(rows?.jenkinsPath || '')
    }, [rows]);

    const handleSubmit = (event) => {
        event.preventDefault();
        WebSocketManager.sendMessage({
            path: 'data',
            type: 'update',
            table: 'modules',
            whereCondition: "id=?",
            whereValues: [modules.id],
            columns: ['name', 'imagespath', 'jenkinsPath'],
            values: [module_name, imagepath, jenkinsPath],
        });

        const handleWebSocketData = (data) => {
            if (data?.status == "updated" && data?.tableName == "modules") {
                setOpen(false);
            }
        }
        WebSocketManager.subscribe(handleWebSocketData);
        return () => WebSocketManager.unsubscribe(handleWebSocketData);
    };

    return (
        <div>
            <Modal open={Open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-imagepath">
                <Box component="form" sx={style} onSubmit={handleSubmit}>
                    <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Update Modules</Typography>
                    <TextField fullWidth label="Modules Name" variant="outlined" value={module_name} onChange={(e) => setmodule_name(e.target.value)} />
                    <TextField fullWidth label="Image path" variant="outlined" value={imagepath} onChange={(e) => setimagepath(e.target.value)} />
                    <TextField fullWidth label="Jenkins Path" variant="outlined" value={jenkinsPath} onChange={(e) => setjenkinsPath(e.target.value)} />
                    <Button variant="contained" color="secondary" type="submit">Submit</Button>
                </Box>
            </Modal>
        </div>
    );
};
