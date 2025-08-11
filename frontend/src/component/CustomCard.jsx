import React from 'react';
import {Box, Card, CardContent, CardMedia, Typography} from "@mui/material";

const CustomCard = ({label, number, icon}) => {
    return (
        <Card variant='outlined' sx={{border: '0.5px solid rgba(0,0,0,0.5)', borderRadius: '10px'}}>
            <CardContent sx={{display:'flex', alignItems:'center', p:0, pt: 2, '&:last-child': { pb: 2 }}}>
                <CardMedia sx={{display: 'flex', alignItems:'center', mx: '10px'}}>
                    {icon}
                </CardMedia>
                <Box>
                    <Typography gutterBottom sx={{fontWeight: 200, fontSize: 15, lineHeight: 1}}>
                        {label}
                    </Typography>
                    <Typography sx={{fontWeight: 600, fontSize: 27, lineHeight: 1}}>
                        {number}
                    </Typography>
                </Box>

            </CardContent>
        </Card>
    );
};

export default CustomCard;