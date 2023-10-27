import React, { useEffect, useState } from 'react';
import { fetchAllGenresFromTrakt } from '../../services/seriesService';
import { Card, CardMedia, Typography, Button, Box, Modal } from '@mui/material';
import { Title } from '@mui/icons-material';

const ListGenre: React.FC = () => {
    const [genres, setGenres] = useState<string[]>([]);

    useEffect(() => {
        const testFetchGenres = async () => {
            const fetchedGenres = await fetchAllGenresFromTrakt();
            setGenres(fetchedGenres);
        };

        testFetchGenres();
    }, []);

    return (
        <Box>
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
        </Box>
    );
};

export default ListGenre;
