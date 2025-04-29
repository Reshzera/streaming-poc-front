import React from "react";
import useHls from "../../hooks/useHls";
import Control from "./Control";
import ProgressBar from "./ProgressBar/ProgressBar";
import styles from "./styles.module.scss";

type PlayerProps = {
  url: string;
};

const Player: React.FC<PlayerProps> = ({ url }) => {
  const {
    //refs
    videoRef,
    hlsInstance,
    //states
    selectedLevel,
    isPlaying,
    levels,
    buffered,
    currentTime,
    duration,
    //setters
    setSelectedLevel,
    setIsPlaying,
  } = useHls({ url });

  return (
    <div className={styles.playerContainer}>
      <video ref={videoRef} />
      <div className={styles.playerControl}>
        <ProgressBar
          videoRef={videoRef}
          currentTime={currentTime}
          duration={duration}
          buffered={buffered}
        />
        <Control
          hlsInstance={hlsInstance}
          isPlaying={isPlaying}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          setIsPlaying={setIsPlaying}
          videoRef={videoRef}
          levels={levels}
        />
      </div>
    </div>
  );
};

export default Player;
