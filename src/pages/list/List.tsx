import React from 'react';
import ListWithFilters from '../../components/listWithFilters/ListWithFilters';
import { Box, ThemeProvider, Typography, createTheme } from '@mui/material';
import PopularSeriesCorridor from '../../components/seriesCorridor/PopularSeriesCorridor';
import './list.css';

const ListPage: React.FC = () => {
    const defaultTheme = createTheme();


    return (
        <ThemeProvider theme={defaultTheme}>
        

            <Box className="populaires">
                <Typography variant="h4" className='titre'>
                    Les Plus Populaires:
                </Typography>
                <PopularSeriesCorridor />
            </Box>
            <ListWithFilters />
        </ThemeProvider>

    );
}

export default ListPage;
