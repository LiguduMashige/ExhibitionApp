import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import BlogModal from '../components/BlogModal';
import { blogContent } from '../data/blogContent';
import './HomePage.css';

const HomePage = ({ onNavigateToExplore, onArtistClick }) => {
  const { state, actions } = useAppContext();
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    // Organize all kreatives by categories (no filtering by preferences)
    if (state.kreatives.length > 0) {
      // Group all kreatives by category
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
    { name: 'Polygon', symbol: 'MATIC', logo: '⬟' },
    { name: 'Cardano', symbol: 'ADA', logo: '₳' },
    { name: 'Binance', symbol: 'BNB', logo: '⬡' },
    { name: 'Avalanche', symbol: 'AVAX', logo: '▲' },
    { name: 'Tezos', symbol: 'XTZ', logo: 'ꜩ' },
    { name: 'Polkadot', symbol: 'DOT', logo: '●' }
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
            <button className="nav-btn" onClick={onNavigateToExplore}>Explore</button>
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
            <h3 className="section-title">Recommended For You</h3>
            {state.kreatives.length > 0 ? (
              <>
                <div className="carousel-wrapper">
                  <div className="carousel-items">
                    {[-1, 0, 1].map((offset) => {
                      const index = (currentCarouselIndex + offset + state.kreatives.length) % state.kreatives.length;
                      const kreative = state.kreatives[index];
                      const isActive = offset === 0;
                      
                      return (
                        <div
                          key={`carousel-${index}-${offset}`}
                          className={`carousel-profile-card ${isActive ? 'active' : 'side'}`}
                          onClick={() => isActive && onArtistClick(kreative)}
                          style={{
                            transform: isActive 
                              ? 'scale(1)' 
                              : `scale(0.7) translateX(${offset * 10}px)`,
                            opacity: isActive ? 1 : 0.4,
                            zIndex: isActive ? 10 : 1
                          }}
                        >
                          <div className="carousel-image-wrapper">
                            <img src={kreative.image} alt={kreative.name} className="carousel-profile-image" />
                          </div>
                          <h4 className="carousel-profile-name">{kreative.name}</h4>
                          <p className="carousel-profile-description">
                            {kreative.description.length > 120
                              ? kreative.description.substring(0, 120) + '...'
                              : kreative.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="carousel-dots">
                    {state.kreatives.map((_, index) => (
                      <button
                        key={index}
                        className={`carousel-dot ${index === currentCarouselIndex ? 'active' : ''}`}
                        onClick={() => setCurrentCarouselIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                <button className="explore-btn" onClick={onNavigateToExplore}>Explore All Kreatives</button>
              </>
            ) : (
              <div className="no-results">
                <p>No artists available</p>
                <button className="explore-btn" onClick={onNavigateToExplore}>Explore All Kreatives</button>
              </div>
            )}
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
                <div key={kreative.id} className="kreative-card" onClick={() => onArtistClick(kreative)}>
                  <div className="kreative-image">
                    <img src={kreative.image} alt={kreative.name} />
                    <div className="kreative-overlay">
                      <button className="view-profile-btn" onClick={(e) => {
                        e.stopPropagation();
                        onArtistClick(kreative);
                      }}>View Profile</button>
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
                <button 
                  className="read-more-btn"
                  onClick={() => setSelectedBlog(blogContent['blockchain-art'])}
                >
                  Read More
                </button>
              </div>
            </article>
            
            <article className="education-card">
              <div className="education-image">
                <div className="placeholder-image">💎</div>
              </div>
              <div className="education-content-text">
                <h4>Investing in Creative Assets</h4>
                <p>Discover how to support artists while building a valuable portfolio of creative works and intellectual property.</p>
                <button 
                  className="read-more-btn"
                  onClick={() => setSelectedBlog(blogContent['investing-creative'])}
                >
                  Read More
                </button>
              </div>
            </article>
            
            <article className="education-card">
              <div className="education-image">
                <div className="placeholder-image">🌍</div>
              </div>
              <div className="education-content-text">
                <h4>Supporting African Creativity</h4>
                <p>Learn about the impact of supporting local artists and how AfriKreate is building a sustainable creative economy.</p>
                <button 
                  className="read-more-btn"
                  onClick={() => setSelectedBlog(blogContent['supporting-african'])}
                >
                  Read More
                </button>
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

      {/* Blog Modal */}
      {selectedBlog && (
        <BlogModal 
          blog={selectedBlog} 
          onClose={() => setSelectedBlog(null)} 
        />
      )}
    </div>
  );
};

export default HomePage;
