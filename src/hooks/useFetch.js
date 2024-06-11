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
      }));

      setSearchResults(tracks);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const createPlaylist = async (playlistName, trackUris) => {
    try {
      const { id: userID } = await getUserData();
      console.log(userID);

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
