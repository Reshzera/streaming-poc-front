import Hls, { Level } from "hls.js";
import React, { useEffect } from "react";
import FullScreenControl from "../FullScreenControl";
import PlayPauseIcon from "../PlayPuaseIcon";
import QualityControl from "../QualityControl";
import VolumeControl from "../VolumeControl";
import styles from "./styles.module.scss";

type ControlProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  playerContainerRef: React.RefObject<HTMLDivElement | null>;
  hlsInstance: Hls | null;
  selectedLevel: number;
  setSelectedLevel: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  levels: Level[];
};

const Control: React.FC<ControlProps> = ({
  videoRef,
  playerContainerRef,
  hlsInstance,
  selectedLevel,
  setSelectedLevel,
  isPlaying,
  setIsPlaying,
  levels,
}) => {
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
      <div className={styles.leftControls}>
        <button className={styles.playButton} onClick={handlePlayPause}>
          <PlayPauseIcon isPlaying={isPlaying} />
        </button>
        <VolumeControl videoRef={videoRef} />
      </div>

      <div className={styles.rightControls}>
        <QualityControl
          hlsInstance={hlsInstance}
          levels={levels}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
        />
        <FullScreenControl playerContainerRef={playerContainerRef} />
      </div>
    </div>
  );
};

export default Control;
