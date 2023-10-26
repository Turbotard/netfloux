import React, { useEffect, useState } from 'react';
import { fetchAllSeriesFromTrakt } from '../../services/seriesService';
import { Box, Button, Typography, Card, CardMedia, CardContent } from '@mui/material';

const AllSeriesDisplay: React.FC = () => {
    const [series, setSeries] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const limit = 10; // Nombre d'éléments par page

    useEffect(() => {
        const fetchSeries = async () => {
            const fetchedSeries = await fetchAllSeriesFromTrakt(page, limit);
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
                        alt={serie.show.title}
                        height="auto"
                        width="70%"
                        image={serie.show.image}
                    />
                    <CardContent>
                        <Typography variant="h6" noWrap>
                            {serie.show.title}
                            nombre d'épisodes :{serie.episode.number}
                            nombre de saisons :{serie.episode.season}
                        </Typography>
                    </CardContent>
                </Card>
            ))}

            </Box>
            <Box mt={3} display="flex" justifyContent="center">
                <Button onClick={() => setPage(prev => Math.max(prev - 1, 1))}>Précédent</Button>
                <Button onClick={() => setPage(prev => prev + 1)}>Suivant</Button>
            </Box>
        </Box>
    );
};

export default AllSeriesDisplay;