import {
  FaRegCirclePause,
  FaRegCirclePlay,
  FaRegCircleXmark,
} from "react-icons/fa6";

import PropTypes from "prop-types";
import styles from "./Audio.module.css";
import { useState } from "react";

const Audio = ({ trackId, source }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayback = () => {
    const audio = document.getElementById(trackId);

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

 
  const displayIcon = () => {
    if (!source) return <FaRegCircleXmark />;
    if (isPlaying) return <FaRegCirclePause />;
    return <FaRegCirclePlay />;
  };

  return (
    <>
      <audio className={styles.audio} id={trackId}>
        <source src={source} type="audio/mpeg" />
      </audio>
      <button
        className={styles.audioButton}
        onClick={handlePlayback}
        disabled={!source}
        style={!source ? { cursor: "not-allowed" } : {}}
      >
        {displayIcon()}
      </button>
    </>
  );
};

Audio.propTypes = {
  source: PropTypes.string.isRequired,
  trackId: PropTypes.string.isRequired,
};

export default Audio;
