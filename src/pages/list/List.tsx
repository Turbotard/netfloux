import React, { useEffect, useState } from 'react';
import { fetchAllGenresFromTrakt } from '../../services/seriesService';
import { Typography, Box, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import Navbar from '../../components/navbar/Navbar';
import PopularSeriesCorridor from '../../components/seriesCorridor/PopularSeriesCorridor';

const ListPage: React.FC = () => {
    const [genres, setGenres] = useState<string[]>([]);

    useEffect(() => {
        const testFetchGenres = async () => {
            const fetchedGenres = await fetchAllGenresFromTrakt();
            setGenres(fetchedGenres);
        };

        testFetchGenres();
    }, []);
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
            <Typography variant="h4" component="div" gutterBottom>
                Liste des Genres
            </Typography>
            <Box>
                {genres.map((genre, index) => (
                    <Typography key={index} variant="body1" component="div" gutterBottom>
                        {genre}
                    </Typography>
                ))}
            </Box>
        </ThemeProvider>
    );
};

export default ListPage;