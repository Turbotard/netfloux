import { Auth, UserCredential } from "firebase/auth";
import { auth, firestore } from "../db/db";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from '../types/usertypes'; 
import '../css/signup.css'
import Typography from '@mui/material/Typography';
import { ThemeProvider } from "styled-components";
import { Box, Button, CssBaseline, Grid, TextField, createTheme } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";

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
        const userRef = collection(firestore, "users");
        if (auth.currentUser) {
          const userDoc = await addDoc(userRef, {
            id: auth.currentUser.uid,
            email: auth.currentUser.email,
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
    // <section>
    //   <div className="signup">
    //     <div className="SignUp">
    //         <h1>Inscription</h1>
    //         <form onSubmit={handleSubmit} className="formSignUp">
    //           <input name="email" type="email" placeholder="Email" />
    //           <br />
    //           <input name="password" type="password" placeholder="Password" />
    //           <br />
    //           <button type="submit">Inscription</button>
    //         </form>
    //         <button onClick={() => history("/")}>Retour à la connexion</button>
    //       </div>
    //   </div>
     
    // </section>


<ThemeProvider theme={defaultTheme}>
<Grid container component="main" sx={{ height: '100vh' }}>
  <CssBaseline />
  <Grid item xs={12} sm={8} md={5} sx={{backgroundColor:'black'}}>
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5" sx={{color:'white'}}>
        Sign Up
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
          sx={{ mt: 3, mb: 2, backgroundColor:'red'}}
        >
          Sign Up
        </Button>
        <Grid container>
          {/* <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid> */}
          <Grid item>
            <Link to="/login">
              {"Alreay Have An Account? Sign In"}
            </Link>
          </Grid>
        </Grid>
        {/* <Copyright sx={{ mt: 5 }} /> */}
      </Box>
    </Box>
  </Grid>
  <Grid
    item
    xs={false}
    sm={4}
    md={7}
    sx={{
      backgroundImage: 'url(https://assets.nflxext.com/ffe/siteui/vlv3/a73c4363-1dcd-4719-b3b1-3725418fd91d/ef710c60-45ca-4ff6-9133-abd76333d090/FR-fr-20231016-popsignuptwoweeks-perspective_alpha_website_large.jpg)',
      backgroundRepeat: 'no-repeat',
      backgroundColor: (t) =>
        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  />
</Grid>
</ThemeProvider>

  );
};

export default SignUp;
