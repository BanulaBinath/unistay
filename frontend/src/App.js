import React from "react";
import './App.css';
import { Routes, Route } from "react-router-dom";

import NomalHome from './Components/Home/nomalhome';
import Login from './Components/Home/login';
import Register from './Components/Home/register';

function App() {
  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<NomalHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

    </div>
  );
}

export default App;