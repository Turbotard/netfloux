import React, { useEffect, useState } from "react";
import {
  Auth,
  getAuth,
  onAuthStateChanged,
  signOut,
  User,
  updateEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";
import "./profile.css";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "styled-components";
import {
  Box,
  Button,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  createTheme,
} from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import { firestore } from "../../db/db";

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [updateStatus, setUpdateStatus] = useState<
    "IDLE" | "PENDING" | "SUCCESS" | "ERROR"
  >("IDLE");
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
  const handleSignOut = () => {
    signOut(authInstance)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion: ", error);
      });
  };

  const handleSendEmailVerification = () => {
    if (user) {
      sendEmailVerification(user)
        .then(() => {
          alert("E-mail de vérification envoyé!");
        })
        .catch((error) => {
          console.error(
            "Erreur lors de l'envoi de l'e-mail de vérification: ",
            error
          );
          alert("Erreur lors de l'envoi de l'e-mail de vérification.");
        });
    }
  };

  const handleEmailUpdate = () => {
    if (user && newEmail) {
      setUpdateStatus("PENDING");
      updateEmail(user, newEmail)
        .then(() => {
          setUpdateStatus("SUCCESS");
          alert("Email mis à jour avec succès!");
          setUser(authInstance.currentUser);
        })
        .catch((error) => {
          setUpdateStatus("ERROR");
          console.error("Erreur lors de la mise à jour de l'e-mail: ", error);
          alert("Erreur lors de la mise à jour de l'e-mail.");
        });
    }
  };

  const handleSendPasswordResetEmail = () => {
    if (user && user.email) {
      sendPasswordResetEmail(authInstance, user.email)
        .then(() => {
          alert(
            "Lien de réinitialisation du mot de passe envoyé à votre e-mail!"
          );
        })
        .catch((error) => {
          console.error(
            "Erreur lors de l'envoi du lien de réinitialisation: ",
            error
          );
          alert("Erreur lors de l'envoi du lien de réinitialisation.");
        });
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
      } catch (error) {
        console.error("Erreur lors de la mise à jour des genres: ", error);
      }
    }
  };
  if (!user) return <p>Chargement...</p>;
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
            Profil:
          </Typography>
          <Typography component="p" variant="h5" sx={{ color: "white" }}>
            Email actuel: {user.email}
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            onChange={(e) => setNewEmail(e.target.value)}
          >
            Nouvel Email
          </TextField>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: "red" }}
            onClick={handleEmailUpdate}
          >
            {updateStatus === "PENDING"
              ? "Mise à jour..."
              : "Mettre à jour l'e-mail"}
          </Button>

          {!user.emailVerified && (
            <>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "red" }}
                onClick={handleSendEmailVerification}
              >
                Envoyer l'e-mail de vérification
              </Button>
              <Typography component="p" variant="h5" sx={{ color: "white" }}>
                Si vous n'avez pas reçu l'e-mail, veuillez vérifier votre
                dossier de spam.
              </Typography>
            </>
          )}
          {updateStatus === "SUCCESS" && <p>Email mis à jour avec succès!</p>}
          {updateStatus === "ERROR" && (
            <Typography component="p" variant="h5" sx={{ color: "white" }}>
              Erreur lors de la mise à jour de l'e-mail.
            </Typography>
          )}

          {user.emailVerified && (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "red" }}
              onClick={handleSendPasswordResetEmail}
            >
              Réinitialiser le mot de passe
            </Button>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: "red" }}
            onClick={handleSignOut}
          >
            Déconnexion
          </Button>
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
                checked={selectedGenres.includes("Science-Fiction")}
                onChange={handleGenreChange}
                name="Science-Fiction"
              />
            }
            label={<Typography color="white">Science-Fiction</Typography>}
          />
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

export default Profile;
