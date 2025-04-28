import React, { useRef, useEffect, useState } from "react";
import Hls, { Level } from "hls.js";
// const VIDEO_URL = "http://localhost:8080/stream/videos/master.m3u8";
const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevel, setSelectedLevel] = useState(-1); // -1 é auto

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const hls = new Hls();

      hls.loadSource("http://localhost:8080/stream/videos/master.m3u8");
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

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelIndex = parseInt(e.target.value, 10);
    setSelectedLevel(levelIndex);
    if (hlsInstance) {
      hlsInstance.currentLevel = levelIndex;
    }
  };

  return (
    <div className="player-container">
      <video
        ref={videoRef}
        controls
        style={{ width: "100%", maxHeight: "500px" }}
      />

      <div className="controls">
        <label>Qualidade:</label>
        <select value={selectedLevel} onChange={handleLevelChange}>
          <option value={-1}>Auto</option>
          {levels.map((level, index) => (
            <option key={index} value={index}>
              {level.height}p
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default App;
