import PropTypes from "prop-types";
import Tracklist from "../Tracklist/Tracklist";
import styles from "./SearchResults.module.css";

const SearchResults = ({ searchResults, playlist, setPlaylist, loading }) => {
  const handleAddToPlaylist = (track) => {
    const foundTrack = playlist.find(
      (playlistTrack) => playlistTrack.id === track.id
    );
    if (!foundTrack) {
      setPlaylist((prevTracks) => [...prevTracks, track]);
    }
  };
  return (
    <section className={styles.searchResults}>
      <h2>Results</h2>
      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <Tracklist
          trackList={searchResults}
          buttonText="+"
          onClick={handleAddToPlaylist}
        />
      )}
    </section>
  );
};

SearchResults.propTypes = {
  searchResults: PropTypes.array.isRequired,
  playlist: PropTypes.array.isRequired,
  setPlaylist: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default SearchResults;
