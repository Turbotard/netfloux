import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import Signup from "./pages/signup";
import MenuHamburger from "./components/MenuHamburger";

function App(): React.ReactElement {
  return (
    <div className="App">
      <Router>
      <MenuHamburger />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
