import React from 'react';
import ListWithFilters from '../../components/listWithFilters/ListWithFilters';
import { Typography } from '@mui/material';
import PopularSeriesCorridor from '../../components/seriesCorridor/PopularSeriesCorridor';
import ListGenre from '../../components/ListGenre/ListGenre';

const ListPage: React.FC = () => {
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                <PopularSeriesCorridor />
            </Typography>
            <Typography variant="h4" gutterBottom style={{marginTop: '20px'}}>
                <ListGenre />
            </Typography>
            <ListWithFilters />
        </div>
    );
}

export default ListPage;
