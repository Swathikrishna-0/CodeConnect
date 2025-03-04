import "./App.scss";
import Landing from "./Pages/Landing";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './Pages/Auth';
import Feed from './Components/MainPages/Feed/Feed';
import Myaccount from './Components/MainPages/MyAccount/Myaccount';
import Publicprofile from './Components/MainPages/PublicProfile/Publicprofile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Auth />} />
        <Route path="/" element={<Landing />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/myaccount" element={<Myaccount />} />
        <Route path="/profile/:userId" element={<Publicprofile />} />
      </Routes>
    </Router>
  );
}

export default App;
