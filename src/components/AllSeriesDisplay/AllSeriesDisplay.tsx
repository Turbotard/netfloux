import React, { useEffect, useState } from "react";
import {
  Show,
  addToFavorites,
  fetchAllSeriesFromTMDb,
} from "../../services/seriesService";
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
  Grid,
} from "@mui/material";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore } from "../../db/db";
import { Auth, User, getAuth, onAuthStateChanged } from "@firebase/auth";
import { useNavigate } from "react-router";
import HeartIcon from "@mui/icons-material/Favorite";
import "./AllSeriesDisplay.css";

interface AllSeriesDisplayProps {
  searchQuery: string;
}

const AllSeriesDisplay: React.FC<AllSeriesDisplayProps> = ({ searchQuery }) => {
  const [series, setSeries] = useState<Show[]>([]);
  const [page, setPage] = useState<number>(1);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedSeries, setSelectedSeries] = useState<Show | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const authInstance: Auth = getAuth();

  const limit = 10;

  useEffect(() => {
    const fetchUserRatingForSeries = async (
      uid: string,
      seriesList: Show[]
    ) => {
      const ratingsPromises = seriesList.map(async (serie) => {
        const docId = `${uid}_${serie.id}`;
        const evalDocRef = doc(firestore, "eval", docId);
        const docSnap = await getDoc(evalDocRef);
        return docSnap.exists() ? docSnap.data().rating : null;
      });

      return Promise.all(ratingsPromises);
    };

    const fetchSeries = async () => {
      const fetchedSeries = await fetchAllSeriesFromTMDb(
        page,
        limit,
        searchQuery
      );

      if (user) {
        const userRatings = await fetchUserRatingForSeries(
          user.uid,
          fetchedSeries
        );
        const seriesWithRatings = fetchedSeries.map((serie, index) => ({
          ...serie,
          userRating: userRatings[index],
        }));

        setSeries(seriesWithRatings);
      } else {
        setSeries(fetchedSeries);
      }
    };

    const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchSeries();
      } else {
        setUser(null);
        navigate("/login");
      }
    });

    fetchSeries();
    return () => {
      unsubscribe();
    };
  }, [authInstance, navigate, page, searchQuery, user]);

  const handleOpen = async (serie: any) => {
    if (user) {
      const docId = `${user.uid}_${serie.id}`;
      const evalDocRef = doc(firestore, "eval", docId);
      const docSnap = await getDoc(evalDocRef);

      if (docSnap.exists()) {
        setRatingValue(docSnap.data().rating);
      } else {
        setRatingValue(0);
      }
    }

    setSelectedSeries(serie);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRatingChange = (
    event: React.ChangeEvent<{}>,
    newValue: number | null
  ) => {
    setRatingValue(newValue as number);
  };
  const formatSeriesName = (name: string) => {
    return name.replace(/[^a-zA-Z0-9]/g, "_");
  };
  const handleSendRating = async () => {
    if (!user) return alert("Please log in to rate this series!");

    const docId = `${user.uid}_${formatSeriesName(
      selectedSeries?.title || ""
    )}`;
    const evalData = {
      userId: user.uid,
      userEmail: user.email,
      seriesName: selectedSeries?.title,
      rating: ratingValue,
    };

    const evalDocRef = doc(firestore, "eval", docId);
    try {
      await setDoc(evalDocRef, evalData, { merge: true });
      alert("Your rating has been successfully sent!");
      handleClose();
    } catch (error) {
      console.error("Error while sending the rating: ", error);
      alert("An error occurred. Please try again.");
    }
  };
  const handleFavoriteClick = async () => {
    if (!user) {
      alert("Please log in to add this series to your favorites!");
      return;
    }

    try {
      await addToFavorites(user.uid, selectedSeries?.title || "");
      alert("Series added to your favorites!");
    } catch (error) {
      alert(
        "An error occurred while adding to favorites. Please try again."
      );
    }
  };

  return (
    <Box>
      <Box display="flex" flexWrap="wrap" gap={2}>
        {series.map((serie, index) => (
          <Card
            key={index}
            style={{ maxWidth: "300px" }}
            onClick={() => handleOpen(serie)}
            className="card"
          >
            <CardMedia
              component="img"
              alt={serie.title}
              height="100%"
              width="70%"
              image={serie.poster}
            />
            <CardContent className="card-all-description">
              <Typography className="title">{serie.title}</Typography>
              <Typography variant="subtitle1">
                Genres:
                <Box className="card-d">{serie.genres.join(", ")}</Box>
              </Typography>
              <Box component="fieldset" borderColor="transparent">
                <Typography component="legend">Rating:</Typography>
                <Rating
                  name="read-only"
                  value={serie.rating / 2}
                  readOnly
                  precision={0.5}
                  className="rating"
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={handleClose}>
        {selectedSeries && (
          <>
            <Grid className="background-dia">
              <Box className="fav">
                <DialogTitle>{selectedSeries.title}</DialogTitle>
                <Button onClick={handleFavoriteClick}>
                  <HeartIcon className="star" />
                </Button>
              </Box>

              <DialogContent>
                <CardMedia
                  component="img"
                  alt={selectedSeries.title}
                  height="auto"
                  width="70%"
                  image={selectedSeries.poster}
                />
                <Box className="detail">
                  <Box className="details">
                    <Typography variant="h6">{selectedSeries.title}</Typography>
                    <Typography variant="subtitle1">
                      {selectedSeries.synopsis}
                    </Typography>
                    <Typography variant="subtitle2">
                      Actors: {selectedSeries.actors?.join(", ")}
                    </Typography>
                  </Box>
                </Box>


                <hr />
                <Box className="rate">
                <Box component="fieldset" borderColor="#343434" className="rate-star">
                  <Typography component="legend">Rate this series:</Typography>
                  <Rating
                    name="rating-value"
                    value={ratingValue}
                    onChange={handleRatingChange}
                    className="note"
                  />
                </Box>
                </Box>
   
                <hr />
                <Typography variant="subtitle2" className="saison-titre">
                  <Box className="saison-titre-baxkground">
                    Nombre de saisons: {selectedSeries.numberOfSeasons}
                  </Box>

                </Typography>
                <hr />
                {selectedSeries.seasons && selectedSeries.seasons.map((season) => (
                  <Typography variant="subtitle2" key={season.seasonNumber} className='saison'>
                    <Box className="episode">
                      <hr />
                      Saison {season.seasonNumber}: {season.episodeCount} épisodes
                      <hr />
                    </Box>

                  </Typography>
                ))}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} className="button-all">
                  Close
                </Button>
                <Button onClick={handleSendRating} className="button-note">
                  Send Rating
                </Button>
              </DialogActions>
            </Grid>
          </>
        )}
      </Dialog>

      <Box mt={3} display="flex" justifyContent="center">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="button-all"
        >
          Previous
        </Button>
        <Button
          onClick={() => setPage((prev) => prev + 1)}
          className="button-all"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default AllSeriesDisplay;
