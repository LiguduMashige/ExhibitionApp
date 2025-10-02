import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import CustomizationPage from './pages/CustomizationPage';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import CategoryExplorePage from './pages/CategoryExplorePage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedArtist, setSelectedArtist] = useState(null);

  const handleLogin = () => {
    setCurrentPage('customization');
  };

  const handleCustomizationComplete = () => {
    setCurrentPage('home');
  };

  const handleNavigateToExplore = () => {
    setCurrentPage('explore');
  };

  const handleNavigateToCategoryExplore = () => {
    setCurrentPage('categoryExplore');
  };

  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
    setCurrentPage('profile');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedArtist(null);
  };

  const handleBackToCategoryExplore = () => {
    setCurrentPage('categoryExplore');
    setSelectedArtist(null);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'customization':
        return <CustomizationPage onComplete={handleCustomizationComplete} />;
      case 'home':
        return <HomePage 
          onNavigateToExplore={handleNavigateToExplore} 
          onArtistClick={handleArtistClick}
        />;
      case 'explore':
        return <ExplorePage onBack={handleBackToHome} />;
      case 'categoryExplore':
        return <CategoryExplorePage 
          onBack={handleBackToHome}
          onArtistClick={handleArtistClick}
        />;
      case 'profile':
        return <ProfilePage 
          kreative={selectedArtist}
          onBack={handleBackToCategoryExplore}
        />;
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <AppProvider>
      <div className="App">
        {renderCurrentPage()}
      </div>
    </AppProvider>
  );
}

export default App;
