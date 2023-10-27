import { updateDoc, arrayUnion } from "@firebase/firestore";
import {
  arrayRemove,
  collection,
  doc as doc2,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../db/db";
import axios from "axios";
import React, { useEffect, useState } from "react";

const TRAKT_BASE_URL = "http://localhost:8080/https://api.trakt.tv/";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;

export interface Show {
  id: number;
  title: string;
  year: number;
  poster: string;
  nextShowingDate: string;
  genres: string[];
  rating: number;
  synopsis: string;
  summary?: string;
  actors?: string[];
  numberOfSeasons: number;
  numberOfEpisodes: number;
  seasons: Season[];
  nextEpisodeDate: string | undefined;
  nextEpisodeTitle?: string;
}

interface Season {
  seasonNumber: number;
  episodeCount: number;
}

export const fetchDetailsFromTMDb = async (
  tmdbId: number
): Promise<{ poster: string; genres: string[]; synopsis: string }> => {
  if (!tmdbApiKey) {
    console.error("API key (REACT_APP_TMDB_API_KEY) is not defined.");
    return { poster: "", genres: [], synopsis: "" };
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tmdbId}?api_key=${tmdbApiKey}`
    );
    if (!response.ok) {
      console.error(
        `Error while fetching data from TMDb API for ID: ${tmdbId} - Status: ${response.statusText}`
      );
      return { poster: "", genres: [], synopsis: "" };
    }
    const data = await response.json();

    if (!data.poster_path) {
      console.warn(`Poster path missing for TMDb ID: ${tmdbId}`);
    }

    const genres = data.genres.map(
      (genre: { id: number; name: string }) => genre.name
    );
    return {
      poster: `${TMDB_IMAGE_BASE_URL}${data.poster_path}`,
      genres,
      synopsis: data.overview,
    };
  } catch (error) {
    console.error("Error while fetching details from TMDb:", error);
    return { poster: "", genres: [], synopsis: "" };
  }
};

export const fetchAllSeriesFromTMDb = async (
  page: number,
  limit: number,
  searchQuery?: string
): Promise<Show[]> => {
  const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;

  if (!tmdbApiKey) {
    console.error("API key (REACT_APP_TMDB_API_KEY) is not defined.");
    return [];
  }

  // Choose the endpoint based on the presence of searchQuery
  const seriesEndpoint = searchQuery
    ? `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
        searchQuery
      )}&page=${page}&api_key=${tmdbApiKey}`
    : `https://api.themoviedb.org/3/discover/tv?page=${page}&api_key=${tmdbApiKey}`;

  try {
    const seriesResponse = await fetch(seriesEndpoint);
    const seriesData = await seriesResponse.json();

    if (seriesResponse.status !== 200) {
      throw new Error(
        `Error while fetching data from TMDb API - Status: ${seriesResponse.statusText}`
      );
    }

    const genreMap = await fetchAllGenresFromTMDb();

    const detailedSeriesData = await Promise.all(
      seriesData.results.map(async (serie: any) => {
        if (!serie.id) {
          console.warn("Missing series ID:", serie);
          return null;
        }

        const serieDetailResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${serie.id}?api_key=${tmdbApiKey}&append_to_response=credits`
        );
        const serieDetail = await serieDetailResponse.json();

        return {
          id: serie.id,
          title: serie.name ?? "Title not available",
          year: new Date(serie.first_air_date).getFullYear(),
          poster: `https://image.tmdb.org/t/p/w500${serie.poster_path}`,
          genres: serie.genre_ids.map(
            (id: number) => genreMap.get(id) || "N/A"
          ),
          rating: serieDetail.vote_average,
          synopsis: serieDetail.overview ?? "Synopsis not available",
          numberOfSeasons: serieDetail.number_of_seasons,
          numberOfEpisodes: serieDetail.number_of_episodes,
          seasons: serieDetail.seasons.map((season: any) => ({
            seasonNumber: season.season_number,
            episodeCount: season.episode_count,
          })),
          actors:
            serieDetail.credits?.cast
              ?.slice(0, 5)
              .map((actor: any) => actor.name) || [],
        };
      })
    );

    return detailedSeriesData.filter(Boolean) as Show[];
  } catch (error) {
    console.error("Error while fetching series from TMDb:", error);
    return [];
  }
};

export const fetchSeriesDetailsByTitle = async (
  title: string
): Promise<Show | null> => {
  try {
    const seriesResponse = await fetchAllSeriesFromTMDb(1, 100, title);

    if (!seriesResponse || seriesResponse.length === 0) {
      console.warn(`No series found for title: ${title}`);
      return null;
    }

    const matchedSeries = seriesResponse.find((serie) => serie.title === title);

    if (!matchedSeries) {
      console.warn(`No exact match found for title: ${title}`);
      return null;
    }

    return matchedSeries;
  } catch (error) {
    console.error("Error while fetching series details by title:", error);
    return null;
  }
};

export const fetchAllGenresFromTMDb = async (): Promise<
  Map<number, string>
> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/tv/list?api_key=${tmdbApiKey}`
    );
    const data = await response.json();
    let genreMap = new Map();
    data.genres.forEach((genre: { id: number; name: string }) => {
      genreMap.set(genre.id, genre.name);
    });
    return genreMap;
  } catch (error) {
    console.error("Error while fetching genres from TMDb:", error);
    return new Map();
  }
};

// TRAKT
export const fetchNextShowingDate = async (showId: number): Promise<string> => {
  const traktApiKey = process.env.REACT_APP_TRAKT_API_CLIENT_ID;
  if (!traktApiKey) {
    console.error("API key (REACT_APP_TRAKT_API_CLIENT_ID) is not defined.");
    return "";
  }

  try {
    const response = await fetch(
      `${TRAKT_BASE_URL}/shows/${showId}/last_episode`,
      {
        headers: {
          "Content-Type": "application/json",
          "trakt-api-version": "2",
          "trakt-api-key": traktApiKey,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        `Error while fetching the next airing date for the series with ID ${showId}: ${response.statusText}`
      );
      return "";
    }

    if (data && data.first_aired) {
      return data.first_aired;
    } else {
      console.error(
        `No next airing date found for the series with ID ${showId}`,
        data
      );
      return "N/A";
    }
  } catch (error) {
    console.error("Error while fetching the next airing date:", error);
    return "";
  }
};

export const fetchRatingFromTrakt = async (showId: number): Promise<number> => {
  const traktApiKey = process.env.REACT_APP_TRAKT_API_CLIENT_ID;
  if (!traktApiKey) {
    console.error("API key (REACT_APP_TRAKT_API_CLIENT_ID) is not defined.");
    return 0;
  }

  try {
    const response = await fetch(`${TRAKT_BASE_URL}shows/${showId}/ratings`, {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": traktApiKey,
      },
    });

    const data = await response.json();

    return data.rating;
  } catch (error) {
    console.error("Error while fetching ratings from Trakt:", error);
    return 0;
  }
};

export const fetchAllGenresFromTrakt = async (): Promise<string[]> => {
  const traktApiKey = process.env.REACT_APP_TRAKT_API_CLIENT_ID;

  if (!traktApiKey) {
    console.error("API key (REACT_APP_TRAKT_API_CLIENT_ID) is not defined.");
    return [];
  }

  try {
    const response = await fetch(`${TRAKT_BASE_URL}genres/movies`, {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": traktApiKey,
      },
    });
    const data = await response.json();
    const genres = data.map((genre: { name: string }) => genre.name);
    return genres;
  } catch (error) {
    console.error("Error while fetching genres from Trakt:", error);
    return [];
  }
};

export const fetchPopularSeriesFromTrakt = async (
  page: number = 1,
  limit: number = 15,
  searchQuery?: string
): Promise<Show[]> => {
  const traktApiKey = process.env.REACT_APP_TRAKT_API_CLIENT_ID;

  if (!traktApiKey) {
    console.error("API key (REACT_APP_TRAKT_API_CLIENT_ID) is not defined.");
    return [];
  }

  // Choose the endpoint based on the presence of searchQuery
  const seriesEndpoint = searchQuery
    ? `${TRAKT_BASE_URL}search/show?query=${encodeURIComponent(
        searchQuery
      )}&page=${page}&limit=${limit}`
    : `${TRAKT_BASE_URL}shows/popular?page=${page}&limit=${limit}`;

  try {
    const response = await fetch(seriesEndpoint, {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": traktApiKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error while making a request to the Trakt.tv API - Status: ${response.statusText}`
      );
    }

    const rawData = await response.json();

    const showsData = searchQuery
      ? rawData.map((item: any) => item.show)
      : rawData;

    showsData.forEach(({ ids, title, year, ...rest }: any) => {
      if (!ids) {
        console.warn("Non-functional IDs", { title, year, ...rest });
      }
    });

    const popularShowsDetails = await Promise.all(
      showsData.map(async (show: any) => {
        if (
          show &&
          show.ids &&
          show.ids.tmdb &&
          show.ids.trakt &&
          typeof show.ids.tmdb === "number"
        ) {
          const { poster, genres, synopsis } = await fetchDetailsFromTMDb(
            show.ids.tmdb
          );
          const rating = await fetchRatingFromTrakt(show.ids.trakt);
          return {
            title: show.title ?? "Title not available",
            year: show.year ?? new Date().getFullYear(),
            poster: poster,
            genres: genres,
            rating: rating,
            synopsis: synopsis ?? "Synopsis not available",
          };
        } else {
          console.warn("Missing or malformed data for:", show);
          return null;
        }
      })
    );

    return popularShowsDetails.filter(Boolean) as Show[];
  } catch (error) {
    console.error("Error while fetching popular series from Trakt:", error);
    return [];
  }
};

export const addToFavorites = async (userId: string, seriesid: string) => {
  const userDocRef = doc2(firestore, "users", userId);

  try {
    await updateDoc(userDocRef, {
      fav: arrayUnion(seriesid),
    });
  } catch (error) {
    console.error("Error while adding to favorites: ", error);
    throw error;
  }
};

export const removeFromFavorites = async (
  userId: string,
  seriesName: string
) => {
  const userDocRef = doc2(firestore, "users", userId);

  try {
    await updateDoc(userDocRef, {
      fav: arrayRemove(seriesName),
    });
  } catch (error) {
    console.error("Error while removing from favorites: ", error);
    throw error;
  }
};
export const fetchLastEpisodeAirDateFromTMDb = async (seriesId: number): Promise<string | null> => {
    const url = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${tmdbApiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.next_episode_to_air) {
            return data.next_episode_to_air.air_date;
        } else {
            console.warn(`Prochain épisode non disponible pour la série avec l'ID: ${seriesId}`);
            return null;
        }
    } catch (error: any) {
        console.error(`Erreur lors de la récupération de la date du prochain épisode depuis TMDb pour l'ID: ${seriesId} - ${(error as Error).message}`);
        return null;
    }
}

