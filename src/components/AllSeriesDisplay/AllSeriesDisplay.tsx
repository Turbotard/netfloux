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
import StarIcon from "@mui/icons-material/Star";
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
    return name.replace(/[^a-zA-Z0-9]/g, "_"); // Remplace les caractères non-alphanumériques par des underscores
  };
  const handleSendRating = async () => {
    if (!user) return alert("Veuillez vous connecter pour noter cette série!");

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
      await setDoc(evalDocRef, evalData, { merge: true }); // use merge: true to update or create
      alert("Votre note a été envoyée avec succès!");
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'envoi de la note: ", error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    }
  };
  const handleFavoriteClick = async () => {
    if (!user) {
      alert("Veuillez vous connecter pour ajouter cette série à vos favoris!");
      return;
    }
    
    try {
      await addToFavorites(user.uid, selectedSeries?.title || "");
      alert("Série ajoutée à vos favoris!");
      
    } catch (error) {
      alert(
        "Une erreur s'est produite lors de l'ajout aux favoris. Veuillez réessayer."
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
              height="auto"
              width="70%"
              image={serie.poster}
            />
            <CardContent className="card-description">
              <Typography className="title">
                {serie.title}
              </Typography>
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

      <Dialog open={open} onClose={handleClose} >
        {selectedSeries && (
          <>
          <Grid  className="background-dia">
          <Box className="fav">
              <DialogTitle >{selectedSeries.title}</DialogTitle>
              <Button 
              onClick={handleFavoriteClick}
              >
                <StarIcon className="star" />
              </Button>
            </Box>

            <DialogContent >
              <CardMedia
                component="img"
                alt={selectedSeries.title}
                height="auto"
                width="70%"
                image={selectedSeries.poster}
              />
              <Box className="details">
              <Typography variant="h6">{selectedSeries.title}</Typography>
              <Typography variant="subtitle1">
                {selectedSeries.synopsis}
              </Typography>
              <Typography variant="subtitle2">
                Acteurs: {selectedSeries.actors?.join(", ")}
              </Typography>
              </Box>
              
              <Box component="fieldset" borderColor="#343434">
                <Typography component="legend">Noter cette série:</Typography>
                <Rating
                  name="rating-value"
                  value={ratingValue}
                  onChange={handleRatingChange}
                  className="note"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} className="button-all">
                Fermer
              </Button>
              <Button onClick={handleSendRating} className="button-note">
                Envoyer la note
              </Button>
            </DialogActions>
          </Grid>
           
          </>
        )}
      </Dialog>

      <Box mt={3} display="flex" justifyContent="center">
        <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} className="button-all">
          Précédent
        </Button>
        <Button onClick={() => setPage((prev) => prev + 1)} className="button-all">Suivant</Button>
      </Box>
    </Box>
  );
};

export default AllSeriesDisplay;
