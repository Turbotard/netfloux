import React, { useState } from 'react';
import { Typography, Box, createTheme, TextField, Grid } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import Navbar from '../../components/navbar/Navbar';
import PopularSeriesCorridor from '../../components/seriesCorridor/PopularSeriesCorridor';
import AllSeriesDisplay from '../../components/AllSeriesDisplay/AllSeriesDisplay';
import SearchIcon from '@mui/icons-material/Search';
import './list.css'
const ListPage: React.FC = () => {
    const defaultTheme = createTheme();
    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
        <ThemeProvider theme={defaultTheme}>
            <Navbar/>
            <Grid className='background'
                 
                >
            <Grid className="populaires"
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
            >
                <Typography variant="h4" className='titre'>
                    Les Plus Populaires:
                </Typography>
                <PopularSeriesCorridor />
            </Grid>
            <Box mt={3} display="flex" justifyContent="center">
                <TextField 
                    className='search-input'
                    variant="outlined" 
                    placeholder="Recherchez une série" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    
                />
            </Box>
            <Box className="all">
                <AllSeriesDisplay searchQuery={searchQuery}/>
            </Box>
            </Grid>
          
        </ThemeProvider>
    );
};

export default ListPage;