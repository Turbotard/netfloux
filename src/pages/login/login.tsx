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

      navigate("/list");
    } catch (error) {
      console.error("Error when signing in with Google:", error);
      setError("An error occurred while signing in.");
    }
  };

  const handleSignInWithEmail = async () => {
    setAuthing(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUser({ uid: auth.currentUser!.uid, email: email });
      navigate("/list");
    } catch (error: any) {
      console.error("Error when signing in with email:", error);
      let errorMessage = "";
      if (error && error.code === "auth/invalid-login-credentials") {
        errorMessage =
          "Invalid login credentials. Please check your email and password.";
      } else if (error && error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email.";
      } else if (error && error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else {
        errorMessage = "An error occurred while signing in.";
      }
      setError(errorMessage);
      alert(errorMessage);
      setAuthing(false);
    }
  };

  const handleResetPassword = () => {
    if (email) {
      sendPasswordResetEmail(authInstance, email)
        .then(() => {
          alert("Password reset link sent!");
          setOpen(false);
        })
        .catch((error) => {
          console.error(
            "Error while sending password reset link:",
            error
          );
          alert("Error while sending password reset link.");
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
              backgroundColor: "transparent",
            }}
          >
            <Typography component="h1" variant="h5" sx={{ color: "white" }}>
              Sign in
            </Typography>
            <Box sx={{ mt: 1 }}>
              <TextField
                className="textfield"
                color="info"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                className="field"
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
                className="button-l"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "red" }}
                onClick={handleSignInWithEmail}
              >
                Sign In
              </Button>
              <Button
                className="button-l"
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
              <Grid item className="divlink">
                <Link onClick={() => setOpen(true)} to={""} className="link">
                  {"Forgot Password?"}
                </Link>
                <Link to="/signup" className="link">
                  {"Don't have an account? Sign Up"}
                </Link>
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
            backgroundColor: "black",
          },
        }}
      >
        <DialogTitle style={{ color: "white" }}>Reset Password </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: "white" }}>
            To reset your password, please enter your email address here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              style: {
                color: "white",
              },
            }}
            InputLabelProps={{
              style: {
                color: "white",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} className="button-l">
            Cancel
          </Button>
          <Button onClick={handleResetPassword} className="button-l">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default LoginPage;
