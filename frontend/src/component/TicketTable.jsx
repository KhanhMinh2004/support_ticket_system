import {
    Card,
    CardHeader,
    CardContent,
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

const STATUSES = ['Open', 'Pending', 'Resolved'];

const getStatusColor = (status) => {
    switch (status) {
        case 'Open':
            return 'error';
        case 'Pending':
            return 'warning';
        case 'Resolved':
            return 'success';
        default:
            return 'default';
    }
};

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
                                <Chip label={ticket.priority} color="primary" />
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
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                {selectedTicket && (
                    <>
                        <DialogTitle>Ticket Details - {selectedTicket.id}</DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Name:</Typography>
                                    <Typography variant="body2" gutterBottom>{selectedTicket.name}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Email:</Typography>
                                    <Typography variant="body2" gutterBottom>{selectedTicket.email}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Category:</Typography>
                                    <Chip label={selectedTicket.category} variant="outlined" />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Priority:</Typography>
                                    <Chip label={selectedTicket.priority} color="primary" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" gutterBottom>Description:</Typography>
                                    <Typography variant="body2" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                        {selectedTicket.description}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" gutterBottom>Update Status:</Typography>
                                    <Select
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
