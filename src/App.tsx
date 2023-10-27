import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/login";
import Signup from "./pages/signup/signup";
import Profile from "./pages/profile/profile";
import ListPage from "./pages/list/List";
import Genres from "./pages/genres/genres"
import Home from "./pages/home/home";

function App(): React.ReactElement {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/genres" element={<Genres />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
