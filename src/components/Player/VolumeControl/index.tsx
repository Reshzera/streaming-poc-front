import React, { useState, useEffect } from "react";
import { FaVolumeUp, FaVolumeDown, FaVolumeMute } from "react-icons/fa";
import styles from "./styles.module.scss";

type VolumeControlProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

const VolumeControl: React.FC<VolumeControlProps> = ({ videoRef }) => {
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize volume state
    setVolume(videoRef.current.volume);
    setIsMuted(videoRef.current.muted);

    // Set up event listeners for volume changes made outside this component
    const handleVolumeChange = () => {
      if (!videoRef.current) return;
      setVolume(videoRef.current.volume);
      setIsMuted(videoRef.current.muted);
    };

    videoRef.current.addEventListener("volumechange", handleVolumeChange);

    return () => {
      if (videoRef.current) {
        videoRef?.current.removeEventListener(
          "volumechange",
          handleVolumeChange
        );
      }
    };
  }, [videoRef]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (videoRef.current) {
      videoRef.current.volume = newVolume;

      // If the volume is being increased from 0, unmute
      if (newVolume > 0 && isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }

      // If the volume is set to 0, mute
      if (newVolume === 0 && !isMuted) {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    const newMuteState = !isMuted;
    videoRef.current.muted = newMuteState;
    setIsMuted(newMuteState);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <FaVolumeMute />;
    }

    if (volume < 0.5) {
      return <FaVolumeDown />;
    }

    return <FaVolumeUp />;
  };

  return (
    <div
      className={styles.volumeControl}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <button
        className={styles.muteButton}
        onClick={toggleMute}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {getVolumeIcon()}
      </button>

      <div
        className={`${styles.volumeSliderContainer} ${
          isHovering ? styles.visible : ""
        }`}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className={styles.volumeSlider}
        />
      </div>
    </div>
  );
};

export default VolumeControl;
