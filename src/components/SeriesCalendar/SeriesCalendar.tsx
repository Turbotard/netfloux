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
    const [userFavorites, setUserFavorites] = useState<string[]>([]);
    const authInstance: Auth = getAuth();

    useEffect(() => {
        const loadUserData = async (currentUser: User) => {
            const userDocRef = doc(firestore, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const favorites = userDoc.data().fav;
                setUserFavorites(favorites);
            }
        };

        const unsubscribe = onAuthStateChanged(authInstance, currentUser => {
            setUser(currentUser);
            if (currentUser) loadUserData(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const tileContent = ({ date }: { date: Date }) => {
        return (
            <div>
                {seriesData.map(serie => {
                    if (serie.nextEpisodeDate && new Date(serie.nextEpisodeDate).toDateString() === date.toDateString()) {
                        return (
                            <div key={serie.id}>
                                {serie.title} - Next Episode: {serie.nextEpisodeDate}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        );
    };

    return (
        <div>
            <Calendar tileContent={tileContent} />
        </div>
    );
};

export default SeriesCalendar;