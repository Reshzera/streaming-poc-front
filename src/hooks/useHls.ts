import Hls, { Level } from "hls.js";
import { useRef, useState, useEffect } from "react";

type ReturnUseHls = {
  hlsInstance: Hls | null;
  levels: Level[];
  selectedLevel: number;
  setSelectedLevel: React.Dispatch<React.SetStateAction<number>>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  currentTime: number;
  duration: number;
  buffered: number;
};

type UseHlsProps = {
  url: string;
};

export default function useHls({ url }: UseHlsProps): ReturnUseHls {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevel, setSelectedLevel] = useState(-1); // -1 é auto
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [buffered, setBuffered] = useState<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const hls = new Hls();

      hls.loadSource(url);
      hls.attachMedia(video as HTMLVideoElement);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLevels(hls.levels);
      });

      setHlsInstance(hls);

      return () => {
        hls.destroy();
      };
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    const updateBuffered = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBuffered((bufferedEnd / video.duration) * 100);
      }
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("durationchange", updateDuration);
    video.addEventListener("progress", updateBuffered);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("durationchange", updateDuration);
      video.removeEventListener("progress", updateBuffered);
    };
  }, [videoRef]);

  return {
    hlsInstance,
    levels,
    selectedLevel,
    setSelectedLevel,
    videoRef,
    isPlaying,
    setIsPlaying,
    currentTime,
    duration,
    buffered,
  };
}
