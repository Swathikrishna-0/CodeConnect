import "./App.scss";
import Landing from "./Pages/Landing";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './Pages/Auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Auth />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
