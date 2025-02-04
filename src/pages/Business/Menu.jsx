
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

function Menu_function() {
    const token = sessionStorage.getItem('token');
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [lodding, setLodding] = useState(false);
    const [menudata, setMenu] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [rolesname, setroles] = useState([])
    const [access, setaccess] = useState([])
    const [types, settype] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    useEffect(() => {
        WebSocketManager.sendMessage({ token: token, path: "data", type: "list", table: "menu" });
        WebSocketManager.sendMessage({ token: token, path: "data", type: "list", table: "role" });
        WebSocketManager.sendMessage({ token: token, path: "data", type: "list", table: "menu_level" });

    }, [openUpdate, openAdd, lodding])
    useEffect(() => {
        const handleWebSocketData = (data) => {
            if (Array.isArray(data) && data[0]?.hasOwnProperty('segment')) {
                setMenu(data);
            }
            if (Array.isArray(data) && data[0]?.hasOwnProperty('role_name')) {
                setroles(data);
            }
            if (Array.isArray(data) && data[0]?.hasOwnProperty('menu_id') && data[0]?.hasOwnProperty('role_id')) {
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
        if (types == "Menu") {
            WebSocketManager.sendMessage({ token: token, path: 'data', type: 'delete', table: 'menu', id: `${deleteId}` });
        }
        else if (types == "Access") {
            WebSocketManager.sendMessage({ token: token, path: 'data', type: 'delete', table: 'menu_level', id: `${deleteId}` });
        }
        setLodding(true);
        setDeleteId(null)
    };
    const handleAddClickMenu = () => {
        settype("Menu")
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
            field: "kind",
            headerName: 'Kind',
            flex: 1,
            // resizable: false,
            minWidth: 150,
        },
        {
            field: "title",
            headerName: 'Title',
            flex: 1,
            // resizable: false,
            minWidth: 150,
        },
        {
            field: "icon",
            headerName: 'ICON',
            flex: 1,
            // resizable: false,
            minWidth: 150,
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
            field: "title",
            headerName: 'Title',
            flex: 1,
            // resizable: false,
            minWidth: 150,
            valueGetter: (value, row) => menudata.find((m) => m.id === row.menu_id)?.title || 'Unknown',
        },
        {
            field: "role_name",
            headerName: 'Role Name',
            flex: 1,
            // resizable: false,
            minWidth: 150,
            valueGetter: (value, row) => rolesname.find((u) => u.id === row.role_id)?.role_name || 'Unknown',
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
            <AddModal Open={openAdd} setOpen={setOpenAdd} roles={rolesname} type={types} Menu={menudata} token={token} />
            <UpdatesModal Open={openUpdate} setOpen={setOpenUpdate} rows={selectedRow} roles={rolesname} type={types} Menu={menudata} token={token} />
            <Paper color="primary"
                variant="outlined"
                shape="rounded" sx={{ height: 410, width: '100%' }}>
                <DataGrid
                    columns={columns}
                    rows={menudata}

                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 25, 100]}

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
                        {types == "Menu" ? "Are you sure you want to delete this Menu?" : "Are you sure you want to delete this User Access?"}
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
export default Menu_function;

const AddModal = ({ Open, setOpen, roles, type, Menu, token }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [selectedRoles, setSelectedRoles] = useState(null);
    const [menu_name, setmenu_name] = useState(null);
    const [modulename, setmodulename] = useState(null);
    const [segment, setsegment] = useState('');
    const [title, settitle] = useState('');
    const handleSubmit = (event) => {
        if (type == "Menu") {
            event.preventDefault();
            WebSocketManager.sendMessage({
                path: 'data',
                type: 'insert',
                table: 'Menu',
                columns: ['kind', 'segment', 'title', 'icon', 'Children'],
                values: [modulename, segment, title],
            });

            const handleWebSocketData = (data) => {
                if (data?.status == "inserted" && data?.tableName == "Menu") {
                    setSnackbar({
                        open: true,
                        message: "Menu added successfully",
                        severity: "success",
                    })
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
                table: 'menu_level',
                columns: ['Menu_id', 'role_id',],
                values: [menu_name.id, selectedRoles.id],
            });

            const handleWebSocketData = (data) => {
                if (data?.status == "inserted" && data?.tableName == "menu_level") {
                    setSnackbar({
                        open: true,
                        message: "User Access added successfully",
                        severity: "success",
                    })
                    setOpen(false);
                }
            }
            WebSocketManager.subscribe(handleWebSocketData);
            return () => WebSocketManager.unsubscribe(handleWebSocketData);
        }

    };


    return (
        <div>
            <Modal open={Open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-segment">
                <Box component="form" sx={style} onSubmit={handleSubmit}>
                    {type === "Access" && (
                        <>
                            <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Add New User Access</Typography>
                            <Autocomplete
                                value={menu_name}
                                options={Menu}
                                getOptionLabel={(option) => option?.title || ""}
                                onChange={(event, newValue) => setmenu_name(newValue)}
                                renderInput={(params) => <TextField {...params} label="Menu Name" variant="outlined" />}

                            />

                            <Autocomplete
                                value={selectedRoles}
                                options={roles}
                                getOptionLabel={(option) => option?.role_name || ""}
                                onChange={(event, newValue) => setSelectedRoles(newValue)}
                                renderInput={(params) => <TextField {...params} label="User Name" variant="outlined" />}

                            />
                        </>)
                    }
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

const UpdatesModal = ({ rows, Open, setOpen, roles, type, Menu, token }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [selectedRoles, setSelectedRoles] = useState(null);
    const [menu_name, setmenu_name] = useState(null);
    const [segment, setsegment] = useState('');
    const [title, settitle] = useState('');
    const [icon, seticon] = useState('')
    const [Children, setChildren] = useState('')
    useEffect(() => {
        if (type == "Menu") {
            setmenu_name(rows?.kind || '')
            setsegment(rows?.segment || '')
            settitle(rows?.title || '')
        }

        if (type == "Access") {
            setmenu_name(Menu?.find(m => m.id === rows?.menu_id) || null)
            setSelectedRoles(roles.find(u => u?.id === rows?.role_id) || null)
        }

    }, [rows]);

    const handleSubmit = (event) => {
        if (type == "Menu") {
            event.preventDefault();
            WebSocketManager.sendMessage({
                token: token,
                path: 'data',
                type: 'update',
                table: 'Menu',
                whereCondition: "id=?",
                whereValues: [Menu.id],
                columns: ['kind', 'segment', 'title', 'icon', 'Children'],
                values: [menu_name, segment, title, icon, Children],
            });

            const handleWebSocketData = (data) => {
                if (data?.status == "updated" && data?.tableName == "Menu") {
                    setSnackbar({
                        open: true,
                        message: "Menu updated successfully",
                        severity: "success",
                    })
                    setOpen(false);
                }
            }
            WebSocketManager.subscribe(handleWebSocketData);
            return () => WebSocketManager.unsubscribe(handleWebSocketData);
        }
        else if (type == "Access") {
            event.preventDefault();
            WebSocketManager.sendMessage({
                token: token,
                path: 'data',
                type: 'update',
                table: 'menu_level',
                whereCondition: "id=?",
                whereValues: [rows.id],
                columns: ['Menu_id', 'user_id',],
                values: [menu_name.id, selectedRoles.id],
            });

            const handleWebSocketData = (data) => {
                if (data?.status == "updated" && data?.tableName == "userMenuaccess") {
                    setSnackbar({
                        open: true,
                        message: "User Access updated successfully",
                        severity: "success",
                    })
                    setOpen(false);
                }
            }
            WebSocketManager.subscribe(handleWebSocketData);
            return () => WebSocketManager.unsubscribe(handleWebSocketData);
        }

    };

    return (
        <div>
            <Modal open={Open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-segment">
                <Box component="form" sx={style} onSubmit={handleSubmit}>

                    {type == "Menu" &&
                        <>
                            <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Update Menu</Typography>
                            <TextField fullWidth label="Menu Name" variant="outlined" value={menu_name} onChange={(e) => setmenu_name(e.target.value)} />
                            <TextField fullWidth label="Image path" variant="outlined" value={segment} onChange={(e) => setsegment(e.target.value)} />
                            <TextField fullWidth label="Jenkins Path" variant="outlined" value={title} onChange={(e) => settitle(e.target.value)} />
                        </>

                    }


                    {type == "Access" &&
                        <>
                            <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Update Access</Typography>
                            <Autocomplete
                                value={menu_name}
                                options={Menu}
                                getOptionLabel={(option) => option?.title || ""}
                                onChange={(event, newValue) => setmenu_name(newValue)}
                                renderInput={(params) => <TextField {...params} label="Menu Name" variant="outlined" />}

                            />
                            <Autocomplete
                                value={selectedRoles}
                                options={roles}
                                getOptionLabel={(option) => option?.role_name || ""}
                                onChange={(event, newValue) => setSelectedRoles(newValue)}
                                renderInput={(params) => <TextField {...params} label="Role Name" variant="outlined" />}

                            />
                        </>

                    }

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
