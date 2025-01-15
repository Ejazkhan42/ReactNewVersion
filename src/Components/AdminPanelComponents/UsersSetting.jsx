import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Paper,
  Button,
  Dialog,
  Modal,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
  Select,
  Container,
  MenuItem,
} from "@mui/material";
import {
  DeleteForeverRounded as DeleteForeverRoundedIcon,
  AccountCircleRounded as AccountCircleRoundedIcon,
  AddCircleOutlineRounded as AddCircleOutlineRoundedIcon,
} from "@mui/icons-material";
import Grid from '@mui/material/Grid2';
import { DataGrid,GridActionsCellItem } from '@mui/x-data-grid';

import { base } from "../../config"
const API_URL = base(window.env.AP)

function formatIsoDate(date) {
  return date.split("T")[0];
}


function UsersSetting() {
  const [usersData, setUsersData] = useState([]);
  const tokens = sessionStorage.getItem('token');
  const [usersUpdated, setUsersUpdated] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [newUserDetails, setNewUserDetails] = useState({
    FirstName: "",
    LastName: "",
    username: "",
    Email: "",
    PhoneNumber: "",
    password: "",
    role: "",
  });
  const [newUserPopup, setNewUserPopup] = useState(false);

  const [role, setRole] = useState([]);
  const [selectRole, setSelectRole] = useState('');
  useEffect(() => {

    axios
      .get(`${API_URL}/role`, { withCredentials: true })
      .then((res) => {
        if (res.data != null) {
          setRole(res.data);
        }
      });
  }, []);
  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokens}`;
    axios
      .get(`${API_URL}/getusers`, { withCredentials: true })
      .then((res) => {
        if (res.data != null) {
          setUsersUpdated(false);
          setUsersData(res.data);
        }
      });
  }, [usersUpdated]);

  const handleDelete = (id) => {
    setDeleteUserId(id);
  };

  const handleDeleteConfirm = () => {
    axios
      .post(
        `${API_URL}/deleteuser`,
        {
          userId: deleteUserId,
        },
        { withCredentials: true },
      )
      .then((res) => {
        if (res.data === "success") {
          setUsersUpdated(true);
          setDeleteUserId(null);
        }
      });
  };

  const handleAddNewUser = () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokens}`;
    axios
      .post(
        `${API_URL}/newuser`,
        {
          userDetails: newUserDetails,
        },
        { withCredentials: true },
      )
      .then((res) => {
        if (res.data === "success") {
          setNewUserDetails({
            FirstName: "",
            LastName: "",
            username: "",
            Email: "",
            PhoneNumber: "",
            password: "",
            role: "",
          });
          setUsersUpdated(true);
          setNewUserPopup(false);
        }
      });
  };

  const selectRoleInputChange = (event) => {
    setSelectRole(event.target.value);
    setNewUserDetails({
      ...newUserDetails,
      role: selectRole,
    });
  };

  const AdminUsers = () => {
    const filteredUsers = usersData.filter((user) => user.role_id === 1);
    const columns = [
      { field: "id", headerName: "ID", width: 70,flex: 0.3 },
      { field: "username", headerName: "Username", width: 150,flex: 0.3 },
      { field: "role_name", headerName: "Role", width: 150,flex: 0.3,
        valueGetter: (value, row) => role.find((r) => r.id === row.role_id)?.role_name || 'Unknown',
       },
      { field: "FirstName", headerName: "First Name", width: 150,flex: 0.3 },
      { field: "LastName", headerName: "Last Name", width: 150,flex: 0.3 },
      { field: "Email", headerName: "Email", width: 200,flex: 0.3 },
      { field: "PhoneNumber", headerName: "Phone", width: 150,flex: 0.3 },
      {
        field: "created_at",
        headerName: "Created At",
        width: 200,
        valueGetter: (value) => value.split("T")[0],
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params) => (
          
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteForeverRoundedIcon />
          </IconButton>
        ),
      },
    ];
    return (
      <Box sx={{ marginBottom: 2 }}>
        <Grid>
          <Typography variant="h5" className="usersInfoHeader" align="center">
            Admin users
          </Typography>
          <DataGrid rows={filteredUsers} columns={columns} pageSize={5} />
        </Grid>
      </Box>
    );
  };

  const NormalUsers = () => {
    const filteredUsers = usersData.filter((user) => user.role_id !== 1);
    const columns = [
      { field: "id", headerName: "ID", width: 70 ,flex: 0.3},
      { field: "username", headerName: "Username", width: 150,flex: 0.3 },
      { field: "role_name", headerName: "Role", width: 150,flex: 0.3 , valueGetter: (value, row) => role.find((r) => r.id === row.role_id)?.role_name || 'Unknown',},
      { field: "FirstName", headerName: "First Name", width: 150,flex: 0.3 },
      { field: "LastName", headerName: "Last Name", width: 150,flex: 0.3 },
      { field: "Email", headerName: "Email", width: 200,flex: 0.3 },
      { field: "PhoneNumber", headerName: "Phone", width: 150 ,flex: 0.3},
      {
        field: "created_at",
        headerName: "Created At",
        width: 200,
        flex: 0.3,
        valueGetter: (value) => value.split("T")[0],
      },
      {
        flex: 0.3,
        field: "actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params) => (
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteForeverRoundedIcon />
          </IconButton>
        ),
      },
    ];
    return (
      <Box>
          <Grid>
            <Typography variant="h5" className="usersInfoHeader" align="center">
              Normal users
            </Typography>
            <DataGrid rows={filteredUsers} columns={columns} pageSize={5} />
          </Grid>
      </Box>
    );
  };

  const AddNewUserSection = () => {
    return (
      <Box>
        <Grid>
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2, fontSize: "1rem", backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' } }}
            startIcon={<AddCircleOutlineRoundedIcon />}
            onClick={() => setNewUserPopup(true)}
          >
            Add New User
          </Button>
        </Grid>
      </Box>
    );
  };

  return (
    <div>
      
      <Paper 
       sx={{  width: '100%', padding:5 }}>
        <AddNewUserSection />
      <AdminUsers />
      <NormalUsers />
      </Paper>
      <Dialog
        open={deleteUserId !== null}
        onClose={() => setDeleteUserId(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUserId(null)} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={newUserPopup}
        onClose={() => setNewUserPopup(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component="form"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            margin: 0,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Grid container spacing={{ xs: 1, md: 1 }} sx={{ alignItems: "basecine" }} columns={{ xs: 4, sm: 4, md: 4 }}>
            <Grid size={{ xs: 4, sm: 4, md: 4 }}>
              <TextField
                sx={{ marginTop: 0, marginBottom: 0 }}
                autoFocus
                margin="dense"
                id="FirstName"
                label="First Name"
                type="text"
                fullWidth
                value={newUserDetails.FirstName}
                onChange={(e) =>
                  setNewUserDetails({
                    ...newUserDetails,
                    FirstName: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 4, md: 4 }}>
              <TextField
                autoFocus
                sx={{ marginTop: 0, marginBottom: 0 }}
                margin="dense"
                id="LastName"
                label="Last Name"
                type="text"
                fullWidth
                value={newUserDetails.LastName}
                onChange={(e) =>
                  setNewUserDetails({
                    ...newUserDetails,
                    LastName: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 4, md: 4 }}>
              <TextField
                autoFocus
                sx={{ marginTop: 0, marginBottom: 0 }}
                margin="dense"
                id="username"
                label="Username"
                type="text"
                fullWidth
                value={newUserDetails.username}
                onChange={(e) =>
                  setNewUserDetails({
                    ...newUserDetails,
                    username: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 4, md: 4 }}>
              <TextField
                autoFocus
                margin="dense"
                sx={{ marginTop: 0, marginBottom: 0 }}
                id="Email"
                label="Email"
                type="Email"
                required={true}
                fullWidth
                value={newUserDetails.Email}
                onChange={(e) =>
                  setNewUserDetails({
                    ...newUserDetails,
                    Email: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 4, md: 4 }}>
              <TextField
                autoFocus
                sx={{ marginTop: 0, marginBottom: 0 }}
                margin="dense"
                id="PhoneNumber"
                label="Phone Number"
                type="Tel"
                pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                fullWidth
                value={newUserDetails.PhoneNumber}
                onChange={(e) =>
                  setNewUserDetails({
                    ...newUserDetails,
                    PhoneNumber: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 4, md: 4 }}>
              <TextField
                sx={{ marginTop: 0, marginBottom: 0 }}
                margin="dense"
                id="password"
                label="Password"
                type="password"
                required={true}
                fullWidth
                value={newUserDetails.password}
                onChange={(e) =>
                  setNewUserDetails({
                    ...newUserDetails,
                    password: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 4, md: 4 }}>
              <Select
                sx={{ marginTop: 0, marginBottom: 0 }}
                value={newUserDetails.role}
                onChange={(e) =>
                  setNewUserDetails({
                    ...newUserDetails,
                    role: e.target.value,
                  })}
                style={{ width: "100%" }}
              >
                {role.map((name) => (
                  <MenuItem value={name.id}>{name.role_name}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid size={{ xs: 4, sm: 4, md: 4 }}>
              <Button sx={{ ml: 2, fontSize: "1.2rem", backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' } }} onClick={() => setNewUserPopup(false)} color="primary">
                Cancel
              </Button>
              <Button sx={{ ml: 2, fontSize: "1.2rem", backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' } }} onClick={handleAddNewUser} color="primary">
                Add
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}

export default UsersSetting;
