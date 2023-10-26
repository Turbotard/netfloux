import React, { useEffect, useState } from 'react';
import { Show, fetchAllSeriesFromTMDb, fetchPopularSeriesFromTrakt } from '../../services/seriesService';
import { Box, Button, Typography, Card, CardMedia, CardContent } from '@mui/material';

interface AllSeriesDisplayProps {
    searchQuery: string;
}

const AllSeriesDisplay: React.FC<AllSeriesDisplayProps> = ({ searchQuery }) => {
    const [series, setSeries] = useState<Show[]>([]);
    const [page, setPage] = useState<number>(1);
    const limit = 10;

    useEffect(() => {
        const fetchSeries = async () => {
            const fetchedSeries = await fetchPopularSeriesFromTrakt(page, limit, searchQuery);
            setSeries(fetchedSeries);
        };

        fetchSeries();
    }, [page, searchQuery]);

    return (
        <Box>
            <Box display="flex" flexWrap="wrap" gap={2}>
                {series.map((serie, index) => (
                    <Card key={index} style={{ maxWidth: '300px' }}>
                        <CardMedia
                            component="img"
                            alt={serie.title}
                            height="auto"
                            width="70%"
                            image={serie.poster}
                        />
                        <CardContent>
                            <Typography variant="h6" noWrap>
                                {serie.title}
                            </Typography>
                            <Typography variant="subtitle1">
                                Rating: {serie.rating}
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