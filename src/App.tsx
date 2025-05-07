import React from "react";
import Player from "./components/Player";
import "./App.scss";

const App: React.FC = () => {
  return (
    <main>
      <Player url="http://localhost:8080/stream/videos/master.m3u8" />
    </main>
  );
};

export default App;
