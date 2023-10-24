import React, { ReactNode } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from "./pages/login"

function App(): React.ReactElement {
  return (
    <div className="App">
      <Router>
        <Routes>        
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;