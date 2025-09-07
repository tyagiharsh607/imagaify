import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CelebifyPage from './pages/CelebifyPage';
import CharacterFusePage from './pages/CharacterFusePage';
import PokeFusionPage from './pages/PokeFusionPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/celebify" element={<CelebifyPage />} />
      <Route path="/characterfuse" element={<CharacterFusePage />} />
      <Route path="/pokefusion" element={<PokeFusionPage />} />
    </Routes>
  );
};

export default App;
