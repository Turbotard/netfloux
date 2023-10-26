import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  sendPasswordResetEmail,
  Auth,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import "./login.css";
import { useUser } from "../../types/usertypes";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "styled-components";
import {
  Box,
  Button,
  CssBaseline,
  Grid,
  TextField,
  createTheme,
} from "@mui/material";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { firestore } from "../../db/db";

const LoginPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const authInstance: Auth = getAuth();
  const { user, setUser } = useUser();

  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setAuthing] = useState(false);
  const [, setError] = useState<string | null>(null);

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser({ uid: user.uid, email: user.email! });

      const userRef = doc(firestore, "users", user.uid);

      const userDocSnap = await getDoc(userRef);

      if (!userDocSnap.exists()) {
        await setDoc(userRef, {
          id: user.uid,
          email: user.email!,
        });
      }

      navigate("/profile");
    } catch (error) {
      console.error("Erreur de connexion avec Google :", error);
      setError("Une erreur s'est produite lors de la connexion.");
    }
  };

  const handleSignInWithEmail = async () => {
    setAuthing(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUser({ uid: auth.currentUser!.uid, email: email });
      navigate("/profile");
    } catch (error: any) {
      console.error("Erreur de connexion avec e-mail :", error);
      if (error && error.code === "auth/invalid-login-credentials") {
        setError(
          "Les informations de connexion sont invalides. Vérifiez votre e-mail et votre mot de passe."
        );
      } else if (error && error.code === "auth/user-not-found") {
        setError("Aucun utilisateur avec cet e-mail n'a été trouvé.");
      } else if (error && error.code === "auth/wrong-password") {
        setError("Le mot de passe est incorrect.");
      } else {
        setError("Une erreur s'est produite lors de la connexion.");
      }
      setAuthing(false);
    }
  };
  const handleResetPassword = () => {
    if (email) {
      sendPasswordResetEmail(authInstance, email)
        .then(() => {
          alert("Lien de réinitialisation du mot de passe envoyé!");
          setOpen(false); // Fermez la boîte de dialogue après l'envoi
        })
        .catch((error) => {
          console.error(
            "Erreur lors de l'envoi du lien de réinitialisation:",
            error
          );
          alert("Erreur lors de l'envoi du lien de réinitialisation.");
        });
    }
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
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
        />
        <Grid item xs={12} sm={8} md={5} sx={{ backgroundColor: "black" }}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "tansparent",
            }}
          >
            <Typography component="h1" variant="h5" sx={{ color: "white" }}>
              Sign in
            </Typography>
            <Box sx={{ mt: 1 }}>
              <TextField
                color="info"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                className="textfield"
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "red" }}
                onClick={handleSignInWithEmail}
              >
                Sign In
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "red" }}
                onClick={handleSignInWithGoogle}
              >
                Sign In With Google
              </Button>
            </Box>
            <Grid container>
              <Grid item>
                <Link onClick={() => setOpen(true)} to={""}>
                  {"Forgot Password?"}
                </Link>
              </Grid>
              <Grid item>
                <Link to="/signup">{"Don't have an account? Sign Up"}</Link>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: "black", // Fond noir pour la boîte de dialogue
          },
        }}
      >
        <DialogTitle style={{ color: "white" }}>
          Réinitialiser le mot de passe
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: "white" }}>
            Pour réinitialiser votre mot de passe, veuillez entrer votre adresse
            e-mail.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Adresse e-mail"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              style: {
                color: "white", // Texte en blanc pour le champ
              },
            }}
            InputLabelProps={{
              style: {
                color: "white", // Texte en blanc pour le label
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            style={{ backgroundColor: "red", color: "white" }} // Bouton rouge avec texte en blanc
          >
            Annuler
          </Button>
          <Button
            onClick={handleResetPassword}
            style={{ backgroundColor: "red", color: "white" }} // Bouton rouge avec texte en blanc
          >
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default LoginPage;
