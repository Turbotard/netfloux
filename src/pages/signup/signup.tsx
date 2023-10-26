import { Auth, UserCredential } from "firebase/auth";
import { auth, firestore } from "../../db/db";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../types/usertypes";
import "./signup.css";
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
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

const SignUp: React.FC = () => {
  const history = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;
  
    createUserWithEmailAndPassword(auth as Auth, email, password)
      .then(async (data: UserCredential) => {
        setUser({ uid: data.user.uid, email: data.user.email! });
        
        if (data.user.uid) { // s'assurer que l'uid existe
          const userDocRef = doc(firestore, "users", data.user.uid); // Créer une référence avec l'UID comme identifiant
          await setDoc(userDocRef, {
            id: data.user.uid,
            email: data.user.email,
          });
        }
        
        history("/profile");
      })
      .catch((err) => {
        alert(err.code);
      });
  };
  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} sx={{ backgroundColor: "black" }}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5" sx={{ color: "white" }}>
              Sign Up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
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
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "red" }}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item>
                  <Link to="/login">{"Alreay Have An Account? Sign In"}</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
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
      </Grid>
    </ThemeProvider>
  );
};

export default SignUp;
