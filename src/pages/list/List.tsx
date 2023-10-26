import React from 'react';
import ListWithFilters from '../../components/listWithFilters/ListWithFilters';
import { Box, ThemeProvider, Typography, createTheme } from '@mui/material';
import PopularSeriesCorridor from '../../components/seriesCorridor/PopularSeriesCorridor';
import './List.css';
import Navbar from '../../components/navbar/Navbar';
import ListGenre from '../../components/ListGenre/ListGenre';

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
        </ThemeProvider>

    );
}

export default ListPage;