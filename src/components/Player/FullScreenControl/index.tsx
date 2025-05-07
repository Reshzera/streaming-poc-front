import React, { useState, useEffect } from "react";
import { FaExpand, FaCompress } from "react-icons/fa";
import styles from "./styles.module.scss";

type FullScreenControlProps = {
  playerContainerRef: React.RefObject<HTMLDivElement | null>;
};

const FullScreenControl: React.FC<FullScreenControlProps> = ({
  playerContainerRef,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Update fullscreen state when it changes via other means (like Esc key)
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const toggleFullScreen = async () => {
    if (!playerContainerRef.current) return;
    try {
      if (!isFullScreen) {
        await playerContainerRef.current.requestFullscreen();
        playerContainerRef.current.style.maxHeight = "600px";
        return;
      }

      await document.exitFullscreen();
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  return (
    <button
      className={styles.fullScreenButton}
      onClick={toggleFullScreen}
      title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
    >
      {isFullScreen ? <FaCompress /> : <FaExpand />}
    </button>
  );
};

export default FullScreenControl;
