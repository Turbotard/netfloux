import React, { useState } from 'react';
import { Typography, Box, createTheme, TextField } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import ListGenre from '../../components/ListGenre/ListGenre';
import Navbar from '../../components/navbar/Navbar';
import PopularSeriesCorridor from '../../components/seriesCorridor/PopularSeriesCorridor';
import AllSeriesDisplay from '../../components/AllSeriesDisplay/AllSeriesDisplay';
const ListPage: React.FC = () => {
    const defaultTheme = createTheme();
    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
        <ThemeProvider theme={defaultTheme}>
            <Navbar/>
            <Box className="populaires">
                <Typography variant="h4" className='titre'>
                    Les Plus Populaires:
                </Typography>
                <PopularSeriesCorridor />
            </Box>
            <Box mt={3} display="flex" justifyContent="center">
                <TextField 
                    variant="outlined" 
                    placeholder="Recherchez une série" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Box>
            <Box>
                <AllSeriesDisplay searchQuery={searchQuery}/>
            </Box>
        </ThemeProvider>
    );
};

export default ListPage;