const TRAKT_BASE_URL = 'https://cors-anywhere.herokuapp.com/https://api.trakt.tv/';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface Show {
    title: string;
    year: number;
    poster: string;
    nextShowingDate: string;
}

export const fetchPosterFromTMDb = async (tmdbId: number): Promise<string> => {
    const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;

    if (!tmdbApiKey) {
        console.error("La clé API (REACT_APP_TMDB_API_KEY) n'est pas définie.");
        return '';
    }

    try {
        const response = await fetch(`${TMDB_BASE_URL}/tv/${tmdbId}?api_key=${tmdbApiKey}`);
        const data = await response.json();
        return `${TMDB_IMAGE_BASE_URL}${data.poster_path}`;
    } catch (error) {
        console.error("Erreur lors de la récupération du poster depuis TMDb:", error);
        return '';
    }
}

export const fetchNextShowingDate = async (showId: number): Promise<string> => {
    const traktApiKey = process.env.REACT_APP_TRAKT_API_CLIENT_ID;
    if (!traktApiKey) {
        console.error("La clé API (REACT_APP_TRAKT_API_CLIENT_ID) n'est pas définie.");
        return '';
    }

    try {
        const response = await fetch(`${TRAKT_BASE_URL}/shows/${showId}/next_episode`, {
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': traktApiKey
            }
        });

        if (response.status === 204) {
            console.error(`Pas de prochaine date de diffusion trouvée pour la série avec l'ID ${showId}`);
            return "N/A"; 
        } else if (!response.ok) {
            console.error(`Erreur lors de la récupération de la prochaine date de diffusion pour la série avec l'ID ${showId}: ${response.statusText}`);
            return '';
        }

        const data = await response.json();
        return data.first_aired;
    } catch (error) {
        console.error("Erreur lors de la récupération de la prochaine date de diffusion:", error);
        return '';
    }
}

export const fetchPopularSeries = async (): Promise<Show[]> => {
    const traktApiKey = process.env.REACT_APP_TRAKT_API_CLIENT_ID;

    if (!traktApiKey) {
        console.error("La clé API (REACT_APP_TRAKT_API_CLIENT_ID) n'est pas définie.");
        return [];
    }

    try {
        const response = await fetch(`${TRAKT_BASE_URL}/shows/popular`, {
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': traktApiKey
            }
        });

        const rawData = await response.json();

        const showsWithPoster = await Promise.all(rawData.map(async (show: any) => {
            const posterUrl = await fetchPosterFromTMDb(show.ids.tmdb);
            const nextShowingDate = await fetchNextShowingDate(show.ids.trakt);
            return {
                title: show.title,
                year: show.year,
                poster: posterUrl,
                nextShowingDate: nextShowingDate || "N/A"
            };
        }));

        return showsWithPoster;
    } catch (error) {
        console.error("Erreur lors de la récupération des séries populaires:", error);
        return [];
    }
}
