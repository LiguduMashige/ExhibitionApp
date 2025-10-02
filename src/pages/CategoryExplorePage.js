import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import ArtistCarousel from '../components/ArtistCarousel';
import './CategoryExplorePage.css';

const CategoryExplorePage = ({ onBack, onArtistClick }) => {
  const { state } = useAppContext();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (state.kreatives.length > 0) {
      // Group kreatives by category
      const categoryGroups = {
        'DIGITAL ARTISTS': state.kreatives.filter(k => k.category === 'digital artist'),
        'FINE & VISUAL ARTISTS': state.kreatives.filter(k => k.category === 'fine artist'),
        'PHOTOGRAPHERS': state.kreatives.filter(k => k.category === 'photographer'),
        'ANIMATORS': state.kreatives.filter(k => k.category === 'animator'),
        'DESIGNERS': state.kreatives.filter(k => k.category === 'designer'),
        'MUSICIANS': state.kreatives.filter(k => k.category === 'musician')
      };

      // Filter out empty categories
      const filteredCategories = Object.entries(categoryGroups).filter(
        ([_, kreatives]) => kreatives.length > 0
      );

      setCategories(filteredCategories);
    }
  }, [state.kreatives]);

  return (
    <div className="category-explore-container">
      {/* Header */}
      <header className="category-explore-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <div className="logo-section">
          <img 
            src="/images/logos-img/AfriKreateLogo.png" 
            alt="AfriKreate Logo" 
            className="header-logo"
          />
          <h1 className="app-title">AfriKreate</h1>
        </div>
        <nav className="header-nav">
          <button className="nav-link">Home</button>
          <button className="nav-link active">Creatives</button>
          <button className="nav-link">Events</button>
          <button className="nav-link">Contact</button>
          <button className="login-btn">Login</button>
        </nav>
      </header>

      {/* Categories with Carousels */}
      <div className="categories-content">
        {categories.map(([categoryName, kreatives]) => (
          <ArtistCarousel
            key={categoryName}
            artists={kreatives}
            categoryTitle={categoryName}
            onArtistClick={onArtistClick}
          />
        ))}
      </div>

      {categories.length === 0 && (
        <div className="no-categories">
          <h2>No artists available</h2>
          <p>Check back later for amazing South African kreatives!</p>
        </div>
      )}
    </div>
  );
};

export default CategoryExplorePage;
