import { useState } from "react";
import {Button, Typography, Card, CardContent, Box, Grid} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import Title from "../component/Title.jsx";
import Subtitle from "../component/Subtitle.jsx";
import CircleWrapper from "../component/CircleWrapper.jsx";
import CustomTextField from "../component/CustomTextField.jsx";
import CustomSelect from "../component/CustomSelect.jsx";

const CATEGORIES = [
    "Hardware Issues",
    "Software Problems",
    "Network Connectivity",
    "Email & Communication",
    "Account Access",
    "Security & Permissions",
    "Other"
];

const PRIORITIES = ["Low", "Medium", "High"];

export const UserTicketForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        category: "",
        priority: "",
        description: ""
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setTimeout(() => {
            setIsSubmitted(true);
        }, 500);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            category: "",
            priority: "",
            description: ""
        });
        setIsSubmitted(false);
    };

    if (isSubmitted) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Card sx={{ maxWidth: 400, textAlign: "center", p: 3 }}>
                    <CardContent>
                        <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h5" gutterBottom>
                            Ticket Submitted!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Your support request has been received. Ticket ID: #TK-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </Typography>
                        <Button fullWidth onClick={resetForm} variant="contained" sx={{ mt: 2 }}>
                            Submit Another Ticket
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box p={3} maxWidth={800} mx="auto">
            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                <CircleWrapper>
                    <ConfirmationNumberOutlinedIcon color="primary" sx={{ fontSize: 45, my: 1 }} />
                </CircleWrapper>
                <Title>IT Support Ticket</Title>
                <Subtitle>Submit your technical issue and our support team will assist you</Subtitle>
            </Box>
            <Box sx={{border: '0.5px solid rgba(0,0,0,0.5)', borderRadius: 2, p: 3, backgroundColor: 'secondary.main'}}>
                <Typography variant="h6" sx={{fontWeight: 'medium'}}>
                    New Support Request
                </Typography>
                <Typography variant='h6' gutterBottom sx={{fontSize: 15, fontWeight: 'light', color: 'rgba(0,0,0,0.7)', mb: 5}}>
                    Please provide detailed information about your issue to help us assist you better
                </Typography>
                <Box component='form' onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{xs: 12, sm: 6}}>
                            <CustomTextField
                                label="Full Name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <CustomTextField
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <CustomSelect
                                label="Issue Category"
                                value={formData.category}
                                onChange={(e) => handleInputChange("category", e.target.value)}
                                option={CATEGORIES}
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <CustomSelect
                                label="Priority Level"
                                value={formData.priority}
                                onChange={(e) => handleInputChange("priority", e.target.value)}
                                option={PRIORITIES}
                            />
                        </Grid>
                        <Grid size={{xs: 12}}>
                            <CustomTextField
                                label="Issue Description"
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3, borderRadius: "10px" }}
                        disabled={!formData.name || !formData.email || !formData.category || !formData.priority || !formData.description}
                    >
                        Submit Ticket
                    </Button>
                </Box>
            </Box>

        </Box>
    );
};
