import {Box} from "@mui/material"

const CircleWrapper = ({children, size = 80, bgColor = 'rgba(232,243,255,0.8)'}) => {
    return (
        <Box
            sx={{
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: bgColor,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
            }}
        >
            {children}
        </Box>
    );
};

export default CircleWrapper;