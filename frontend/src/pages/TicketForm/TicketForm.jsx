import { useState } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, Card, CardContent, Box } from "@mui/material";
import Title from "../../component/Title";
import Subtitle from "../../component/Subtitle.jsx";
import CircleWrapper from "../../component/CircleWrapper.jsx";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';

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
        <Box p={3} maxWidth={700} mx="auto">
            <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                <CircleWrapper>
                    <ConfirmationNumberOutlinedIcon color="primary" sx={{ fontSize: 45, my: 1 }} />
                </CircleWrapper>
                <Title>IT Support Ticket</Title>
                <Subtitle>Submit your technical issue and our support team will assist you</Subtitle>
            </Box>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        New Support Request
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Box display="flex" gap={2} flexWrap="wrap">
                            <TextField
                                label="Full Name *"
                                fullWidth
                                required
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                            />
                            <TextField
                                label="Email Address *"
                                type="email"
                                fullWidth
                                required
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                            />
                            <FormControl fullWidth required>
                                <InputLabel>Issue Category</InputLabel>
                                <Select
                                    value={formData.category}
                                    onChange={(e) => handleInputChange("category", e.target.value)}
                                    label="Issue Category"
                                >
                                    {CATEGORIES.map((category) => (
                                        <MenuItem key={category} value={category}>{category}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth required>
                                <InputLabel>Priority Level</InputLabel>
                                <Select
                                    value={formData.priority}
                                    onChange={(e) => handleInputChange("priority", e.target.value)}
                                    label="Priority Level"
                                >
                                    {PRIORITIES.map((priority) => (
                                        <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Issue Description *"
                                fullWidth
                                multiline
                                rows={5}
                                required
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                            />
                        </Box>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 3 }}
                            disabled={!formData.name || !formData.email || !formData.category || !formData.priority || !formData.description}
                        >
                            Submit Ticket
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};
