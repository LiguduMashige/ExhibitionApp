import React, { useState } from 'react';
import './ArtistCarousel.css';

const ArtistCarousel = ({ artists, categoryTitle, onArtistClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Show 3 artists at a time (previous, current, next)
  const visibleArtists = [];
  for (let i = -1; i <= 1; i++) {
    const index = (currentIndex + i + artists.length) % artists.length;
    visibleArtists.push({ ...artists[index], position: i });
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % artists.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + artists.length) % artists.length);
  };

  if (!artists || artists.length === 0) {
    return (
      <div className="carousel-empty">
        <p>No artists found in this category</p>
      </div>
    );
  }

  return (
    <div className="artist-carousel">
      <h2 className="carousel-title">{categoryTitle}</h2>
      <p className="carousel-subtitle">
        Browse through the range of different digital artists in South Africa and connect with artists that you may need for your projects.
      </p>

      <div className="carousel-container">
        <div className="carousel-track">
          {visibleArtists.map((artist, index) => (
            <div
              key={`${artist.id}-${index}`}
              className={`carousel-card ${artist.position === 0 ? 'active' : ''} ${
                artist.position === -1 ? 'prev' : artist.position === 1 ? 'next' : ''
              }`}
              onClick={() => artist.position === 0 && onArtistClick(artist)}
            >
              <div className="card-image">
                <img src={artist.image} alt={artist.name} />
              </div>
              <h3 className="card-name">{artist.name}</h3>
              <p className="card-description">
                {artist.description.length > 150
                  ? artist.description.substring(0, 150) + '...'
                  : artist.description}
              </p>
            </div>
          ))}
        </div>

        <div className="carousel-controls">
          <button className="carousel-btn prev-btn" onClick={handlePrev} aria-label="Previous artist">
            ←
          </button>
          <button className="carousel-btn next-btn" onClick={handleNext} aria-label="Next artist">
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistCarousel;
