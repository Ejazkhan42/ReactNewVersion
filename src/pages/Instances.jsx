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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { DialogsProvider, useDialogs } from '@toolpad/core/useDialogs';
import { AuthLoginInfo } from "../AuthComponents/AuthLogin";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import { base } from '../config';
const API_URL=base(window.env.AP)

function Clients() {
  const [ctx,setctx] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [data, setData] = useState([]);
  const [customerUpdate,setCustomerUpdate]=useState(false)
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [formData, setFormData] = useState({
    customer_id:"",
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
        const response = await axios.get(`${API_URL}/getbycustomer?user_id=${ctx.id}`, { withCredentials: true });
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
        customer_id:"",
        clientName:"",
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
      customer_id:"",
      clientName:"",
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

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await axios.put(`${API_URL}/customerupdate`, formData, { withCredentials: true });
        const updatedData = [...data];
        updatedData[currentClient] = formData;
        setData(updatedData);
        setCustomerUpdate(true);
      } else {
        const response = await axios.post(`${API_URL}/addcustomer`, formData, { withCredentials: true });
        setData([...data, response.data]);
        setCustomerUpdate(true)
        
      }
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async (clientIndex) => {
    try {
      const idToDelete = data[clientIndex].customer_id;
      console.log(idToDelete)
      await axios.delete(`${API_URL}/deletecustomer/?deletecustomer=${idToDelete}`, { withCredentials: true });
      const updatedData = data.filter((_, index) => index !== clientIndex);
      setData(updatedData);
      setCustomerUpdate(true)
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  return (
    <Container>
        <Grid container spacing={{ xs: 1, md: 1 }} sx={{ alignItems: "basecine" }} columns={{ xs: 1, sm: 1, md: 4 }}>
        <Grid size={{ xs: 1, sm: 4, md: 4 }}>
        <Button variant="contained" sx={{backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' } }} startIcon={<AddIcon />} onClick={() => handleClickOpen()}>
          Add Instance
        </Button>
        </Grid>
        <Grid size={{ xs: 2, sm: 3, md: 4 }}>
        <TableContainer component={Paper}>
        <Table  sx={{ minWidth: 1 }} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Env Name</TableCell>
              <TableCell>Instance URL</TableCell>
              <TableCell>Instance Username</TableCell>
              <TableCell>Instance Password</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((client, index) => (
              <TableRow key={index}>
                <TableCell>{client.customer_id}</TableCell>
                <TableCell>{client.clientName}</TableCell>
                <TableCell>{client.envName}</TableCell>
                <TableCell>{client.instance_url}</TableCell>
                <TableCell>{client.instance_username}</TableCell>
                <TableCell>{client.instance_password}</TableCell>
                <TableCell>
                  <Button startIcon={<EditIcon />} onClick={() => handleClickOpen(index)} />
                  <Button startIcon={<DeleteIcon />} onClick={() => handleDelete(index)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
          </Grid>
          <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? "Edit Instance" : "Add Instance"}</DialogTitle>
        <Box >
        <DialogContent>
        <TextField
            margin="dense"
            label="ID"
            name="customer_id"
            value={formData.customer_id}
            onChange={handleChange}
            fullWidth
          />
        <TextField
            margin="dense"
            label="Customer Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Env Name"
            name="envName"
            value={formData.envName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Instance URL"
            name="instance_url"
            value={formData.instance_url}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Instance Username"
            name="instance_username"
            value={formData.instance_username}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Instance Password"
            name="instance_password"
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
    </Container>
  );
}

export default Clients;
