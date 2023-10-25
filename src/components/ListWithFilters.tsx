import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

interface Show {
    title: string;
    year: number;
    ids: {
        trakt: number;
    };
}

const ListWithFilters: React.FC = () => {
    const [series] = useState<Show[]>([]);
    // Vous pouvez ajouter d'autres états ici pour les filtres.

    useEffect(() => {
        // Faites la requête API avec des filtres ici.
        // Pour cet exemple, je vais réutiliser la requête de la liste populaire.
    }, []);

    return (
        <List component="nav" aria-label="filtered series list">
            {series.map((show) => (
                <ListItem key={show.ids.trakt} button>
                    <ListItemText primary={`${show.title} (${show.year})`} />
                </ListItem>
            ))}
        </List>
    );
}

export default ListWithFilters;
