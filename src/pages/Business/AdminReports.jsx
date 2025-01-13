
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
    CardMedia,
    Autocomplete,
    Paper,


} from '@mui/material';
import WebSocketManager from '../../AuthComponents/useWebSocket';
import EditIcon from '@mui/icons-material/Edit';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer, GridToolbarExport
} from '@mui/x-data-grid';
import PhotoSharpIcon from '@mui/icons-material/PhotoSharp';
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

function CustomToolbar() {

    return (
        <GridToolbarContainer>
            <GridToolbarExport printOptions={{ disableToolbarButton: true }} />

        </GridToolbarContainer>
    );
}

function ImageView({ image, open, setOpen }) {
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('lg');
    const handleClose = () => {
        setOpen(false); // Close the dialog by setting the `open` state to false
    };
    return (
        <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{"Image"}</DialogTitle>
            <DialogContent >
                <DialogContentText sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} id="alert-dialog-description">
                    <CardMedia sx={{ width: '100%', maxWidth: "1026px" }} component="img" image={image} alt="image" />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>

            </DialogActions>
        </Dialog>
    );
}

function Modules() {
    const [openview, setOpenview] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [lodding, setLodding] = useState(false);
    const [modulesData, setmodulesData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [image, setimage] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    useEffect(() => {
        WebSocketManager.sendMessage({ path: "data", type: "list", table: "reports" });
        WebSocketManager.sendMessage({ path: "data", type: "list", table: "" });

    }, [openUpdate, lodding])
    useEffect(() => {
        const handleWebSocketData = (data) => {
            if (Array.isArray(data) && data[0]?.hasOwnProperty('exception')) {
                setmodulesData(data);
            }
            setLodding(false);
        };

        WebSocketManager.subscribe(handleWebSocketData);
        return () => WebSocketManager.unsubscribe(handleWebSocketData);
    }, [openUpdate, lodding]);

    const handleUpdateClick = (row) => {
        setSelectedRow(row);
        setOpenUpdate(true);
    };
    const handleDeleteClick = (id) => {
        setDeleteId(id)


    };
    const handleDeleteConfirm = () => {
        WebSocketManager.sendMessage({ path: 'data', type: 'delete', table: 'reports', id: `${deleteId}` });
        setLodding(true);
        setDeleteId(null)
    };
    const handleImageViwe = (image) => {
        setimage(image)
        setOpenview(true)
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
            field: "testcase",
            headerName: 'Name',
            flex: 1,
            // resizable: false,
            minWidth: 150,
        },
        {
            field: "exception",
            headerName: 'Details Description',
            flex: 1,
            // resizable: false,
            minWidth: 150,
        },
        {
            field: "status",
            headerName: 'Status',
            flex: 1,
            // resizable: false,
            minWidth: 150,
        },
        {
            field: "image",
            headerName: 'View Image',
            flex: 1,
            disableExport: true,
            // resizable: false,
            minWidth: 150,
            renderCell: (params) => (
                <GridActionsCellItem
                    icon={<PhotoSharpIcon/>}
                    label="View Image"
                    title='View Image'
                    onClick={() => handleImageViwe(params.row.image)}
                >
                </GridActionsCellItem>

            ),

        },
        {
            field: "buildno",
            headerName: 'Jenkins Build No',
            flex: 1,
            // resizable: false,
            minWidth: 150,
        },
        {
            field: "created_at",
            headerName: 'Date',
            flex: 1,

            // resizable: false,
            minWidth: 150,
            valueGetter: (value) => value.split("T")[0] + " " + value.split("T")[1].split(".")[0],
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
            <UpdatesModal Open={openUpdate} setOpen={setOpenUpdate} rows={selectedRow} Modules={modulesData} />
            <ImageView image={image} open={openview} setOpen={setOpenview} />
            <Paper color="primary"
                variant="outlined"
                shape="rounded" sx={{ height: 410, width: '100%' }}>
                <DataGrid
                    columns={columns}
                    rows={modulesData}

                    initialState={{
                        pagination: { paginationModel }, sorting: {
                            sortModel: [{ field: 'created_at', sort: 'desc' }],
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 100]}
                    slots={{
                        toolbar: () => <CustomToolbar />, // Pass handleAddClick to CustomToolbar
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
                        "Are you sure you want to delete this Reports?"
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

const UpdatesModal = ({ rows, Open, setOpen }) => {
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [module_name, setmodule_name] = useState(null);
    const [ExpectionsDetails, SetExpectionsDetails] = useState('');
    const [status, SetStatus] = useState('');
    const [statusArray, setStatusArray] = useState(['Fixed', 'Progress', 'Not Started', 'Not Found', 'Completed', 'Login Problem', 'Test Data Problem'])
    useEffect(() => {
        setmodule_name(rows?.testcase || '')
        SetExpectionsDetails(rows?.exception || '')
        SetStatus(rows?.status || '')
    }, [rows]);

    const handleSubmit = (event) => {
        event.preventDefault();
        WebSocketManager.sendMessage({
            path: 'data',
            type: 'update',
            table: 'reports',
            whereCondition: "id=?",
            whereValues: [rows?.id],
            columns: ["testcase", "exception", "status"],
            values: [module_name, ExpectionsDetails, status],
        });

        const handleWebSocketData = (data) => {
            if (data?.status == "updated" && data?.tableName == "reports") {
                setOpen(false);
            }
        }
        WebSocketManager.subscribe(handleWebSocketData);
        return () => WebSocketManager.unsubscribe(handleWebSocketData);
    };

    return (
        <div>
            <Modal open={Open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-ExpectionsDetails">
                <Box component="form" sx={style} onSubmit={handleSubmit}>
                    <Typography fullWidth id="modal-modal-title" variant="h6" component="h2">Expection Report</Typography>
                    <TextField fullWidth label="Modules Name" variant="outlined" value={module_name} onChange={(e) => setmodule_name(e.target.value)} />
                    <TextField multiline
                        rows={7} fullWidth label="Expection Details" variant="outlined" value={ExpectionsDetails} onChange={(e) => SetExpectionsDetails(e.target.value)} />
                    <Autocomplete
                        value={status}
                        options={statusArray}
                        getOptionLabel={(option) => option || ""}
                        onChange={(event, newValue) => SetStatus(newValue)}
                        renderInput={(params) => <TextField {...params} label="Modules Name" variant="outlined" />}

                    />

                    <Button variant="contained" color="secondary" type="submit">Submit</Button>
                </Box>
            </Modal>
        </div>
    );
};
