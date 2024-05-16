import PropTypes from "prop-types";
import Track from "../Track/Track";
import styles from "./Tracklist.module.css";

const Tracklist = ({ trackList, buttonText, onClick }) => {
  return (
    <section className={styles.tracklist}>
      {trackList.map((track) => (
        <Track
          key={track.id}
          track={track}
          trackButtonText={buttonText}
          onClick={onClick}
        />
      ))}
    </section>
  );
};

Tracklist.propTypes = {
  trackList: PropTypes.array.isRequired,
  buttonText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Tracklist;
