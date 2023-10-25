import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import ProfileIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import './navbar.css';

import ListIcon from '@mui/icons-material/List';


const Navbar = () => {
  const Routes = [
    { path: '', icon: <HomeIcon />, name: 'Home' },
    { path: 'profile', icon: <ProfileIcon />, name: 'Profil Utilisateur' },
    { path: 'list', icon: <ListIcon />, name: 'List' },
  ];

  return (
    <AppBar position="static" >
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
