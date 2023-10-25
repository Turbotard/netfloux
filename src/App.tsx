import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import SeriesList from "./components/SeriesList";

function App(): React.ReactElement {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/list" element={<SeriesList />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
