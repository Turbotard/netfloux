import React, { useEffect, useState } from 'react';
import { fetchAllSeriesFromTMDb } from '../../services/seriesService';
import { Box, Button, Typography, Card, CardMedia, CardContent } from '@mui/material';

const AllSeriesDisplay: React.FC = () => {
    const [series, setSeries] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const limit = 10;

    useEffect(() => {
        const fetchSeries = async () => {
            const fetchedSeries = await fetchAllSeriesFromTMDb(page, limit);
            setSeries(fetchedSeries);
        };

        fetchSeries();
    }, [page]);
    
    return (
        <Box>
            <Box display="flex" flexWrap="wrap" gap={2}>
                {series.map((serie, index) => (
                <Card key={index} style={{ maxWidth: '300px' }}>
                    <CardMedia
                        component="img"
                        alt={serie.title}
                        height="auto"
                        width="100%"
                        image={serie.poster}
                    />
                    <CardContent>
                        <Typography variant="h6" noWrap>
                            {serie.title}
                        </Typography>
                        <Typography variant="subtitle1">
                            Genres: {serie.genres.join(', ')}
                        </Typography>
                        <Typography variant="subtitle1">
                            Première diffusion : {serie.releaseDate}
                        </Typography>
                    </CardContent>
                </Card>
                ))}
            </Box>

            {/* Pas de changements ici pour la pagination */}
            <Box mt={3} display="flex" justifyContent="center">
                <Button onClick={() => setPage(prev => Math.max(prev - 1, 1))}>Précédent</Button>
                <Button onClick={() => setPage(prev => prev + 1)}>Suivant</Button>
            </Box>
        </Box>
    );
};    

export default AllSeriesDisplay;
