import React, { useEffect, useState } from "react";
import {
    Show,
    addToFavorites,
    fetchAllSeriesFromTMDb,
    fetchPopularSeriesFromTrakt,
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
    ThemeProvider,
    createTheme,
    Grid,
} from "@mui/material";
import { doc, setDoc, getDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "../../db/db";
import { Auth, User, getAuth, onAuthStateChanged } from "@firebase/auth";
import { useNavigate } from "react-router";
import StarIcon from "@mui/icons-material/Star";
import "./suivis.css";
import { PassThrough } from "stream";
import Navbar from "../../components/navbar/Navbar";

interface AllSeriesDisplayProps {
    searchQuery: string;
}

const Suivis: React.FC = () => {
    const [page, setPage] = useState<number>(1);
    const defaultTheme = createTheme();







    return (
        <ThemeProvider theme={defaultTheme}>
            <Navbar />
            <Grid className="background">
            {/* {series.map((serie, index) => ( */}
            <Card
            // key={index}
            // style={{ maxWidth: "300px" }}
            // onClick={() => handleOpen(serie)}
            // className="card"
          >
            <CardMedia
            //   component="img"
            //   alt={serie.title}
            //   height="auto"
            //   width="70%"
            //   image={serie.poster}
            />
            <CardContent className="card-description">
              <Typography className="title">
                {/* {serie.title} */}
              </Typography>
              <Typography variant="subtitle1">
                Genres: 
                <Box className="card-d">
                    {/* {serie.genres.join(", ")} */}
                    </Box>
              </Typography>
              <Box component="fieldset" borderColor="transparent">
                <Typography component="legend">Rating:</Typography>
                <Rating
                //   name="read-only"
                //   value={serie.rating / 2}
                //   readOnly
                //   precision={0.5}
                //   className="rating"
                />
              </Box>
            </CardContent>
          </Card>
          {/* ))} */}

          {/* ici met les dialog pour afficher la fiche quand tu cliaue sur l'image  */}
                <Box mt={3} display="flex" justifyContent="center">
                    <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} className="button">
                        Précédent
                    </Button>
                    <Button onClick={() => setPage((prev) => prev + 1)} className="button">Suivant</Button>
                </Box>
            </Grid>
        </ThemeProvider>
    );
};


export default Suivis;
