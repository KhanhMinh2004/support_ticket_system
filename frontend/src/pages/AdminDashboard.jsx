import React, {useState} from 'react';
import {Box, Button, Grid, Typography} from "@mui/material";
import Title from "../component/Title";
import Subtitle from "../component/Subtitle.jsx";
import CustomCard from "../component/CustomCard.jsx";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CustomTextField from "../component/CustomTextField.jsx";
import CustomSelect from "../component/CustomSelect.jsx";
import TicketTable from "../component/TicketTable.jsx";
import {mockTickets} from "../mock-data/mock.js";

const STATUSES = ["Open", "In Progress", "Resolved", "All"];
const CATEGORIES = ["Hardware Issues", "Software Problems", "Network Connectivity", "Email & Communication", "Account Access", "Security & Permissions", "All"];
const PRIORITIES = ["Low", "Medium", "High", "All"];


const AdminDashboard = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedPriority, setSelectedPriority] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');

    const handleClearFilters = () => {
        setSearchText('');
        setSelectedCategory('All');
        setSelectedPriority('All');
        setSelectedStatus('All');
    }

    const handleApplyFilters = () => {
        //API here
        console.log("Filters applied:", {
            searchText,
            selectedCategory,
            selectedPriority,
            selectedStatus
        });
    }
    return (
        <Box width='80vw' mx="auto" sx={{ mt: 5}}>
            <Title>
                IT Support Admin Dashboard
            </Title>
            <Subtitle mb={4}>
                Manage and track all support tickets here
            </Subtitle>
            {/*status section*/}
            <Grid container spacing={1} mb={2}>
                <Grid size={{xs: 6, sm: 3}}>
                    <CustomCard
                        label="Total Tickets"
                        number={12}
                        icon={<PersonOutlineOutlinedIcon color="primary" sx={{ fontSize: 50}}/>}
                    />
                </Grid>
                <Grid size={{xs: 6, sm: 3}}>
                    <CustomCard
                        label="Open Tickets"
                        number={12}
                        icon={<WarningAmberRoundedIcon color="error" sx={{ fontSize: 50}}/>}
                    />
                </Grid>
                <Grid size={{xs: 6, sm: 3}}>
                    <CustomCard
                        label="In Progress"
                        number={12}
                        icon={<AccessTimeRoundedIcon color="warning" sx={{ fontSize: 50}}/>}
                    />
                </Grid>
                <Grid size={{xs: 6, sm: 3}}>
                    <CustomCard
                        label="Resolved Tickets"
                        number={12}
                        icon={<TaskAltRoundedIcon color="success" sx={{ fontSize: 50}}/>}
                    />
                </Grid>
            </Grid>
            {/*filter section*/}
            <Box bgcolor='secondary.main' sx={{border: '0.5px solid rgba(0,0,0,0.5)', borderRadius: 2, p: 2, mb: 2}}>
                <Box sx={{display: 'flex', alignItems:'center', mb: 2}}>
                    <FilterAltOutlinedIcon sx={{fontSize: 25, mr: 1}}/>
                    <Typography sx={{fontWeight: 500, fontSize: '20px'}}>
                        Filter & Search
                    </Typography>
                </Box>
                <Grid container spacing={1}>
                    <Grid size={{xs: 6, sm: 2}}>
                        <CustomTextField
                            label="Search"
                            required={false}
                            fontSize='13px'
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{xs: 6, sm: 2}}>
                        <CustomSelect
                            label="Category"
                            option={CATEGORIES}
                            value={selectedCategory}
                            required={false}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{xs: 6, sm: 2}}>
                        <CustomSelect
                            label="Priority"
                            value={selectedPriority}
                            option={PRIORITIES}
                            required={false}
                            onChange={(e) => setSelectedPriority(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{xs: 6, sm: 2}}>
                        <CustomSelect
                            label="Status"
                            value={selectedStatus}
                            option={STATUSES}
                            required={false}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{xs: 12, sm: 2}}>
                        <Button
                            fullWidth
                            variant='outlined'
                            sx={{borderRadius: '10px', height: '50px'}}
                            color='error'
                            onClick={handleClearFilters}
                        >
                            Clear filters
                        </Button>
                    </Grid>
                    <Grid size={{xs: 12, sm: 2}}>
                        <Button
                            fullWidth
                            variant='outlined'
                            sx={{borderRadius: '10px', height: '50px'}}
                            color='primary'
                            onClick={handleApplyFilters}
                        >
                            Apply Filters
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            {/*tickets section*/}
            <Box bgcolor='secondary.main' sx={{border: '0.5px solid rgba(0,0,0,0.5)', borderRadius: 2, p: 2, mb: 2}}>
                <Typography sx={{fontWeight: 500, fontSize: '20px'}}>
                    Support Tickets
                </Typography>
                <TicketTable tickets={mockTickets}/>
            </Box>
        </Box>
    );
};

export default AdminDashboard;