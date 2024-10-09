import React from "react";
import { Container, Box } from "@mui/material";
import { useLocation  } from "react-router-dom";
import Grid from '@mui/material/Grid2';
import { base } from "../config";
const BU_URL=base(window.env.BU)
export default function Business() {
    const location = useLocation();
    const path = location.pathname.replace('/business', ''); 
    const SRC_URL=BU_URL+"#"+path
    console.log(SRC_URL)
    return (
        <Container maxWidth="md" style={{ display: "flex", justifyContent: "center", alignItems: "center" , marginLeft:"26%" }}>
            <Box>
            <Grid>
                <iframe 
                    title="Business App"
                    width="1300" 
                    height="700" 
                    frameBorder="0" 
                    allow="clipboard-write;camera;geolocation;fullscreen" 
                    src={SRC_URL}
                ></iframe>
            </Grid>
            </Box>
        </Container>
    );
}
