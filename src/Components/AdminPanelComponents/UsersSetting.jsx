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
import {base} from "../../config"
const API_URL=base(window.env.AP)

function formatIsoDate(date) {
  return date.split("T")[0];
}


function UsersSetting() {
  const [usersData, setUsersData] = useState([]);
  const [usersUpdated, setUsersUpdated] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [newUserDetails, setNewUserDetails] = useState({
    FirstName:"",
    LastName:"",
    username: "",
    Email:"",
    PhoneNumber:"",
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
  },[]);
  useEffect(() => {
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
            FirstName:"",
            LastName:"",
            username: "",
            Email:"",
            PhoneNumber:"",
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

    return (
      <Box>
      <Grid container spacing={{ xs: 1, md: 1 }} sx={{ alignItems: "basecine" }} columns={{ xs: 2, sm: 4, md: 14 }}>
        <Grid size={{ xs: 4, sm: 4, md: 4 }}>
          <Typography variant="h5" className="usersInfoHeader" align="center">
            Admin users
          </Typography>
          <Typography
            variant="body1"
            className="usersInfoText"
            align="center"
            style={{ fontSize: "0.9rem",textAlign:"justify" }}
          >
            Admins have access to all of the content, including all
            functionality of app, they also can create new users and remove or
            edit existing ones.
          </Typography>
        </Grid>
        <Grid size={{ xs: 2, sm: 4, md: 10 }}>
          <TableContainer component={Paper}>
            <Table stickyHeader size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">Username</TableCell>
                  <TableCell align="center">First Name</TableCell>
                  <TableCell align="center">Last Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Phone</TableCell>
                  <TableCell align="center">Data created</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className={index % 2 !== 0 ? "darkerTableBg" : ""}
                  >
                    <TableCell align="center">
                      <AccountCircleRoundedIcon className="maincolor" />
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.FirstName}</TableCell>
                    <TableCell>{user.LastName}</TableCell>
                    <TableCell>{user.Email}</TableCell>
                    <TableCell>{user.PhoneNumber}</TableCell>
                    <TableCell align="center">
                      {formatIsoDate(user.created_at)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        className="clickable"
                        onClick={() => handleDelete(user.id)}
                      >
                        <DeleteForeverRoundedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        </Grid>
      </Box>
    );
  };

  const NormalUsers = () => {
    const filteredUsers = usersData.filter((user) => user.role_id !== 1);

    return (
      <Box>
      <Grid container spacing={{ xs: 1, md: 1 }} sx={{ alignItems: "basecine" }} columns={{ xs: 4, sm: 4, md: 14 }}>
      <Grid size={{ xs: 4, sm: 4, md: 4 }}>
          <Typography variant="h5" className="usersInfoHeader" align="center">
            Normal users
          </Typography>
          <Typography
            variant="body1"
            className="usersInfoText"
            align="center"
            style={{ fontSize: "0.9rem",textAlign:"justify" }}
          >
            Normal users have access to pages and subpages of: Instance, Customer, Modules, Jobs, Progress and Dashboard. They can add, edit and remove Customer and
            Instance.
          </Typography>
        </Grid>
        <Grid size={{ xs: 4, sm: 4, md: 10 }}>
          <TableContainer component={Paper}>
            <Table stickyHeader size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">Username</TableCell>
                  <TableCell align="center">First Name</TableCell>
                  <TableCell align="center">Last Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Phone</TableCell>
                  <TableCell align="center">Data created</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className={index % 2 !== 0 ? "darkerTableBg" : ""}
                  >
                    <TableCell align="center">
                      <AccountCircleRoundedIcon className="maincolor" />
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.FirstName}</TableCell>
                    <TableCell>{user.LastName}</TableCell>
                    <TableCell>{user.Email}</TableCell>
                    <TableCell>{user.PhoneNumber}</TableCell>
                    <TableCell align="center">
                      {formatIsoDate(user.created_at)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        className="clickable"
                        onClick={() => handleDelete(user.id)}
                      >
                        <DeleteForeverRoundedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
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
          sx={{ ml: 2, fontSize: "1.2rem", backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' } }}
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
      <AddNewUserSection />

      <AdminUsers />
      <NormalUsers />

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
  margin:0,
  boxShadow: 24,
  p: 4,
          }}
      >
      <Grid container spacing={{ xs: 1, md: 1 }} sx={{ alignItems: "basecine" }} columns={{ xs: 4, sm: 4, md: 4 }}>
      <Grid size={{ xs: 4, sm: 4, md: 4 }}>
        <TextField
        sx={{marginTop:0,marginBottom:0}}
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
            sx={{marginTop:0,marginBottom:0}}
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
             sx={{marginTop:0,marginBottom:0}}
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
             sx={{marginTop:0,marginBottom:0}}
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
             sx={{marginTop:0,marginBottom:0}}
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
          sx={{marginTop:0,marginBottom:0}}
            margin="dense"
            id="password"
            label="Password"
            type="password"
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
          sx={{marginTop:0,marginBottom:0}}
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
