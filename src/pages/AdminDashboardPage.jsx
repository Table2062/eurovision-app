import {Box, Container, Typography} from "@mui/material";

const AdminDashboardPage = () => {
    return <Container maxWidth="sm">
        <Box mt={8} p={4} boxShadow={3} borderRadius={2}>
            <Typography variant="h4" align="center" gutterBottom>Ciao Admin!</Typography>
        </Box>
    </Container>
};

export default AdminDashboardPage;