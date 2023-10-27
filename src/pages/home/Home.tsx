import React from 'react';
import SeriesWeekCalendar from '../../components/SeriesWeekCalendar/SeriesWeekCalendar';

const Home: React.FC = () => {
    const dummySeriesData = [
        { 
            title: 'Série A', 
            releaseDate: new Date(2023, 9, 27).toISOString(), 
            lastEpisodeReleaseDate: new Date(2023, 9, 26).toISOString() 
        },
        { 
            title: 'Série B', 
            releaseDate: new Date(2023, 9, 29).toISOString(), 
            lastEpisodeReleaseDate: new Date(2023, 9, 28).toISOString() 
        }
    ];    

    return (
        <div className="home-container">
            <h1>Bienvenue sur la page d'accueil !</h1>
            <div className="calendar-section">
                <h2>Calendrier des séries de cette semaine :</h2>
                <SeriesWeekCalendar seriesData={dummySeriesData} />
            </div>
        </div>
    );
};

export default Home;
