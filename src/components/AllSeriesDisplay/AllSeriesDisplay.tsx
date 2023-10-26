import React, { useEffect, useState } from 'react';
import { Show, fetchAllSeriesFromTMDb, fetchPopularSeriesFromTrakt } from '../../services/seriesService';
import {
    Box,
    Button,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Rating,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

interface AllSeriesDisplayProps {
    searchQuery: string;
}

const AllSeriesDisplay: React.FC<AllSeriesDisplayProps> = ({ searchQuery }) => {
    const [series, setSeries] = useState<Show[]>([]);
    const [page, setPage] = useState<number>(1);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedSeries, setSelectedSeries] = useState<Show | null>(null);
    const limit = 10;

    useEffect(() => {
        const fetchSeries = async () => {
            const fetchedSeries = await fetchPopularSeriesFromTrakt(page, limit, searchQuery);
            setSeries(fetchedSeries);
        };

        fetchSeries();
    }, [page, searchQuery]);

    const handleOpen = (serie: Show) => {
        setSelectedSeries(serie);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box>
            <Box display="flex" flexWrap="wrap" gap={2}>
                {series.map((serie, index) => (
                    <Card key={index} style={{ maxWidth: '300px' }} onClick={() => handleOpen(serie)}>
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
                                Genres: {serie.genres.join(', ')}
                            </Typography>
                            <Box component="fieldset" borderColor="transparent">
                                <Typography component="legend">Rating:</Typography>
                                <Rating name="read-only" value={serie.rating / 2} readOnly precision={0.5} />
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Dialog open={open} onClose={handleClose}>
                {selectedSeries && (
                    <>
                        <DialogTitle>{selectedSeries.title}</DialogTitle>
                        <DialogContent>
                            <CardMedia
                                component="img"
                                alt={selectedSeries.title}
                                height="auto"
                                width="70%"
                                image={selectedSeries.poster}
                            />
                            <Typography variant="h6">{selectedSeries.title}</Typography>
                            <Typography variant="subtitle1">{selectedSeries.synopsis}</Typography>
                            <Typography variant="subtitle2">
                                Acteurs: {selectedSeries.actors?.join(', ')}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Fermer
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            <Box mt={3} display="flex" justifyContent="center">
                <Button onClick={() => setPage(prev => Math.max(prev - 1, 1))}>Précédent</Button>
                <Button onClick={() => setPage(prev => prev + 1)}>Suivant</Button>
            </Box>
        </Box>
    );
};

export default AllSeriesDisplay;
