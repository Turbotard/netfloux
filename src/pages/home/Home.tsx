import React, { useEffect, useState } from "react";
import {
  Show,
  fetchAllSeriesFromTMDb,
  fetchLastEpisodeAirDateFromTMDb,
} from "../../services/seriesService";
import SeriesWeekCalendar from "../../components/SeriesCalendar/SeriesCalendar";
import Navbar from "../../components/navbar/Navbar";
import { Box } from "@mui/material";

const Home = () => {
  const [seriesData, setSeriesData] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const series = await fetchAllSeriesFromTMDb(1, 20);

        const updatedSeriesData = await Promise.all(
          series.map(async (serie: Show) => {
            const lastEpisodeAirDate = await fetchLastEpisodeAirDateFromTMDb(
              serie.id
            );
            return {
              ...serie,
              nextEpisodeDate: lastEpisodeAirDate || undefined,
            };
          })
        );

        setSeriesData(updatedSeriesData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données des séries:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box className="home-container">
      <Navbar />
      {isLoading ? (
        <p>Chargement des données des séries...</p>
      ) : (
        <Box className="calendar-container">
          <Box className="calendar-section">
            <h2>Calendrier des séries de cette semaine :</h2>
            <SeriesWeekCalendar seriesData={seriesData} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Home;
