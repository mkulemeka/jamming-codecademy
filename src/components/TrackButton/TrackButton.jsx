import PropTypes from "prop-types";
import styles from "./TrackButton.module.css";

const TrackButton = ({ trackButtonText, onClick }) => {
  return <button className={styles.trackButton} onClick={onClick}>{trackButtonText}</button>;
};

TrackButton.propTypes = {
  trackButtonText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TrackButton;
