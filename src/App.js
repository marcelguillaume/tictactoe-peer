import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Game from "./components/Game/Game";
import Home from "./components/Home/Home";
import { GameProvider } from "./gameContext";


const App = () => { 
  
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route index path="/game" element={<Game />} />
          <Route index path="/:idGame" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  )
}


export default App;
