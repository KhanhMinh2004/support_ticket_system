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

const STATUSES = ['Open', 'Pending', 'Resolved'];

const TicketTable = ({ tickets }) => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleView = (ticket) => {
        setSelectedTicket(ticket);
        setOpenDialog(true);
    };

    const handleStatusChange = (e) => {
        const updated = { ...selectedTicket, status: e.target.value };
        setSelectedTicket(updated);
        // TODO: Update backend here
    };

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
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
                            <TableCell>{ticket.email}</TableCell>
                            <TableCell>
                                <Chip label={ticket.category} variant="outlined" />
                            </TableCell>
                            <TableCell>
                                <Chip label={ticket.priority} sx={{backgroundColor: getPriorityColor(ticket.priority), color: 'white'}} />
                            </TableCell>
                            <TableCell>
                                <Chip label={ticket.status} color={getStatusColor(ticket.status)} />
                            </TableCell>
                            <TableCell>{ticket.createdDate}</TableCell>
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
                            <Button variant="contained" onClick={() => setOpenDialog(false)}>
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
