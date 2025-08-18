import { useDispatch, useSelector } from 'react-redux';
import { nextSlice, closeSplash } from "../../store/store";
import { Box, Button } from "@mui/material";

const SplashScreen = () => {
    const dispatch = useDispatch();
    const { currentSlice } = useSelector((state) => state.splash);

    const imgSplash = [
        { id: 1, img: "\splash.jpg" },
        { id: 2, img: "\send_email.jpg" }
    ];

    return (
        <Box
            sx={{
                p: 2,
                bgcolor: '#000000', // Black background
                borderRadius: 2,
                position: 'relative',
                height: '100vh', // Full viewport height
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: '#D3C7B4', // Off-white text color similar to the image
                fontFamily: 'Arial, sans-serif',
                overflow: 'hidden',
            }}
        >
            {/* Image */}
            <img
                src={imgSplash[currentSlice].img}
                alt={`splash-${currentSlice + 1}`}
                style={{
                    width: '70vw', 
                    height: '70vh', 
                    objectFit: 'cover', 
                    display: 'block',

                }}
            />

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                {currentSlice < imgSplash.length - 1 && (
                    <Button
                        variant="contained"
                        onClick={() => dispatch(nextSlice())}
                        sx={{
                            bgcolor: '#D3C7B4',
                            color: '#000',
                            borderRadius: '20px',
                            px: 3,
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#C0B0A0' },
                        }}
                    >
                        Tiếp
                    </Button>
                )}
                <Button
                    variant="contained"
                    onClick={() => dispatch(closeSplash())}
                    sx={{
                        bgcolor: '#D3C7B4',
                        color: '#000',
                        borderRadius: '20px',
                        px: 3,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#C0B0A0' },
                    }}
                >
                    Đóng
                </Button>
            </Box>
        </Box>
    );
};

export default SplashScreen;