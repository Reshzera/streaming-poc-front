import React, { useEffect } from "react";
import styles from "./styles.module.scss";
import Hls, { Level } from "hls.js";
import PlayPauseIcon from "../PlayPuaseIcon";

type ControlProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  hlsInstance: Hls | null;
  selectedLevel: number;
  setSelectedLevel: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  levels: Level[];
};

const Control: React.FC<ControlProps> = ({
  videoRef,
  hlsInstance,
  selectedLevel,
  setSelectedLevel,
  isPlaying,
  setIsPlaying,
}) => {
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelIndex = parseInt(e.target.value, 10);
    setSelectedLevel(levelIndex);
    if (hlsInstance) {
      hlsInstance.currentLevel = levelIndex;
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      return;
    }
    setIsPlaying(false);
    videoRef.current.pause();
  };

  useEffect(() => {
    const handleSpacebar = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handlePlayPause();
      }
    };

    window.addEventListener("keydown", handleSpacebar);
    return () => {
      window.removeEventListener("keydown", handleSpacebar);
    };
  }, []);

  return (
    <div className={styles.controlContainer}>
      <button className={styles.playButton} onClick={handlePlayPause}>
        <PlayPauseIcon isPlaying={isPlaying} />
      </button>
    </div>
  );
};

export default Control;
