import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BusinessDashboard from './pages/BusinessDashboard';
import DashboardHome from './pages/DashboardHome';
import Analytics from './pages/Analytics';
import Reviews from './pages/Reviews';
import Bonuses from './pages/Bonuses';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/business" element={<BusinessDashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="bonuses" element={<Bonuses />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        {/* TODO: Add more routes for client side */}
      </Routes>
    </Router>
  );
}

export default App;
