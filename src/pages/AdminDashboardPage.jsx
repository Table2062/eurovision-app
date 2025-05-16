import React, { useEffect, useState } from "react";
import { Box, Tab, Tabs, Typography, CircularProgress } from "@mui/material";
import CategoryPanel from "../components/CategoryPanel";
import {getAllCategories} from "../api/adminApi";
import useAuthStore from "../store/authStore";
import FinalPanel from "../components/FinalPanel";
import UtilsPanel from "../components/UtilsPanel";


const AdminDashboardPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(true);

    const { token} = useAuthStore();

    useEffect(() => {
        getAllCategories(token).then(setCategories).finally(() => setLoading(false));
    }, [token]);

    const handleTabChange = (_, newValue) => {
        setSelectedTab(newValue);
    };

    if (loading) return <CircularProgress sx={{ m: 4 }} />;

    return (
        <Box>
            <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                {categories.map((cat) => (
                    <Tab key={cat.name} label={cat.label} />
                ))}
                <Tab label="Finale" />
                <Tab label="Impostazioni" />
            </Tabs>

            {categories.map((cat, index) => (
                <div key={cat.name} hidden={selectedTab !== index}>
                    {selectedTab === index && <CategoryPanel category={cat}/>}
                </div>
            ))}

            {selectedTab === categories.length && (
                <FinalPanel/>
            )}

            {selectedTab === categories.length+1 && (
                <UtilsPanel/>
            )}
        </Box>
    );
};

export default AdminDashboardPage;