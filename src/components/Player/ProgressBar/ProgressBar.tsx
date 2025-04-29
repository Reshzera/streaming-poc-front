import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

type ProgressBarProps = {
  currentTime: number;
  duration: number;
  buffered: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

type ThumbNail = {
  src: string;
  position: number;
  shouldShow: boolean;
  time: string;
  percent: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  buffered,
  videoRef,
}) => {
  const [thumbNailPosition, setThumbNailPosition] = useState<ThumbNail>({
    src: "",
    position: 0,
    shouldShow: false,
    time: "",
    percent: 0,
  });
  const progressBarRef = useRef<HTMLDivElement>(null);
  const playedPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    if (!progressBarRef.current) return;
    const progressBar = progressBarRef.current;

    const updateThumbNailPosition = (e: MouseEvent) => {
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const time = percent * duration;
      const thumbIndex = Math.ceil(time / 5);

      const thumbnailNumber = String(thumbIndex).padStart(3, "0");
      const thumbNailSrc = `http://localhost:8080/stream/thumbnails/thumb_${thumbnailNumber}.jpg`;

      const mouseX = e.clientX - rect.left;

      const thumbnailWidth = 200;
      const halfThumbWidth = thumbnailWidth / 2;

      let centeredPosition = mouseX - halfThumbWidth;

      if (centeredPosition < 0) {
        centeredPosition = 0;
      }
      if (centeredPosition > rect.width - thumbnailWidth) {
        centeredPosition = rect.width - thumbnailWidth;
      }

      const centeredPercent = (centeredPosition / rect.width) * 100;

      const timeString = new Date(time * 1000).toLocaleTimeString("pt-BR", {
        minute: "2-digit",
        second: "2-digit",
      });

      setThumbNailPosition({
        src: thumbNailSrc,
        position: centeredPercent,
        shouldShow: true,
        time: timeString,
        percent: percent * 100,
      });
    };

    const cleanupThumbNail = () => {
      setThumbNailPosition((prev) => ({
        ...prev,
        shouldShow: false,
      }));
    };

    progressBar.addEventListener("mousemove", updateThumbNailPosition);
    progressBar.addEventListener("mouseleave", cleanupThumbNail);

    return () => {
      progressBar.removeEventListener("mousemove", updateThumbNailPosition);
      progressBar.removeEventListener("mouseleave", cleanupThumbNail);
    };
  }, [duration, progressBarRef]);

  useEffect(() => {
    const progressBar = progressBarRef.current;
    if (!progressBar || !videoRef.current) return;

    let isDragging = false;

    const onMouseDown = (e: MouseEvent) => {
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;

      if (videoRef.current) {
        videoRef.current.currentTime = newTime;
      }

      isDragging = true;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !videoRef.current || !progressBar) return;

      const rect = progressBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, x / rect.width));
      videoRef.current.currentTime = percent * duration;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    progressBar.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      progressBar.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [duration, videoRef, progressBarRef]);

  return (
    <div ref={progressBarRef} className={styles.progressBarContainer}>
      <div className={styles.progressBarWrapper}>
        <div className={styles.bufferedBar} style={{ width: `${buffered}%` }} />
        <div
          className={styles.playedBar}
          style={{ width: `${playedPercent}%` }}
        >
          <div className={styles.playerMarker} />
        </div>
        {thumbNailPosition.shouldShow && (
          <>
            <div
              className={styles.thumbnailContainer}
              style={{
                left: `${thumbNailPosition.position}%`,
              }}
            >
              <img
                src={thumbNailPosition.src}
                alt="Thumbnail"
                className={styles.thumbnailImage}
              />

              <span>{thumbNailPosition.time}</span>
            </div>
            <div
              className={styles.movedBar}
              style={{ width: `${thumbNailPosition.percent}%` }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
