import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import './HomePage.css';

const HomePage = () => {
  const { state, actions } = useAppContext();
  const [featuredKreatives, setFeaturedKreatives] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Set featured kreatives and organize by categories
    if (state.kreatives.length > 0) {
      setFeaturedKreatives(state.kreatives.slice(0, 6));
      
      // Group kreatives by category
      const categoryGroups = {
        'Fine Artists': state.kreatives.filter(k => k.category === 'fine artist'),
        'Digital Artists': state.kreatives.filter(k => k.category === 'digital artist'),
        'Photographers': state.kreatives.filter(k => k.category === 'photographer'),
        'Animators': state.kreatives.filter(k => k.category === 'animator'),
        'Designers': state.kreatives.filter(k => k.category === 'designer'),
        'Musicians': state.kreatives.filter(k => k.category === 'musician')
      };
      
      setCategories(Object.entries(categoryGroups).filter(([_, kreatives]) => kreatives.length > 0));
    }
  }, [state.kreatives]);

  const handleFavorite = (kreative) => {
    const isFavorited = state.favorites.some(fav => fav.id === kreative.id);
    if (isFavorited) {
      actions.removeFavorite(kreative.id);
    } else {
      actions.addFavorite(kreative);
    }
  };

  const cryptoPartners = [
    { name: 'Ethereum', symbol: 'ETH', logo: '⟠' },
    { name: 'Solana', symbol: 'SOL', logo: '◎' },
    { name: 'Bitcoin', symbol: 'BTC', logo: '₿' },
    { name: 'Polygon', symbol: 'MATIC', logo: '⬟' }
  ];

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="logo-section">
            <img 
              src="/images/logos-img/AfriKreateLogo.png" 
              alt="AfriKreate Logo" 
              className="header-logo"
            />
            <h1 className="app-title">AfriKreate</h1>
          </div>
          
          <nav className="main-nav">
            <button className="nav-btn">Explore</button>
            <button className="nav-btn">Favourites</button>
            <button className="nav-btn">Profile</button>
          </nav>
        </div>
      </header>

      {/* Hero Section with Featured Kreatives */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Discover South Africa's Creative Talent</h2>
          <p className="hero-subtitle">Connect with artists, support creativity, and invest in the future of African art</p>
          
          <div className="featured-profiles">
            <h3 className="section-title">Featured Kreatives</h3>
            <div className="profiles-scroll">
              {featuredKreatives.map((kreative) => (
                <div key={kreative.id} className="profile-card">
                  <div className="profile-image">
                    <img src={kreative.image} alt={kreative.name} />
                    <button 
                      className={`favorite-btn ${state.favorites.some(fav => fav.id === kreative.id) ? 'favorited' : ''}`}
                      onClick={() => handleFavorite(kreative)}
                    >
                      ♡
                    </button>
                  </div>
                  <h4 className="profile-name">{kreative.name}</h4>
                  <p className="profile-category">{kreative.category}</p>
                  <div className="profile-stats">
                    <span className="followers">{kreative.followers} followers</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="explore-btn">Explore All Kreatives</button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        {categories.map(([categoryName, kreatives]) => (
          <div key={categoryName} className="category-row">
            <div className="category-header">
              <h3 className="category-title">{categoryName}</h3>
              <button className="view-all-btn">View All</button>
            </div>
            
            <div className="kreatives-scroll">
              {kreatives.map((kreative) => (
                <div key={kreative.id} className="kreative-card">
                  <div className="kreative-image">
                    <img src={kreative.image} alt={kreative.name} />
                    <div className="kreative-overlay">
                      <button className="view-profile-btn">View Profile</button>
                    </div>
                  </div>
                  <div className="kreative-info">
                    <h4 className="kreative-name">{kreative.name}</h4>
                    <p className="kreative-description">{kreative.description.substring(0, 100)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Crypto Partners Section */}
      <section className="crypto-section">
        <div className="crypto-content">
          <h3 className="section-title">Supported Crypto Wallets</h3>
          <p className="section-subtitle">Invest in creativity with secure blockchain technology</p>
          
          <div className="crypto-partners">
            {cryptoPartners.map((partner) => (
              <div key={partner.symbol} className="crypto-card">
                <div className="crypto-logo">{partner.logo}</div>
                <h4 className="crypto-name">{partner.name}</h4>
                <p className="crypto-symbol">{partner.symbol}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Resources Section */}
      <section className="education-section">
        <div className="education-content">
          <h3 className="section-title">Learn About Blockchain & Art</h3>
          <p className="section-subtitle">Educational resources to help you understand the future of creative investment</p>
          
          <div className="education-grid">
            <article className="education-card">
              <div className="education-image">
                <div className="placeholder-image">📚</div>
              </div>
              <div className="education-content-text">
                <h4>What is Blockchain Art?</h4>
                <p>Learn how blockchain technology is revolutionizing the art world and creating new opportunities for artists and collectors.</p>
                <button className="read-more-btn">Read More</button>
              </div>
            </article>
            
            <article className="education-card">
              <div className="education-image">
                <div className="placeholder-image">💎</div>
              </div>
              <div className="education-content-text">
                <h4>Investing in Creative Assets</h4>
                <p>Discover how to support artists while building a valuable portfolio of creative works and intellectual property.</p>
                <button className="read-more-btn">Read More</button>
              </div>
            </article>
            
            <article className="education-card">
              <div className="education-image">
                <div className="placeholder-image">🌍</div>
              </div>
              <div className="education-content-text">
                <h4>Supporting African Creativity</h4>
                <p>Learn about the impact of supporting local artists and how AfriKreate is building a sustainable creative economy.</p>
                <button className="read-more-btn">Read More</button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <img 
              src="/images/logos-img/AfriKreateLogo.png" 
              alt="AfriKreate Logo" 
              className="footer-logo"
            />
            <p>Empowering South African creativity through blockchain technology</p>
          </div>
          
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">TikTok</a>
              <a href="#" className="social-link">Twitter/X</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2025, AfriKreate – Powered by Ligoody2Shoes</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
