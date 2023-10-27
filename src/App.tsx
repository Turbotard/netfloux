import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/login";
import Signup from "./pages/signup/signup";
import Profile from "./pages/profile/profile";
import ListPage from "./pages/list/List";
import Genres from "./pages/genres/genres"
import Suivis from "./pages/suivis/suivis"
import { useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Home from "./pages/home/Home";

function App(): React.ReactElement {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/calendar" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/suivis" element={<Suivis/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
