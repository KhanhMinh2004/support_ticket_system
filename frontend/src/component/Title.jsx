import { Typography } from '@mui/material';
import '@fontsource/outfit/600.css';

const Title = ({ children, sx = {}, ...props }) => {
    return (
        <Typography
            variant="h4"
            sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, ...sx }}
            {...props}
        >
            {children}
        </Typography>
    );
};

export default Title;