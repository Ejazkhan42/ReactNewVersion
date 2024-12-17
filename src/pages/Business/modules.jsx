
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


function Modules() {
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [lodding, setLodding] = useState(false);
    const [modulesData, setmodulesData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [username, setusername] = useState([])
    const [access, setaccess] = useState([])
    const [types, settype] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    useEffect(() => {
        WebSocketManager.sendMessage({ path: "data", type: "list", table: "modules" });
        WebSocketManager.sendMessage({ path: "data", type: "list", table: "users" });
        WebSocketManager.sendMessage({ path: "data", type: "list", table: "usermodulesaccess" });

    }, [openUpdate, openAdd, lodding])
    useEffect(() => {
        const handleWebSocketData = (data) => {
            if (Array.isArray(data) && data[0]?.hasOwnProperty('imagespath')) {
                setmodulesData(data);
            }
            if (Array.isArray(data) && data[0]?.hasOwnProperty('username')) {
                setusername(data);
            }
            if (Array.isArray(data) && data[0]?.hasOwnProperty('Modules_id') && data[0]?.hasOwnProperty('user_id')) {
                setaccess(data);
            }

            setLodding(false);
        };

        WebSocketManager.subscribe(handleWebSocketData);
        return () => WebSocketManager.unsubscribe(handleWebSocketData);
    }, [openAdd, openUpdate, lodding]);

    const handleUpdateClick = (row, type) => {
        setSelectedRow(row);
        settype(type)
        setOpenUpdate(true);
    };
    const handleDeleteClick = (id, type) => {
        setDeleteId(id)
        settype(type)


    };
    const handleDeleteConfirm = () => {
        if (types == "Modules") {
            WebSocketManager.sendMessage({ path: 'data', type: 'delete', table: 'modules', id: `${deleteId}` });
        }
        else if (types == "Access") {
            WebSocketManager.sendMessage({ path: 'data', type: 'delete', table: 'usermodulesaccess', id: `${deleteId}` });
        }
        setLodding(true);
        setDeleteId(null)
    };
    const handleAddClickModules = () => {
        settype("Modules")
        setOpenAdd(true);
    };
    const handleAddClickAccess = () => {
        settype("Access")
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
            field: "jenkinsPath",
            headerName: 'Jenkins Path',
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
                        onClick={() => handleUpdateClick(params.row, "Modules")}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => handleDeleteClick(params.row.id, "Modules")}
                        color="inherit"
                    />
                ]
            ),
        },
    ];
    const columns1 = [
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
            valueGetter: (value, row) => modulesData.find((m) => m.id === row.Modules_id)?.name || 'Unknown',
        },
        {
            field: "username",
            headerName: 'User Name',
            flex: 1,
            // resizable: false,
            minWidth: 150,
            valueGetter: (value, row) => username.find((u) => u.id === row.user_id)?.username || 'Unknown',
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
                        onClick={() => handleUpdateClick(params.row, "Access")}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => handleDeleteClick(params.row.id, "Access")}
                        color="inherit"
                    />
                ]
            ),
        },
    ];
    const paginationModel = { page: 0, pageSize: 5 };
    return (
        <Container>
            <AddModal Open={openAdd} setOpen={setOpenAdd} users={username} type={types} Modules={modulesData} />
            <UpdatesModal Open={openUpdate} setOpen={setOpenUpdate} rows={selectedRow} users={username} type={types} Modules={modulesData} />
            <Paper color="primary"
                variant="outlined"
                shape="rounded" sx={{ height: 410, width: '100%' }}>
                <DataGrid
                    columns={columns}
                    rows={modulesData}

                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 25, 100]}
                    slots={{
                        toolbar: () => <CustomToolbar handleAddClick={handleAddClickModules} />, // Pass handleAddClick to CustomToolbar
                    }}
                />
            </Paper>
            <Paper
                color="primary"
                variant="outlined"
                shape="rounded" sx={{ height: 410, width: '100%', py: 6 }}>
                <DataGrid
                    columns={columns1}
                    rows={access}

                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 25, 100]}
                    slots={{
                        toolbar: () => <CustomToolbar handleAddClick={handleAddClickAccess} />, // Pass handleAddClick to CustomToolbar
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
                        {types == "Modules" ? "Are you sure you want to delete this Modules?" : "Are you sure you want to delete this User Access?"}
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
export default Modules

const AddModal = ({ Open, setOpen, users, type, Modules }) => {
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [module_name, setmodule_name] = useState(null);
    const [modulename, setmodulename] = useState(null);
    const [imagepath, setimagepath] = useState('');
    const [jenkinsPath, setjenkinsPath] = useState('');
    const handleSubmit = (event) => {
        if (type == "Modules") {
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
        }
        else if (type == "Access") {
            event.preventDefault();
            WebSocketManager.sendMessage({
                path: 'data',
                type: 'insert',
                table: 'usermodulesaccess',
                columns: ['Modules_id', 'user_id',],
                values: [module_name.id, selectedUsers.id],
            });

            const handleWebSocketData = (data) => {
                if (data?.status == "inserted" && data?.tableName == "usermodulesaccess") {
                    setOpen(false);
                }
            }
            WebSocketManager.subscribe(handleWebSocketData);
            return () => WebSocketManager.unsubscribe(handleWebSocketData);
        }

    };


    return (
        <div>
            <Modal open={Open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-imagepath">
                <Box component="form" sx={style} onSubmit={handleSubmit}>

                    {type === "Modules" && (
                        <>
                            <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Add New Module</Typography>
                            <TextField fullWidth label="Modules" variant="outlined" value={modulename} onChange={(e) => setmodulename(e.target.value)} />
                            <TextField fullWidth label="imagepath" variant="outlined" value={imagepath} onChange={(e) => setimagepath(e.target.value)} />
                            <TextField fullWidth label="Jenkins Path" variant="outlined" value={jenkinsPath} onChange={(e) => setjenkinsPath(e.target.value)} />
                        </>
                    )
                    }

                    {type === "Access" && (
                        <>
                            <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Add New User Access</Typography>
                            <Autocomplete
                                value={module_name}
                                options={Modules}
                                getOptionLabel={(option) => option?.name || ""}
                                onChange={(event, newValue) => setmodule_name(newValue)}
                                renderInput={(params) => <TextField {...params} label="Modules Name" variant="outlined" />}

                            />

                            <Autocomplete
                                value={selectedUsers}
                                options={users}
                                getOptionLabel={(option) => option?.username || ""}
                                onChange={(event, newValue) => setSelectedUsers(newValue)}
                                renderInput={(params) => <TextField {...params} label="User Name" variant="outlined" />}

                            />
                        </>)
                    }
                    <Button variant="contained" color="secondary" type="submit">Submit</Button>
                </Box>
            </Modal>
        </div>
    );
};

const UpdatesModal = ({ rows, Open, setOpen, users, type, Modules }) => {
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [module_name, setmodule_name] = useState(null);
    const [imagepath, setimagepath] = useState('');
    const [jenkinsPath, setjenkinsPath] = useState('');
    const [modules, setmodules] = useState([])
    useEffect(() => {
        if (type == "Modules") {
            setmodules(rows || null);
            setmodule_name(rows?.name || '')
            setimagepath(rows?.imagespath || '')
            setjenkinsPath(rows?.jenkinsPath || '')
        }

        if (type == "Access") {
            setmodule_name(Modules?.find(m => m.id === rows?.Modules_id) || null)
            setSelectedUsers(users.find(u => u?.id === rows?.user_id) || null)
        }

    }, [rows]);

    const handleSubmit = (event) => {
        if (type == "Modules") {
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
        }
        else if (type == "Access") {
            event.preventDefault();
            WebSocketManager.sendMessage({
                path: 'data',
                type: 'update',
                table: 'usermodulesaccess',
                whereCondition: "id=?",
                whereValues: [rows.id],
                columns: ['Modules_id', 'user_id',],
                values: [module_name.id, selectedUsers.id],
            });

            const handleWebSocketData = (data) => {
                if (data?.status == "updated" && data?.tableName == "usermodulesaccess") {
                    setOpen(false);
                }
            }
            WebSocketManager.subscribe(handleWebSocketData);
            return () => WebSocketManager.unsubscribe(handleWebSocketData);
        }

    };

    return (
        <div>
            <Modal open={Open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-imagepath">
                <Box component="form" sx={style} onSubmit={handleSubmit}>

                    {type == "Modules" &&
                        <>
                            <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Update Modules</Typography>
                            <TextField fullWidth label="Modules Name" variant="outlined" value={module_name} onChange={(e) => setmodule_name(e.target.value)} />
                            <TextField fullWidth label="Image path" variant="outlined" value={imagepath} onChange={(e) => setimagepath(e.target.value)} />
                            <TextField fullWidth label="Jenkins Path" variant="outlined" value={jenkinsPath} onChange={(e) => setjenkinsPath(e.target.value)} />
                        </>

                    }


                    {type == "Access" &&
                        <>
                            <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Update Access</Typography>
                            <Autocomplete
                                value={module_name}
                                options={Modules}
                                getOptionLabel={(option) => option?.name || ""}
                                onChange={(event, newValue) => setmodule_name(newValue)}
                                renderInput={(params) => <TextField {...params} label="Modules Name" variant="outlined" />}

                            />
                            <Autocomplete
                                value={selectedUsers}
                                options={users}
                                getOptionLabel={(option) => option?.username || ""}
                                onChange={(event, newValue) => setSelectedUsers(newValue)}
                                renderInput={(params) => <TextField {...params} label="User Name" variant="outlined" />}

                            />
                        </>

                    }

                    <Button variant="contained" color="secondary" type="submit">Submit</Button>
                </Box>
            </Modal>
        </div>
    );
};
