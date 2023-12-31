import React, { useEffect, useState } from "react";
import {
  Show,
  fetchAllSeriesFromTMDb,
  addToFavorites,
  removeFromFavorites,
  fetchSeriesDetailsByTitle,
} from "../../services/seriesService";
import {
  Box,
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
  ThemeProvider,
  createTheme,
  Grid,
  Rating,
  DialogContent,
  DialogActions,
  Dialog,
  DialogTitle,
} from "@mui/material";
import { doc, getDoc, arrayRemove } from "firebase/firestore";
import { firestore } from "../../db/db";
import { Auth, User, getAuth, onAuthStateChanged } from "@firebase/auth";
import Navbar from "../../components/navbar/Navbar";
import "./suivis.css";

const Suivis: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [series, setSeries] = useState<Show[]>([]);
  const [page, setPage] = useState<number>(1);
  const defaultTheme = createTheme();
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedSeries, setSelectedSeries] = useState<Show | null>(null);
  const authInstance: Auth = getAuth();
  const [userFavoritesTitles, setUserFavoritesTitles] = useState<string[]>([]);
  const PAGE_SIZE = 20;

  const handleRatingChange = (
    event: React.ChangeEvent<{}>,
    newValue: number | null
  ) => {
    setRatingValue(newValue as number);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      authInstance,
      async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          const userDocRef = doc(firestore, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userFavoritesTitles = userDoc.data().fav || [];
            setUserFavoritesTitles(userFavoritesTitles);

            const startIndex = (page - 1) * PAGE_SIZE;
            const currentFavoritesTitles = userFavoritesTitles.slice(
              startIndex,
              startIndex + PAGE_SIZE
            );

            const allSeries = await Promise.all(
              currentFavoritesTitles.map((title: any) =>
                fetchSeriesDetailsByTitle(title)
              )
            );
            setSeries(allSeries);
          }else{
            alert("Vous n'avez pas de séries favorites")
          }
        }
      }
    );
    return () => unsubscribe();
  }, [page]);

  const handleRemoveFromFavorites = async (seriesName: string) => {
    if (user) {
      try {
        await removeFromFavorites(user.uid, seriesName);
        setSeries((prevSeries) =>
          prevSeries.filter((serie) => serie.title !== seriesName)
        );
      } catch (error) {
        console.error("Error while remove from followed", error);
      }
    }
  };
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
  const handlePrevious = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };
  const canGoNext = page * PAGE_SIZE < userFavoritesTitles.length;

  return (
    <ThemeProvider theme={defaultTheme}>
      <Navbar />
      <Grid className="background">
        <Typography variant="h4" className="titre">
          Vos séries et films favoris :
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2} className="card-container">
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
                <Typography className="title">{serie.title}</Typography>
                <Typography variant="subtitle1">
                  Genres:{" "}
                  <Box component="span" className="card-d">
                    {serie.genres.join(", ")}
                  </Box>
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  className="button-delete"
                  onClick={() => handleRemoveFromFavorites(serie.title)}
                >
                  Unfollow
                </Button>
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
                </Box>
                <DialogContent>
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
                    <Typography component="legend">
                      Notez cette série
                    </Typography>
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
                </DialogActions>
              </Grid>
            </>
          )}
        </Dialog>

        <Box className="boutons">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="button-suivis"
          >
            Précédent
          </Button>
          <Button
            onClick={handleNext}
            className="button-suivis"
            disabled={!canGoNext}
          >
            Suivant
          </Button>
        </Box>
      </Grid>
    </ThemeProvider>
  );
};

export default Suivis;
