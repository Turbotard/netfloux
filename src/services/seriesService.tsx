const TRAKT_BASE_URL = 'http://localhost:8080/https://api.trakt.tv/';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;

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

    if (!tmdbApiKey) {
        console.error("La clé API (REACT_APP_TMDB_API_KEY) n'est pas définie.");
        return { poster: '', genres: [], synopsis: '' };
    }

    try {
        const response = await fetch(`${TMDB_BASE_URL}/tv/${tmdbId}?api_key=${tmdbApiKey}`);
        if (!response.ok) {
            console.error(`Erreur lors de la requête à l'API TMDb pour l'ID: ${tmdbId} - Status: ${response.statusText}`);
            return { poster: '', genres: [], synopsis: '' };
        }
        const data = await response.json();

        if (!data.poster_path) {
            console.warn(`Poster path manquant pour l'ID TMDb: ${tmdbId}`);
        }

        const genres = data.genres.map((genre: { id: number, name: string }) => genre.name);
        return {
            poster: `${TMDB_IMAGE_BASE_URL}${data.poster_path}`,
            genres,
            synopsis: data.overview
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des détails depuis TMDb:", error);
        return { poster: '', genres: [], synopsis: '' };
    }
}

export const fetchAllSeriesFromTMDb = async (page: number, limit: number) => {
    const seriesResponse = await fetch(`https://api.themoviedb.org/3/discover/tv?page=${page}&api_key=${tmdbApiKey}`);
    const seriesData = await seriesResponse.json();
    const genreMap = await fetchAllGenresFromTMDb();

    const detailedSeriesData = await Promise.all(
        seriesData.results.map(async (serie: any) => {
            const serieDetailResponse = await fetch(`https://api.themoviedb.org/3/tv/${serie.id}?api_key=${tmdbApiKey}`);
            const serieDetail = await serieDetailResponse.json();
            console.log(seriesData);
            return {
                title: serie.name,
                poster: `https://image.tmdb.org/t/p/w500${serie.poster_path}`,
                numberOfSeasons: serieDetail.number_of_seasons,
                numberOfEpisodes: serieDetail.number_of_episodes,
                releaseDate: serie.first_air_date,
                genres: serie.genre_ids.map((id: number) => genreMap.get(id) || "N/A")
            };
        })
    );

    return detailedSeriesData;
};

export const fetchAllGenresFromTMDb = async (): Promise<Map<number, string>> => {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/genre/tv/list?api_key=${tmdbApiKey}`);
        const data = await response.json();
        let genreMap = new Map();
        data.genres.forEach((genre: { id: number, name: string }) => {
            genreMap.set(genre.id, genre.name);
        });
        return genreMap;
    } catch (error) {
        console.error("Erreur lors de la récupération des genres depuis TMDb:", error);
        return new Map();
    }
};

//TRAKT
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

        const data = await response.json();

        if (!response.ok) {
            console.error(`Erreur lors de la récupération de la prochaine date de diffusion pour la série avec l'ID ${showId}: ${response.statusText}`);
            return '';
        }

        if (data && data.first_aired) {
            return data.first_aired;
        } else {
            console.error(`Pas de prochaine date de diffusion trouvée pour la série avec l'ID ${showId}`, data);
            return "N/A"; 
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de la prochaine date de diffusion:", error);
        return '';
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
export const fetchPopularSeriesFromTrakt = async (page: number = 1, limit: number = 10): Promise<Show[]> => {
    const traktApiKey = process.env.REACT_APP_TRAKT_API_CLIENT_ID;

    if (!traktApiKey) {
        console.error("La clé API (REACT_APP_TRAKT_API_CLIENT_ID) n'est pas définie.");
        return [];
    }

    try {
        const response = await fetch(`${TRAKT_BASE_URL}shows/popular?page=${page}&limit=${limit}`, {
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': traktApiKey
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la requête à l'API Trakt.tv pour les séries populaires - Status: ${response.statusText}`);
        }

        const rawData = await response.json();

        rawData.forEach(({ids, title, year, ...rest}: any) => {
            if (!ids) {
                console.warn('ids non fonctionnel', {title, year, ...rest});
            }
        });

        const popularShowsDetails = await Promise.all(rawData.map(async (show: any) => {
            if (show && show.ids && show.ids.tmdb && show.ids.trakt && typeof show.ids.tmdb === "number") {
                const { poster, genres, synopsis } = await fetchDetailsFromTMDb(show.ids.tmdb);
                const rating = await fetchRatingFromTrakt(show.ids.trakt);
                return {
                    title: show.title ?? 'Titre non disponible',
                    year: show.year ?? new Date().getFullYear(),
                    poster: poster,
                    genres: genres,
                    rating: rating,
                    synopsis: synopsis ?? 'Synopsis non disponible'
                };
            } else {
                console.warn("Données manquantes ou mal formées pour:", show);
                return null;
            }
        }));

        return popularShowsDetails.filter(Boolean) as Show[];
    } catch (error) {
        console.error("Erreur lors de la récupération des séries populaires depuis Trakt:", error);
        return [];
    }
}
