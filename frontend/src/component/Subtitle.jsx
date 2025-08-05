import { Typography } from '@mui/material';
import '@fontsource/outfit/300.css';

const Title = ({ children, sx = {}, ...props }) => {
    return (
        <Typography
            variant="h6"
            sx={{ fontFamily: 'Outfit, sans-serif', opacity: 0.65, py: 1, ...sx }}
            {...props}
        >
            {children}
        </Typography>
    );
};

export default Title;