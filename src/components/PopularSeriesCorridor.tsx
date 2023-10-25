import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Show, fetchPopularSeries } from '../services/seriesService';

const PopularSeriesCorridor: React.FC = () => {
    const [series, setSeries] = useState<Show[]>([]);

    useEffect(() => {
        const getSeries = async () => {
            const fetchedSeries = await fetchPopularSeries();
            console.log("Séries récupérées:", fetchedSeries);
            setSeries(fetchedSeries);
        };
        
        getSeries();
    }, []);    

    return (
        <div style={{ display: 'flex', overflowX: 'scroll', gap: '16px' }}>
            {series.map((shows) => (
                <Card key={shows.title} style={{ width: 250, marginRight: 20 }}>
                    <CardMedia
                        component="img"
                        alt={shows.title}
                        height="140"
                        image={shows.poster}
                    />
                    <CardContent>
                        <Typography variant="h6">{shows.title} ({shows.year})</Typography>
                        <Typography color="textSecondary">
                            Prochaine projection: {shows.nextShowingDate}
                        </Typography>
                        <Typography color="textSecondary">
                            Genre: {shows.genres}
                        </Typography>
                        <Typography color="textSecondary">
                            Note: {shows.rating}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default PopularSeriesCorridor;
