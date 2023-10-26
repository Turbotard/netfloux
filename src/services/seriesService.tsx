const TRAKT_BASE_URL = 'http://localhost:8080/https://api.trakt.tv/';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface Show {
    title: string;
    year: number;
    poster: string;
    nextShowingDate: string;
    genres: string[];
    rating: number;
    synopsis: string;
}

export const fetchDetailsFromTMDb = async (tmdbId: number): Promise<{ poster: string, genres: string[], synopsis: string }> => {
    const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;

    if (!tmdbApiKey) {
        console.error("La clé API (REACT_APP_TMDB_API_KEY) n'est pas définie.");
        return { poster: '', genres: [], synopsis: '' };
    }

    try {
        const response = await fetch(`${TMDB_BASE_URL}/tv/${tmdbId}?api_key=${tmdbApiKey}`);
        const data = await response.json();
        const genres = data.genres.map((genre: { id: number, name: string }) => genre.name);
        return { 
            poster: `${TMDB_IMAGE_BASE_URL}${data.poster_path}`, 
            genres, 
            synopsis: data.overview // Ajouté
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des détails depuis TMDb:", error);
        return { poster: '', genres: [], synopsis: '' };
    }
}

export const fetchRatingFromTrakt = async (showId: number): Promise<number> => {
    const traktApiKey = process.env.REACT_APP_TRAKT_API_CLIENT_ID;
    if (!traktApiKey) {
        console.error("La clé API (REACT_APP_TRAKT_API_CLIENT_ID) n'est pas définie.");
        return 0;
    }

    try {
        const response = await fetch(`${TRAKT_BASE_URL}shows/${showId}/ratings`, {
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': traktApiKey
            }
        });

        const data = await response.json();

        return data.rating;
    } catch (error) {
        console.error("Erreur lors de la récupération des évaluations depuis Trakt:", error);
        return 0;
    }
}

export const fetchNextShowingDate = async (showId: number): Promise<string> => {
    const traktApiKey = process.env.REACT_APP_TRAKT_API_CLIENT_ID;
    if (!traktApiKey) {
        console.error("La clé API (REACT_APP_TRAKT_API_CLIENT_ID) n'est pas définie.");
        return '';
    }

    try {
        const response = await fetch(`${TRAKT_BASE_URL}/shows/${showId}/last_episode`, {
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': traktApiKey
            }
        });

        if (!response.ok || !response.bodyUsed) {
            console.error(`Erreur lors de la récupération de la prochaine date de diffusion pour la série avec l'ID ${showId}: ${response.statusText}`);
            return '';
        }

        const data = await response.json();

        if (data && data.first_aired) {
            return data.first_aired;
        } else {
            console.error(`Pas de prochaine date de diffusion trouvée pour la série avec l'ID ${showId}`);
            return "N/A"; 
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de la prochaine date de diffusion:", error);
        return '';
    }
}

export const fetchAllGenresFromTrakt = async (): Promise<string[]> => {
    const traktApiKey = process.env.REACT_APP_TRAKT_API_CLIENT_ID;

    if (!traktApiKey) {
        console.error("La clé API (REACT_APP_TRAKT_API_CLIENT_ID) n'est pas définie.");
        return [];
    }

    try {
        const response = await fetch(`${TRAKT_BASE_URL}genres/movies`, {
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': traktApiKey
            }
        });
        const data = await response.json();
        const genres = data.map((genre: { name: string }) => genre.name);
        return genres;
    } catch (error) {
        console.error("Erreur lors de la récupération des genres depuis Trakt:", error);
        return [];
    }
}

export const fetchPopularSeries = async (): Promise<Show[]> => {
    const traktApiKey = process.env.REACT_APP_TRAKT_API_CLIENT_ID;

    if (!traktApiKey) {
        console.error("La clé API (TRAKT_API_CLIENT_ID) n'est pas définie.");
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

        const showsWithDetails = await Promise.all(rawData.map(async (show: any) => {
            const { poster, genres, synopsis } = await fetchDetailsFromTMDb(show.ids.tmdb);
            const nextShowingDate = await fetchNextShowingDate(show.ids.trakt);
            const rating = await fetchRatingFromTrakt(show.ids.trakt);
            return {
                title: show.title,
                year: show.year,
                poster: poster,
                nextShowingDate: nextShowingDate || '',
                genres: genres,
                rating: rating,
                synopsis: synopsis
            };
        }));

        return showsWithDetails;
    } catch (error) {
        console.error("Erreur lors de la récupération des séries populaires:", error);
        return [];
    }
}
