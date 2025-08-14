import React, {useEffect, useMemo, useState} from 'react';
import {Box, Button, Grid, Pagination, Typography} from "@mui/material";
import Title from "../../component/Title";
import Subtitle from "../../component/Subtitle.jsx";
import CustomCard from "../../component/CustomCard.jsx";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CustomTextField from "../../component/CustomTextField.jsx";
import CustomSelect from "../../component/CustomSelect.jsx";
import TicketTable from "../../component/TicketTable.jsx";
import {mockTickets} from "../../mock-data/mock.js"
import axios from "axios";
import debounce from "lodash.debounce";
import {useAuth} from "../../hooks/useAuth.jsx";

const API_URL = 'http://localhost:8000/api/tickets/';
const STATUSES = ["Open", "In Progress", "Resolved", "All"];
const CATEGORIES = ["Hardware Issues", "Software Problems", "Network Connectivity", "Email & Communication", "Account Access", "Security & Permissions", "All"];
const PRIORITIES = ["Low", "Medium", "High", "All"];


const AdminDashboard = () => {
    const {logout} = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedPriority, setSelectedPriority] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');

    //pagination
    const [tickets, setTickets] = useState([]);
    const [totalTickets, setTotalTickets] = useState(50);
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    //count
    const [counts, setCounts] = useState({
        total: 0,
        open: 0,
        in_progress: 0,
        resolved: 0
    });

    useEffect(() => {
        fetchCounts()
    }, [tickets]);

    useEffect(() => {
        fetchTickets(searchTerm, selectedCategory, selectedPriority, selectedStatus, page);
    }, [page]);

    const handleTicketUpdate = (updatedTicket) => {
        setTickets(prevTickets =>
            prevTickets.map(ticket => ticket.id === updatedTicket.id ? updatedTicket : ticket)
        )
    }

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All');
        setSelectedPriority('All');
        setSelectedStatus('All');
        setPage(1);
        fetchTickets('', 'All', 'All', 'All', 1);
    }

    const handleApplyFilters = () => {
        setPage(1)
        fetchTickets(searchTerm, selectedCategory, selectedPriority, selectedStatus, page);
    }

    const fetchCounts = async () => {
        try {
            const res = await axios.get(API_URL + 'counts');
            setCounts(res.data);
        } catch (error) {
            console.error("Error fetching ticket counts:", error);
        }
    }

    const fetchTickets = async (term, category, priority, status, pageNumber) => {
        try {
            const res = await axios.get(API_URL, {
                params: {
                    search: term,
                    category: category !== 'All' ? category : undefined,
                    priority: priority !== 'All' ? priority : undefined,
                    status: status !== 'All' ? status : undefined,
                    page: pageNumber,
                }
            });
            setTickets(res.data.results);
            setTotalTickets(res.data.count);
        } catch (err) {
            console.error(err);
        }
    }

    const debouncedSearch = useMemo(
        () => debounce((term, category, priority, status) => {
            setPage(1)
            fetchTickets(term, category, priority, status, 1)
        }, 300),
        []
    )

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value, selectedCategory, selectedPriority, selectedStatus);
    }
    return (
        <Box width='80vw' mx="auto" sx={{ mt: 5}}>
            {/*logout button*/}
            <Button
                variant='outlined'
                color='error'
                sx={{borderRadius: '8px', float: 'right'}}
                onClick={logout}
            >
                Logout
            </Button>
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
                        number={counts.total}
                        icon={<PersonOutlineOutlinedIcon color="primary" sx={{ fontSize: 50}}/>}
                    />
                </Grid>
                <Grid size={{xs: 6, sm: 3}}>
                    <CustomCard
                        label="Open Tickets"
                        number={counts.open}
                        icon={<WarningAmberRoundedIcon color="error" sx={{ fontSize: 50}}/>}
                    />
                </Grid>
                <Grid size={{xs: 6, sm: 3}}>
                    <CustomCard
                        label="In Progress"
                        number={counts.in_progress}
                        icon={<AccessTimeRoundedIcon color="warning" sx={{ fontSize: 50}}/>}
                    />
                </Grid>
                <Grid size={{xs: 6, sm: 3}}>
                    <CustomCard
                        label="Resolved"
                        number={counts.resolved}
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
                            value={searchTerm}
                            onChange={handleSearchChange}
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
                <TicketTable tickets={tickets} onTicketUpdate={handleTicketUpdate}/>
                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={Math.ceil(totalTickets / rowsPerPage)}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboard;