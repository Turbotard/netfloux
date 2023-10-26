import React, { useEffect, useState } from "react";
import {
  Auth,
  getAuth,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";
import "./genres.css";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "styled-components";
import {
  Box,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  createTheme,
} from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import { firestore } from "../../db/db";


const Genres: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const navigate = useNavigate();
  const authInstance: Auth = getAuth();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserGenres(currentUser.uid);
      } else {
        setUser(null);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate, authInstance]);

  const fetchUserGenres = async (uid: string) => {
    const db = getFirestore();
    const userDoc = doc(db, "users", uid);

    try {
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData && userData.genres) {
          setSelectedGenres(userData.genres);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des genres: ", error);
    }
  };
  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const genre = e.target.name;
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre);
      } else {
        return [...prev, genre];
      }
    });
  };
  const handleSaveGenres = async () => {
    if (user) {
      try {
        const userRef = doc(firestore, "users", user.uid);
        await setDoc(userRef, { genres: selectedGenres }, { merge: true });
        alert("Genres sauvegardés avec succès!");
        navigate("/profile");

      } catch (error) {
        console.error("Erreur lors de la mise à jour des genres: ", error);
      }
    }
  };
  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Navbar />
      <Grid
        sx={{
          backgroundImage: "url(/img/image-series.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box className="profil">
          <Typography component="h1" variant="h5" sx={{ color: "white" }}>
            Genres:
          </Typography>
          <Box className="genres">
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Action")}
                  onChange={handleGenreChange}
                  name="Action"
                />
              }
              label={<Typography color="white">Action</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Adventure")}
                  onChange={handleGenreChange}
                  name="Adventure"
                />
              }
              label={<Typography color="white">Adventure</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Animation")}
                  onChange={handleGenreChange}
                  name="Animation"
                />
              }
              label={<Typography color="white">Animation</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Anime")}
                  onChange={handleGenreChange}
                  name="Anime"
                />
              }
              label={<Typography color="white">Anime</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Comedy")}
                  onChange={handleGenreChange}
                  name="Comedy"
                />
              }
              label={<Typography color="white">Comedy</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Crime")}
                  onChange={handleGenreChange}
                  name="Crime"
                />
              }
              label={<Typography color="white">Crime</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Documentary")}
                  onChange={handleGenreChange}
                  name="Documentary"
                />
              }
              label={<Typography color="white">Documentary</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Donghua")}
                  onChange={handleGenreChange}
                  name="Donghua"
                />
              }
              label={<Typography color="white">Donghua</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Drama")}
                  onChange={handleGenreChange}
                  name="Drama"
                />
              }
              label={<Typography color="white">Drama</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Family")}
                  onChange={handleGenreChange}
                  name="Family"
                />
              }
              label={<Typography color="white">Family</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Fantasy")}
                  onChange={handleGenreChange}
                  name="Fantasy"
                />
              }
              label={<Typography color="white">Fantasy</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("History")}
                  onChange={handleGenreChange}
                  name="History"
                />
              }
              label={<Typography color="white">History</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Holiday")}
                  onChange={handleGenreChange}
                  name="Holiday"
                />
              }
              label={<Typography color="white">Holiday</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Horror")}
                  onChange={handleGenreChange}
                  name="Horror"
                />
              }
              label={<Typography color="white">Horror</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Music")}
                  onChange={handleGenreChange}
                  name="Music"
                />
              }
              label={<Typography color="white">Music</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Musical")}
                  onChange={handleGenreChange}
                  name="Musical"
                />
              }
              label={<Typography color="white">Musical</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Mystery")}
                  onChange={handleGenreChange}
                  name="Mystery"
                />
              }
              label={<Typography color="white">Mystery</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Romance")}
                  onChange={handleGenreChange}
                  name="Romance"
                />
              }
              label={<Typography color="white">Romance</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Science Fiction")}
                  onChange={handleGenreChange}
                  name="Science Fiction"
                />
              }
              label={<Typography color="white">Science Fiction</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Short")}
                  onChange={handleGenreChange}
                  name="Short"
                />
              }
              label={<Typography color="white">Short</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Sporting Event")}
                  onChange={handleGenreChange}
                  name="Sporting Event"
                />
              }
              label={<Typography color="white">Sporting Event</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Superhero")}
                  onChange={handleGenreChange}
                  name="Superhero"
                />
              }
              label={<Typography color="white">Superhero</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Suspense")}
                  onChange={handleGenreChange}
                  name="Suspense"
                />
              }
              label={<Typography color="white">Suspense</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Thriller")}
                  onChange={handleGenreChange}
                  name="Thriller"
                />
              }
              label={<Typography color="white">Thriller</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("War")}
                  onChange={handleGenreChange}
                  name="War"
                />
              }
              label={<Typography color="white">War</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGenres.includes("Western")}
                  onChange={handleGenreChange}
                  name="Western"
                />
              }
              label={<Typography color="white">Western</Typography>}
            />
          </Box>

          <br />
          <Button
            onClick={handleSaveGenres}
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: "red" }}
          >
            Sauvegarder les genres
          </Button>
        </Box>
      </Grid>
    </ThemeProvider>
  );
};

export default Genres;
