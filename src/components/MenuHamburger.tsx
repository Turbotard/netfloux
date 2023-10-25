import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import SignupIcon from '@mui/icons-material/PersonAdd';
import HomeIcon from '@mui/icons-material/Home';
import ProfileIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';

const MenuHamburger = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const Routes = [
    { path: '', icon: <HomeIcon />, name: 'Home' },
    { path: 'login', icon: <LoginIcon />, name: 'Log in' },
    { path: 'signup', icon: <SignupIcon />, name: 'Signup' },
    { path: 'profil/:id', icon: <ProfileIcon />, name: 'Profil Utilisateur' },
  ];

  return (
    <div style={{ position: 'absolute', top: '20px', left: drawerOpen ? '250px' : '20px' }}>
      <IconButton onClick={toggleDrawer} edge="start" color="inherit" aria-label="menu">
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <List>
          {Routes.map((route) => (
            <ListItem button key={route.name} component={Link} to={`/${route.path}`}>
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default MenuHamburger;
