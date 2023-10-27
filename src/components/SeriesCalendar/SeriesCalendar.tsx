import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { fetchAllSeriesFromTMDb, Show } from "../../services/seriesService";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../db/db";
import { Auth, User, getAuth, onAuthStateChanged } from "@firebase/auth";

interface SeriesWeekCalendarProps {
    seriesData: Show[];
}

const SeriesCalendar: React.FC<SeriesWeekCalendarProps> = ({ seriesData }) => {
    const [user, setUser] = useState<User | null>(null);
    const [series, setSeries] = useState<Show[]>([]);
    const authInstance: Auth = getAuth();

    useEffect(() => {
        const loadUserData = async (currentUser: User) => {
            const userDocRef = doc(firestore, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userFavorites = userDoc.data().fav;
                const allSeries = await fetchAllSeriesFromTMDb(1, 10);
                const filteredSeries = allSeries.filter(serie =>
                    userFavorites.includes(serie.title)
                );
                setSeries(filteredSeries);
            }
        };

        const unsubscribe = onAuthStateChanged(authInstance, currentUser => {
            setUser(currentUser);
            if (currentUser) loadUserData(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const tileContent = ({ date }: { date: Date }) => {
        const seriesOnThisDate = series.filter(serie => 
            serie.nextEpisodeDate && new Date(serie.nextEpisodeDate).toDateString() === date.toDateString()
        );

        return (
            <div>
                {seriesOnThisDate.map(serie => (
                    <div key={serie.id}>
                        {serie.title} - Next Episode: {serie.nextEpisodeTitle}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <Calendar tileContent={tileContent} />
        </div>
    );
};

export default SeriesCalendar;
