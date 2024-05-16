import PropTypes from "prop-types";
import TrackButton from "../TrackButton/TrackButton";
import styles from "./Track.module.css";

const Track = ({ track, trackButtonText, onClick }) => {
  return (
    <article className={styles.article}>
      <div>
        <h3 className={styles.h3}>{track.name}</h3>
        <p className={styles.p}>
          {track.artist} | {track.album}
        </p>
      </div>
      <TrackButton
        trackButtonText={trackButtonText}
        onClick={() => onClick(track)}
      />
    </article>
  );
};

Track.propTypes = {
  track: PropTypes.object.isRequired,
  trackButtonText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Track;
