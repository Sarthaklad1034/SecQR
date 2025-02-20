import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import SafeSection from './components/SafeSection';
import MaliciousSection from './components/MaliciousSection';

// Wrapper component to handle navigation
const HomeWrapper = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (section, image, url) => {
    navigate(`/${section}`, {
      state: {
        url,
        imageSrc: image
      }
    });
  };

  return <HomeScreen onNavigate={handleNavigate} />;
};

// Main App component
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<HomeWrapper />} />
          <Route path="/safe" element={<SafeSection />} />
          <Route path="/malicious" element={<MaliciousSection />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;