import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Snackbar,
  Alert,
  TextField,

} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import Grid from '@mui/material/Grid2';

import { DataGrid, GridActionsCellItem, } from '@mui/x-data-grid';
import { base } from '../config';
const API_URL = base(window.env.AP)

function Clients() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [ctx, setctx] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [data, setData] = useState([]);
  const [customerUpdate, setCustomerUpdate] = useState(false)
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [clientIndex, setClientIndex] = useState(null);
  const [currentClient, setCurrentClient] = useState(null);
  const [formData, setFormData] = useState({
    customer_id: "",
    clientName: "",
    envName: "",
    id: ctx.id,
    instance_url: "",
    instance_username: "",
    instance_password: "",
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = sessionStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(`${API_URL}/getbycustomer`, { withCredentials: true });
        // Assuming the response contains multiple clients with client names as keys
        const clientsData = [];
        Object.keys(response.data).forEach(clientName => {
          // Add client name to each client object
          response.data[clientName].forEach(client => {
            clientsData.push({ ...client, clientName });
          });
        });
        setCustomerUpdate(false)
        setData(clientsData);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setData([]);
      }
    };
    fetchClients();
  }, [customerUpdate]);

  const handleClickOpen = (clientIndex = null) => {
    if (clientIndex !== null) {
      setIsEdit(true);
      setCurrentClient(clientIndex);
      setFormData(data[clientIndex]);
    } else {
      setIsEdit(false);
      setFormData({
        customer_id: "",
        clientName: "",
        envName: "",
        id: ctx.id,
        instance_url: "",
        instance_username: "",
        instance_password: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      customer_id: null,
      clientName: "",
      envName: "",
      id: ctx.id,
      instance_url: "",
      instance_username: "",
      instance_password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const rows = data.map((client, index) => ({ id: index, ...client }));
  console.log(rows.length >= 2)
  const handleSubmit = async () => {
    try {
      if (ctx.role_id <= 6) {

        if (isEdit) {
          const token = sessionStorage.getItem('token');
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          await axios.put(`${API_URL}/updatecustomer`, formData, { withCredentials: true }).then((response) => {
            if (response.status === 200) {
              setSnackbar({
                open: true,
                message: "Instance updated successfully",
                severity: "success",
              });
              const updatedData = [...data];
              updatedData[currentClient] = formData;
              setData(updatedData);
              setCustomerUpdate(true);

            }
          });

          
        } else {
          if ((ctx.role_id == 2 || ctx.role_id == 5 || ctx.role_id == 6) && rows.length <= 3 || (ctx.role_id == 3 || ctx.role_id == 4) && rows.length <= 2) {
            const token = sessionStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.post(`${API_URL}/addcustomer`, formData, { withCredentials: true });
            if (response.status === 200) {
            setData([...data, response.data]);
            setCustomerUpdate(true)
            setSnackbar({
              open: true,
              message: "Instance added successfully",
              severity: "success",
            });
          } else {
            setSnackbar({
              open: true,
              message: "Error adding instance",
              severity: "error",
            });
          }
          }
          else {
            setSnackbar({
              open: true,
              message: "You have reached the maximum number of instances",
              severity: "error",
            });
          }
        }
      }
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = (clientIndex) => {
    try {
      if (ctx.role_id <= 6) {
        const idToDelete = data[clientIndex].customer_id;
        setClientIndex(clientIndex);
        setDeleteId(idToDelete)
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };
  const handleDeleteConfirm = async () => {
    try {
      const token = sessionStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await axios.delete(`${API_URL}/deletecustomer/?deletecustomer=${deleteId}`, { withCredentials: true }).then((response) => {
        if (response.status === 200) {
          const updatedData = data.filter((_, index) => index !== clientIndex);
          setData(updatedData);
          setCustomerUpdate(true)
          setDeleteId(null);
          setSnackbar({
            open: true,
            message: "Instance deleted successfully",
            severity: "success",
          });

        } else {
          setSnackbar({
            open: true,
            message: "Error deleting instance",
            severity: "error",
          });
        }
      });

     
    } catch (error) {
      
      console.error("Error deleting client:", error);
    }
  }


  const columns = [
    {
      field: 'id', headerName: 'ID', width: 80, flex: 0.3,
      resizable: false,
    },
    { field: 'clientName', headerName: 'Customer', width: 100, flex: 0.3, resizable: false },
    { field: 'envName', headerName: 'Env Name', width: 100, flex: 0.3, resizable: false },
    { field: 'instance_url', headerName: 'Instance', width: 100, flex: 1, resizable: false },
    { field: 'instance_username', headerName: 'Username', width: 100, flex: 0.5, resizable: false },
    { field: 'instance_password', headerName: 'Password', width: 100, flex: 0.5, resizable: false },
    {
      field: 'actions',
      headerName: 'Actions',
      resizable: false,
      filterable: false,
      sortable: false,
      filter: false,
      width: 100,
      flex: 0.6,
      renderCell: (params) => ([

        <GridActionsCellItem
          variant="contained"
          color="primary"
          size="small"
          label="Edit"
          icon={<EditIcon />}
          onClick={() => handleClickOpen(params.row.id)}
        />,
        <GridActionsCellItem
          variant="contained"
          color="secondary"
          size="small"
          label="Delete"
          icon={<DeleteIcon />}
          onClick={() => handleDelete(params.row.id)}
        />]

      ),
    },
  ]

  return (
    <Container>
      <Grid container spacing={{ xs: 1, md: 1 }} sx={{ alignItems: "basecine" }} columns={{ xs: 1, sm: 1, md: 4 }}>
        <Grid size={{ xs: 1, sm: 4, md: 4 }}>
          {ctx.role_id <= 6 && (
            <Button variant="contained" sx={{ backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' } }} startIcon={<AddIcon />} onClick={() => handleClickOpen()}>
              Add Instance
            </Button>
          )}

        </Grid>
        <Grid size={{ xs: 2, sm: 3, md: 4 }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} />
        </Grid>
        <Dialog
          open={deleteId !== null}
          onClose={() => setDeleteId(null)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm deletion"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this Component Steps?
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
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEdit ? "Edit Instance" : "Add Instance"}</DialogTitle>
          <Box >
            <DialogContent>
              {isEdit && (<TextField
                margin="dense"
                label="ID"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                fullWidth
              />)}

              <TextField
                margin="dense"
                label="Customer Name"
                name="clientName"
                required
                value={formData.clientName}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Env Name"
                name="envName"
                required
                value={formData.envName}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Instance URL"
                name="instance_url"
                required
                value={formData.instance_url}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Instance Username"
                name="instance_username"
                required
                value={formData.instance_username}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Instance Password"
                name="instance_password"
                required
                value={formData.instance_password}
                onChange={handleChange}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} sx={{ ml: 2, fontSize: '1.2rem', backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' } }}>Cancel</Button>
              <Button onClick={handleSubmit} sx={{ ml: 2, fontSize: '1.2rem', backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' } }} variant="contained">
                {isEdit ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </Box>

        </Dialog>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}

        open={snackbar.open}
        autoHideDuration={10000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", height: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Clients;
