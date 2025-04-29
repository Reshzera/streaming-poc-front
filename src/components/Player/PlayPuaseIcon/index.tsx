import React from "react";
import styles from "./styles.module.scss";

type Props = {
  isPlaying: boolean;
};

const PlayPauseIcon: React.FC<Props> = ({ isPlaying }) => {
  return (
    <div className={`${styles.playpause} ${isPlaying ? styles.playing : ""}`}>
      <div className={styles.button}></div>
    </div>
  );
};

export default PlayPauseIcon;
