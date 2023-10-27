import React, { useEffect, useState } from "react";
import {
  Show,
  fetchAllSeriesFromTMDb,
  addToFavorites,
  removeFromFavorites,
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
} from "@mui/material";
import { doc, getDoc, arrayRemove } from "firebase/firestore";
import { firestore } from "../../db/db";
import { Auth, User, getAuth, onAuthStateChanged } from "@firebase/auth";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";

const Suivis: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [series, setSeries] = useState<Show[]>([]);
  const [page, setPage] = useState<number>(1);
  const defaultTheme = createTheme();
  const authInstance: Auth = getAuth();
  const [ratingValue, setRatingValue] = useState<number>(0);
  const navigate = useNavigate();
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
            const userFavorites = userDoc.data().fav;
            const allSeries = await fetchAllSeriesFromTMDb(page, 10);
            const filteredSeries = allSeries.filter((serie) =>
              userFavorites.includes(serie.title)
            );
            setSeries(filteredSeries);
          }
        } else {
          navigate("/login");
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
        console.error(
          "Error removing serie from favorites in firestore",
          error
        );
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Navbar />
      <Grid className="background">
        {series.map((serie, index) => (
          <Card key={index} style={{ maxWidth: "300px" }} className="card">
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
                Genres : 
                <Box className="card-d">{serie.genres.join(", ")}</Box>
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRemoveFromFavorites(serie.title)}
              >
                unfollow
              </Button>
            </CardContent>
          </Card>
        ))}
        <Box mt={3} display="flex" justifyContent="center">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="button"
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            className="button"
          >
            Next
          </Button>
        </Box>
      </Grid>
    </ThemeProvider>
  );
};

export default Suivis;
