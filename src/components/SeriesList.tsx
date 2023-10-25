import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';

interface shows {
    title: string;
    year: number;
    ids: {
        trakt: number;
    };
}

const SeriesList: React.FC = () => {
    const [series, setSeries] = useState<shows[]>([]);
    const [error, setError] = useState<string | null>(null);
    const CLIENT_ID = process.env.TRAKT_API_CLIENT_ID;

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const response = await fetch('https://cors-anywhere.herokuapp.com/https://api.trakt.tv/shows/popular', {
                    headers: {
                        'Content-Type': 'application/json',
                        'trakt-api-version': '2',
                        'trakt-api-key': CLIENT_ID || ''
                    }
                });

                const rawResponse = await response.text();
                console.log("Raw API Response:", rawResponse);

                if (!response.ok) {
                    throw new Error(`Erreur: ${response.statusText}`);
                }

                const data: shows[] = JSON.parse(rawResponse);
                setSeries(data);

            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Une erreur est survenue lors du chargement des données.');
                }
            }
        };

        fetchSeries();
    }, [CLIENT_ID]);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Liste des séries populaires :
            </Typography>
            {error ? (
                <Typography color="error">
                    Erreur lors du chargement : {error}
                </Typography>
            ) : (
                <List component="nav" aria-label="main series list">
                    {series.map((shows) => (
                        <ListItem key={shows.ids.trakt} >
                            <ListItemText primary={`${shows.title} (${shows.year})`} />
                            <Divider />
                        </ListItem>
                    ))}
                </List>
            )}
        </div>
    );
}

export default SeriesList;
