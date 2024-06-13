import { spotifyAuth } from "../auth/spotifyAuth";
import { useState } from "react";

const baseUrl = "https://api.spotify.com/v1";
const { getUserData } = spotifyAuth;

const useFetch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const options = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  };

  /**
   * Fetches data (songs) from the Spotify API and saves the results in the state. Returns if the searchValue is empty
   * @param {string} searchValue The search parameter
   * @returns {Promise<void>} A promise that resolves when the request is complete
   * @throws {Error} If the request fails
   */
  const fetchData = async (searchValue) => {
    if (!searchValue) return;

    const url = `${baseUrl}/search?q=${searchValue}&type=track&limit=10`;

    try {
      setLoading(true);

      const respose = await fetch(url, options);
      const data = await respose.json();
      const tracks = data?.tracks?.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
        preview_url: track.preview_url,
      }));

      setSearchResults(tracks);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * Creates a new playlist on the user's Spotify account and adds tracks to it
   * @param {string} playlistName  The name of the playlist to be created
   * @param {Array<string>} trackUris An array of spotify track uris
   * @returns {Promise<void>} A promise that resolves when the request is complete
   * @throws {Error} If the request fails
   */
  const createPlaylist = async (playlistName, trackUris) => {
    try {
      const { id: userID } = await getUserData();

      const url = `${baseUrl}/users/${userID}/playlists`;
      setLoading(true);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: playlistName, public: false }),
      });

      const data = await response.json();
      await addTracksToPlaylist(data.id, trackUris);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * Adds tracks to a playlist on the user's Spotify account
   * @param {string} playlistId id of the spotify playlist
   * @param {Array<string>} trackUris array of spotify track uris
   * @returns {Promise<void>} A promise that resolves when the request is complete
   * @throws {Error} If the request fails
   */
  const addTracksToPlaylist = async (playlistId, trackUris) => {
    const url = `${baseUrl}/playlists/${playlistId}/tracks`;
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: trackUris }),
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    console.error(error);
    setError(error);
    setLoading(false);
  };

  return {
    createPlaylist,
    fetchData,
    searchResults,
    loading,
    error,
    setSearchResults,
  };
};

export default useFetch;
