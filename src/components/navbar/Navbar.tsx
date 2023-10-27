import React from 'react';
import { Typography, Box, createTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import StarIcon from '@mui/icons-material/Star';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import ProfileIcon from '@mui/icons-material/Person';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

import ListIcon from '@mui/icons-material/List';


const Navbar = () => {
  const navigate = useNavigate();
  const handleNavigate = () =>{
    navigate("/list")
  }
  const Routes = [
    { path: 'profile', icon: <ProfileIcon />, name: 'Profil' },
    { path: 'suivis', icon: <StarIcon />, name: 'Followed film and series' },
    { path: 'calendar', icon: <CalendarIcon />, name: 'Calendar' },
  ];

  return (
    <AppBar position="static" >
      <Toolbar className='navbar'>
        <Button 
        onClick={handleNavigate}
        >
          <Box className="logo">
            <img src='/img/o.png'></img>
          </Box>
          
        </Button>
        <Box>
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
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
