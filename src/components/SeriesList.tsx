import React, { useState, useEffect } from 'react';

interface Show {
    title: string;
    year: number;
    ids: {
        trakt: number;
    };
}

const SeriesList: React.FC = () => {
    const [series, setSeries] = useState<Show[]>([]);
    const [error, setError] = useState<string | null>(null);
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

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

                const data: Show[] = JSON.parse(rawResponse);
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
            <h2>Liste des séries populaires :</h2>
            {error ? (
                <p>Erreur lors du chargement : {error}</p>
            ) : (
                <ul>
                    {series.map((show) => (
                        <li key={show.ids.trakt}>
                            {show.title} ({show.year})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SeriesList;
