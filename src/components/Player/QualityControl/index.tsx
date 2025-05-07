import React, { useState } from "react";
import { FaCog } from "react-icons/fa";
import Hls, { Level } from "hls.js";
import styles from "./styles.module.scss";

type QualityControlProps = {
  hlsInstance: Hls | null;
  levels: Level[];
  selectedLevel: number;
  setSelectedLevel: React.Dispatch<React.SetStateAction<number>>;
};

const QualityControl: React.FC<QualityControlProps> = ({
  hlsInstance,
  levels,
  selectedLevel,
  setSelectedLevel,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLevelChange = (levelIndex: number) => {
    setSelectedLevel(levelIndex);
    if (hlsInstance) {
      hlsInstance.currentLevel = levelIndex;
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={styles.qualityControl}>
      <button
        className={styles.qualityButton}
        onClick={toggleMenu}
        title="Quality Settings"
      >
        <FaCog />
      </button>

      {isMenuOpen && (
        <div className={styles.qualityMenu}>
          <div className={styles.menuHeader}>Quality</div>
          <ul className={styles.qualityList}>
            <li
              className={`${styles.qualityOption} ${
                selectedLevel === -1 ? styles.active : ""
              }`}
              onClick={() => handleLevelChange(-1)}
            >
              Auto
            </li>

            {levels.map((level, index) => (
              <li
                key={index}
                className={`${styles.qualityOption} ${
                  selectedLevel === index ? styles.active : ""
                }`}
                onClick={() => handleLevelChange(index)}
              >
                {level.height}px
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QualityControl;
