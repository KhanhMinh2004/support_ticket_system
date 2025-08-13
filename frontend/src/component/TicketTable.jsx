import {
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Select,
    MenuItem,
    Chip,
    Grid,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';
import {getStatusColor} from "../utils/statusColor.js";
import {getPriorityColor} from "../utils/priorityColor.js";
import axios from "axios";

const STATUSES = ['Open', 'In Progress', 'Resolved'];

const TicketTable = ({ tickets, onTicketUpdate}) => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleView = (ticket) => {
        setSelectedTicket(ticket);
        setOpenDialog(true);
    };

    const handleStatusChange = (e) => {
        const updated = { ...selectedTicket, status: e.target.value };
        setSelectedTicket(updated);
    };

    const handleSave = async () => {
        try {
            await axios.patch('http://localhost:8000/api/tickets/' + selectedTicket.id + '/status', {
                status: selectedTicket.status,
            })
            onTicketUpdate({ ...selectedTicket, status: selectedTicket.status });

            setOpenDialog(false);
        } catch (err){
            console.error("Error updating ticket status:", err);
            alert(err.response?.data?.message || "Failed to update ticket status");
        }
    }

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                            <TableCell>{ticket.id}</TableCell>
                            <TableCell>{ticket.name}</TableCell>
                            <TableCell>{ticket.title}</TableCell>
                            <TableCell>
                                <Chip label={ticket.category} variant="outlined" />
                            </TableCell>
                            <TableCell>
                                <Chip label={ticket.priority} sx={{backgroundColor: getPriorityColor(ticket.priority), color: 'white'}} />
                            </TableCell>
                            <TableCell>
                                <Chip label={ticket.status} color={getStatusColor(ticket.status)} />
                            </TableCell>
                            <TableCell>{ticket.created_at}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleView(ticket)} size="small">
                                    <VisibilityIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Dialog for Ticket Details */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                {selectedTicket && (
                    <>
                        <DialogTitle>Ticket Details - {selectedTicket.id}</DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={2}>
                                <Grid size={{xs: 6}}>
                                    <Typography variant="subtitle2" gutterBottom>Name:</Typography>
                                    <Typography variant="body2" gutterBottom>{selectedTicket.name}</Typography>
                                </Grid>
                                <Grid size={{xs: 6}}>
                                    <Typography variant="subtitle2" gutterBottom>Email:</Typography>
                                    <Typography variant="body2" gutterBottom>{selectedTicket.email}</Typography>
                                </Grid>
                                <Grid size={{xs: 6}}>
                                    <Typography variant="subtitle2" gutterBottom>Category:</Typography>
                                    <Chip label={selectedTicket.category} variant="outlined" />
                                </Grid>
                                <Grid size={{xs: 6}}>
                                    <Typography variant="subtitle2" gutterBottom>Priority:</Typography>
                                    <Chip label={selectedTicket.priority} sx={{backgroundColor: getPriorityColor(selectedTicket.priority)}} />
                                </Grid>
                                <Grid size={{xs: 12}}>
                                    <Typography variant="subtitle2" gutterBottom>Title:</Typography>
                                    <Typography variant="body2" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                        {selectedTicket.title}
                                    </Typography>
                                </Grid>
                                <Grid size={{xs: 12}}>
                                    <Typography variant="subtitle2" gutterBottom>Description:</Typography>
                                    <Typography variant="body2" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                        {selectedTicket.description}
                                    </Typography>
                                </Grid>
                                <Grid size={{xs: 12}}>
                                    <Typography variant="subtitle2" gutterBottom>Update Status:</Typography>
                                    <Select
                                        variant='outlined'
                                        value={selectedTicket.status}
                                        onChange={handleStatusChange}
                                        fullWidth
                                    >
                                        {STATUSES.map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>Close</Button>
                            <Button variant="contained" onClick={handleSave}>
                                Save
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
};

export default TicketTable;
