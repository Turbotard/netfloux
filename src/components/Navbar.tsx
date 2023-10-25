import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import SignupIcon from '@mui/icons-material/PersonAdd';
import HomeIcon from '@mui/icons-material/Home';
import ProfileIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const Routes = [
    { path: '', icon: <HomeIcon />, name: 'Home' },
    { path: 'login', icon: <LoginIcon />, name: 'Log in' },
    { path: 'signup', icon: <SignupIcon />, name: 'Signup' },
    { path: 'profile', icon: <ProfileIcon />, name: 'Profil Utilisateur' },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        {Routes.map((route) => (
          <Button
            key={route.name}
            startIcon={route.icon}
            component={Link}
            to={`/${route.path}`}
            color="inherit"
          >
            {route.name}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
