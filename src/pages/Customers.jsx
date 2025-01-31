import React, { useEffect, useState, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Box } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthLoginInfo } from "../AuthComponents/AuthLogin";
import { base } from '../config';
import { PageContainer } from '@toolpad/core/PageContainer';
const API_URL = base(window.env.AP)

const CustomersPage = ({ pathname, navigate }) => {
    const [customers, setCustomers] = useState({});
    // const navigate = useNavigate();
    const [ctx, setctx] = useState(JSON.parse(sessionStorage.getItem("user")));

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const token = sessionStorage.getItem('token');
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const response = await axios.get(`${API_URL}/getbycustomer`, { withCredentials: true });
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customers', error);
            }
        };
        fetchCustomers();
    }, []);

    const handleClick = (key) => {
        const customer = customers[key]
        localStorage.setItem("env", JSON.stringify(customer))
        navigate('/environment', { state: { variables: customers[key] } });
    };

    return (
        <Box style={{ display: 'flex', justifyContent: 'center', padding: '16px 16px' }}>
            <TableContainer component={Paper} style={{ width: '100%', maxWidth: '800px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: '60px' }}>
                                <Typography variant="h6" style={{ fontSize: '1.2rem' }}>Icon</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h6" style={{ fontSize: '1.2rem' }}>Execute Test Cases</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(customers).map((key) => (
                            <TableRow key={key} hover>
                                <TableCell onClick={() => handleClick(key)} style={{ width: '60px', textAlign: 'center', cursor: 'pointer' }}>
                                    <IconButton onClick={() => handleClick(key)} style={{ fontSize: '1.2rem' }}>
                                        <FolderIcon color="primary" fontSize='2rem' />
                                    </IconButton>
                                </TableCell>
                                <TableCell onClick={() => handleClick(key)} style={{ cursor: 'pointer' }}>
                                    <Typography onClick={() => handleClick(key)} variant="body1" style={{ fontSize: '1.2rem' }}>
                                        {key}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>


    );
};

export default CustomersPage;
