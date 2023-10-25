import React from 'react';
import ListWithFilters from '../components/ListWithFilters';
import { Typography } from '@mui/material';
import PopularSeriesCorridor from '../components/PopularSeriesCorridor';

const ListPage: React.FC = () => {
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                <PopularSeriesCorridor />
            </Typography>
            <Typography variant="h4" gutterBottom style={{marginTop: '20px'}}>
                Liste avec filtres:
            </Typography>
            <ListWithFilters />
        </div>
    );
}

export default ListPage;
