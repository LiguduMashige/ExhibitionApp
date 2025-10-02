import React, { useState } from 'react';
import './ProfilePage.css';

const ProfilePage = ({ kreative, onBack }) => {
  const [activeTab, setActiveTab] = useState('creations');

  if (!kreative) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>Artist not found</h2>
          <button className="back-button" onClick={onBack}>← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header with Back Button */}
      <button className="profile-back-button" onClick={onBack}>
        ←
      </button>

      {/* Artist Profile Header */}
      <div className="profile-header">
        <div className="profile-image-container">
          <img 
            src={kreative.image} 
            alt={kreative.name} 
            className="profile-image"
          />
        </div>
        
        <h1 className="profile-name">{kreative.name}</h1>
        <p className="profile-category">{kreative.category}</p>
        
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{kreative.followers}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">3,75 ETH</span>
            <span className="stat-label">Floor Price</span>
          </div>
        </div>

        <button className="mint-nft-button">Mint NFT</button>
      </div>

      {/* Tabs Navigation */}
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'creations' ? 'active' : ''}`}
          onClick={() => setActiveTab('creations')}
        >
          Creations
        </button>
        <button 
          className={`tab-button ${activeTab === 'participation' ? 'active' : ''}`}
          onClick={() => setActiveTab('participation')}
        >
          Participation
        </button>
        <button 
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Stats
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'creations' && (
          <div className="artworks-grid">
            {kreative.artworks && kreative.artworks.length > 0 ? (
              kreative.artworks.map((artwork) => (
                <div key={artwork.artwork_id} className="artwork-card">
                  <div className="artwork-image-container">
                    <img 
                      src={artwork.image} 
                      alt={artwork.title} 
                      className="artwork-image"
                    />
                  </div>
                  <div className="artwork-info">
                    <h4 className="artwork-title">{artwork.title}</h4>
                    <p className="artwork-details">{artwork.size} • {artwork.medium}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-artworks">
                <p>No artworks available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'participation' && (
          <div className="participation-content">
            <div className="info-section">
              <h3>About {kreative.name}</h3>
              <p className="artist-description">{kreative.description}</p>
            </div>
            <div className="info-section">
              <h3>Location</h3>
              <p className="artist-location">📍 {kreative.location}</p>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-content">
            <div className="stat-card">
              <h3>Total Artworks</h3>
              <p className="stat-number">{kreative.artworks ? kreative.artworks.length : 0}</p>
            </div>
            <div className="stat-card">
              <h3>Followers</h3>
              <p className="stat-number">{kreative.followers}</p>
            </div>
            <div className="stat-card">
              <h3>Category</h3>
              <p className="stat-text">{kreative.category}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
