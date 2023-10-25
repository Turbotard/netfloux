import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import ListPage from "./pages/List";
import PopularSeriesCorridor from "./components/PopularSeriesCorridor";

function App(): React.ReactElement {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/list" element={<ListPage />} />
        </Routes>
        <PopularSeriesCorridor />
      </Router>
    </div>
  );
}

export default App;
