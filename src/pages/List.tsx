import React from 'react';
import SeriesList from '../components/SeriesList';
import ListWithFilters from '../components/ListWithFilters';
import { Typography } from '@mui/material';

const ListPage: React.FC = () => {
    return (
        <div>
            <Typography variant="h4" gutterBottom>
            </Typography>
            <SeriesList />

            <Typography variant="h4" gutterBottom style={{marginTop: '20px'}}>
                Liste avec filtres:
            </Typography>
            <ListWithFilters />
        </div>
    );
}

export default ListPage;
