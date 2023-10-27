import React, { useState, useEffect } from 'react';

interface SeriesData {
    title: string;
    lastEpisodeReleaseDate: string;
}

interface Props {
    seriesData: SeriesData[];
}

const SeriesWeekCalendar: React.FC<Props> = ({ seriesData }) => {
    const generateWeek = (referenceDate: Date): Date[] => {
        const startDate = new Date(referenceDate);
        startDate.setDate(referenceDate.getDate() - referenceDate.getDay());
        const week: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startDate);
            day.setDate(day.getDate() + i);
            week.push(day);
        }
        return week;
    };

    const [currentWeek, setCurrentWeek] = useState<Date[]>(generateWeek(new Date()));

    useEffect(() => {
        setCurrentWeek(generateWeek(new Date()));
    }, [seriesData]);

    return (
        <div className="calendar-week">
            {currentWeek.map((day, index) => {
                const formattedDay = day.toISOString().split('T')[0];
                const seriesForDay = seriesData.filter(series => series.lastEpisodeReleaseDate === formattedDay);
                return (
                    <div key={index} className="calendar-day">
                        <div className="day-title">{formattedDay}</div>
                        {seriesForDay.map((series, seriesIndex) => (
                            <div key={seriesIndex} className="series-title">
                                {series.title}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default SeriesWeekCalendar;
