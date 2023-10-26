import React, { useEffect, useState } from 'react';
import { Typography, Box, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import ListGenre from '../../components/ListGenre/ListGenre';
import Navbar from '../../components/navbar/Navbar';
import PopularSeriesCorridor from '../../components/seriesCorridor/PopularSeriesCorridor';
import AllSeriesDisplay from '../../components/AllSeriesDisplay/AllSeriesDisplay';
const ListPage: React.FC = () => {
    const defaultTheme = createTheme();

    return (
        <ThemeProvider theme={defaultTheme}>

            <Navbar/>
            <Box className="populaires">
                <Typography variant="h4" className='titre'>
                    Les Plus Populaires:
                </Typography>
                <PopularSeriesCorridor />
            </Box>
                <ListGenre />
                <Box>
                    <AllSeriesDisplay />
                </Box>
        </ThemeProvider>
    );
};

export default ListPage;