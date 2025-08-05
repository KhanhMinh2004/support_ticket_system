import {Box} from "@mui/material"

const CircleWrapper = ({children, size = 80, bgColor = '#E8F3FF'}) => {
    return (
        <Box
            sx={{
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: bgColor,
                opacity: 0.8,
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