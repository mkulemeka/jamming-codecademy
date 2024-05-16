import Button from "../Button";
import PropTypes from "prop-types";
import Tracklist from "../Tracklist/Tracklist";
import styles from "./Playlist.module.css";
import useSearch from "../../hooks/useSearch";
import { useState } from "react";

const Playlist = ({ playlist, setPlaylist }) => {
  const { createPlaylist, error } = useSearch();
  const [playlistName, setPlaylistName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleRemoveFromPlaylist = (track) => {
    setPlaylist((prevTracks) =>
      prevTracks.filter((playlistTrack) => playlistTrack.id !== track.id)
    );
  };

  const handleClick = async () => {
    console.log(validation());
    if (!validation()) return;

    const uris = playlist.map((track) => track.uri);
    setIsSaving(true);

    console.log(playlistName, uris);

    try {
      await createPlaylist(playlistName, uris);
      setPlaylist([]);
      setPlaylistName("");
      setIsSaving(false);
    } catch (error) {
      console.error("Error creating playlist:", error);
      setIsSaving(false);
    } 
  };

  const validation = () => {
    if (!playlistName.trim()) {
      alert("Please enter a playlist name");
      return false;
    }
    if (!playlist.length) {
      alert("Please add tracks to the playlist");
      return false;
    }
    return true;
  };

  return (
    <section className={styles.section}>
      <input
        className={styles.playlistName}
        type="text"
        placeholder="Playlist Name"
        value={playlistName}
        onChange={({ target }) => setPlaylistName(target.value)}
        disabled={isSaving}
      />
      <Tracklist
        trackList={playlist}
        buttonText="-"
        onClick={handleRemoveFromPlaylist}
      />
      <Button
        buttonText={isSaving ? "Saving..." : "Save to Spotify"}
        onClick={handleClick}
      />
      {error && <p className={styles.error}>{error}</p>}
    </section>
  );
};

Playlist.propTypes = {
  playlist: PropTypes.array.isRequired,
  setPlaylist: PropTypes.func.isRequired,
};

export default Playlist;
