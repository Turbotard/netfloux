import React, { useState, useEffect } from 'react';
import { Card, CardMedia, Typography, Button, Box, Modal, CardContent, Rating } from '@mui/material';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { CloseSharp } from '@mui/icons-material';
import { Show, fetchPopularSeriesFromTrakt } from '../../services/seriesService';
import './PopularSeriesCorridor.css';
import StarIcon from '@mui/icons-material/Star';

const PopularSeriesCorridor: React.FC = () => {
    const [series, setSeries] = useState<Show[]>([]);
    const [startIndex, setStartIndex] = useState(0);
    const [selectedSeries, setSelectedSeries] = useState<Show | null>(null);

    useEffect(() => {
        const getSeries = async () => {
            const fetchedSeries = await fetchPopularSeriesFromTrakt();
            console.log("Séries récupérées:", fetchedSeries);
            setSeries(fetchedSeries);
        };

        getSeries();
    }, []);

    const handleNext = () => {
        if (startIndex + 5 < series.length) {
            setStartIndex(prev => prev + 5);
        }
    };

    const handlePrevious = () => {
        if (startIndex > 0) {
            setStartIndex(prev => prev - 5);
        }
    };

    const openSeriesDetails = (selectedShow: Show) => {
        setSelectedSeries(selectedShow);
    };

    const closeSeriesDetails = () => {
        setSelectedSeries(null);
    };

    return (
        <Box className="carousel-container">
            <Button className="carousel-button" onClick={handlePrevious} disabled={startIndex === 0}>
                <ArrowBackIos />
            </Button>

            <Box className="carousel">
                {series.slice(startIndex, startIndex + 5).map((show) => (
                    <Card key={show.title} className="card">
                        <CardMedia
                            component="img"
                            alt={show.title}
                            height="400"
                            image={show.poster}
                            onClick={() => openSeriesDetails(show)}

                        />
                        <CardContent className='card-description'>

                            <Typography variant="h6" noWrap>
                                {show.title}
                            </Typography>

                            <Typography variant="subtitle1">
                                Genres:
                                <br />
                                <Box className="card-d">
                                    {show.genres.join(', ')}
                                </Box>
                            </Typography>

                            <Box component="fieldset" borderColor="transparent">
                                <Typography component="legend">Rating:</Typography>
                                <Rating name="read-only" value={show.rating / 2} readOnly precision={0.5} className='rating' />
                            </Box>

                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Button className="carousel-button" onClick={handleNext} disabled={startIndex + 5 >= series.length}>
                <ArrowForwardIos />
            </Button>

            {/* Pop-up des détails de la série */}
            <Modal open={!!selectedSeries} onClose={closeSeriesDetails}>
                <Box className="series-details">
                    <Button className="popup-close-button" onClick={closeSeriesDetails}>
                        <CloseSharp />
                    </Button>
                    <Box className="popup-header">
                        <img src={selectedSeries?.poster} alt={selectedSeries?.title} />
                        <Typography variant="h5">{selectedSeries?.title}</Typography>
                    </Box>
                    <Box className="popup-body">
                        <Box className="popup-description">
                            <Typography>Genre: {selectedSeries?.genres.join(", ")}</Typography>
                            <Typography>Note: {selectedSeries?.rating} / 10</Typography>
                            <Typography>Synopsis: {selectedSeries?.synopsis}</Typography>
                        </Box>
                        <Box className="popup-similar">
                            {/* Ajoutez ici la liste des séries similaires */}
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default PopularSeriesCorridor;
