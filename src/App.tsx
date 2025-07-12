import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import ItemDetail from './pages/ItemDetail';
import AddItem from './pages/AddItem';
import AdminPanel from './pages/AdminPanel';
import BrowseItems from './pages/BrowseItems';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/browse" element={<BrowseItems />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/add-item" element={<AddItem />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;