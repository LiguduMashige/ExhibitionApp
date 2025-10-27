import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import LeafletArtistsMap from '../components/LeafletArtistsMap';
import BackgroundAnimations from '../components/BackgroundAnimations';
import { parseLocation } from '../utils/locationParser';
import './ExplorePage.css';

// Utility functions
const addLocationJitter = (lat, lng) => {
  const jitterAmount = 0.01; // Small amount to prevent exact overlaps
  return {
    lat: lat + (Math.random() - 0.5) * jitterAmount,
    lng: lng + (Math.random() - 0.5) * jitterAmount
  };
};

const generatePricing = () => {
  const basePrice = Math.floor(Math.random() * 5000) + 1000; // R1000 - R6000
  return {
    hourly: basePrice,
    daily: basePrice * 6,
    project: basePrice * 20
  };
};

// City aliases for search
const cityAliases = {
  'joburg': 'Johannesburg',
  'jozi': 'Johannesburg',
  'jhb': 'Johannesburg',
  'cape town': 'Cape Town',
  'cpt': 'Cape Town',
  'durbs': 'Durban',
  'dbn': 'Durban',
  'pta': 'Pretoria',
  'tshwane': 'Pretoria'
};

const ExplorePage = ({ onBack }) => {
  const { state } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [radiusFilter, setRadiusFilter] = useState(50);
  const [filteredKreatives, setFilteredKreatives] = useState([]);
  const [selectedKreative, setSelectedKreative] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  // Parse locations from kreatives.json and add pricing (memoized to prevent regeneration)
  const kreativesWithLocations = useMemo(() => {
    return state.kreatives.map((kreative) => {
      const locationData = parseLocation(kreative.location);
      const jitteredCoords = addLocationJitter(locationData.lat, locationData.lng);

      return {
        ...kreative,
        ...jitteredCoords,
        city: locationData.city,
        province: locationData.province,
        pricing: generatePricing()
      };
    });
  }, [state.kreatives]);

  // Get unique cities and provinces for filters
  const locations = [...new Set(kreativesWithLocations.map(k => k.city))].sort();
  const provinces = [...new Set(kreativesWithLocations.map(k => k.province))].sort();

  const categories = [
    'all',
    'fine artist',
    'digital artist',
    'photographer',
    'animator',
    'designer',
    'musician'
  ];

  useEffect(() => {
    // Only filter if there's an active search or filters applied
    const hasActiveSearch = searchQuery.trim() !== '' || selectedCategory !== 'all' || locationFilter !== 'all';
    setIsSearchActive(hasActiveSearch);

    if (hasActiveSearch) {
      filterKreatives();
      setHasSearched(true);
    } else {
      // Show all artists by default on map
      setFilteredKreatives(kreativesWithLocations);
    }
  }, [searchQuery, selectedCategory, locationFilter, state.kreatives]);

  const filterKreatives = () => {
    let filtered = kreativesWithLocations;
    const query = searchQuery.toLowerCase().trim();

    // Parse search query for category and location
    if (query) {
      // Check for city aliases (joburg, jozi, etc.)
      let searchCity = null;
      Object.keys(cityAliases).forEach(alias => {
        if (query.includes(alias)) {
          searchCity = cityAliases[alias];
        }
      });

      // Also check for full city names
      const cities = [...new Set(kreativesWithLocations.map(k => k.city))];
      cities.forEach(city => {
        if (query.includes(city.toLowerCase())) {
          searchCity = city;
        }
      });

      // Filter based on search
      filtered = filtered.filter(kreative => {
        const matchesName = kreative.name.toLowerCase().includes(query);
        const matchesCategory = kreative.category.toLowerCase().includes(query) ||
          query.includes(kreative.category.toLowerCase());
        const matchesCity = searchCity ? kreative.city === searchCity :
          kreative.city.toLowerCase().includes(query);
        const matchesProvince = kreative.province.toLowerCase().includes(query);

        // If searching "fine artist in joburg", both must match
        if (searchCity && (query.includes('artist') || query.includes('photographer') ||
          query.includes('designer') || query.includes('musician'))) {
          return matchesCategory && matchesCity;
        }

        return matchesName || matchesCategory || matchesCity || matchesProvince;
      });
    }

    // Filter by category dropdown
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(kreative => kreative.category === selectedCategory);
    }

    // Filter by location dropdown (city or province)
    if (locationFilter !== 'all') {
      filtered = filtered.filter(kreative =>
        kreative.city === locationFilter || kreative.province === locationFilter
      );
    }

    setFilteredKreatives(filtered);
  };

  const handleSearch = () => {
    if (searchQuery.trim() || selectedCategory !== 'all' || locationFilter !== 'all') {
      setHasSearched(true);
      filterKreatives();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setLocationFilter('all');
    setFilteredKreatives(kreativesWithLocations);
    setHasSearched(false);
    setIsSearchActive(false);
  };

  const handleKreativeClick = (kreative) => {
    setSelectedKreative(kreative);
  };

  const closePopup = () => {
    setSelectedKreative(null);
  };

  const handleMapArtistClick = (artist) => {
    setSelectedKreative(artist);
  };

  return (
    <div className="explore-container">
      <BackgroundAnimations intensity="light" theme="purple" />
      {/* Header */}
      <header className="explore-header">
        <div className="header-content">
          <button className="back-btn" onClick={onBack}>
            ← Back
          </button>
          <div className="logo-section">
            <img
              src={`${process.env.PUBLIC_URL}/images/logos-img/AfriKreateLogo.png`}
              alt="AfriKreate Logo"
              className="header-logo"
              onError={(e) => {
                console.log('Logo failed to load from:', e.target.src);
                e.target.src = "/images/logos-img/AfriKreateLogo.png";
              }}
            />
          </div>
        </div>
      </header>

      <div className="explore-content">
        {/* Search and Filters Section */}
        <div className="search-section">
          <div className="search-container">
            <h2 className="explore-title">Map Search Explore</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for artists, categories, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="search-input"
              />
              <button className="search-btn" onClick={handleSearch}>🔍</button>
              {hasSearched && (
                <button className="clear-btn" onClick={handleClearSearch}>✕</button>
              )}
            </div>

            <button
              className="filters-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters {showFilters ? '▲' : '▼'}
            </button>

            {showFilters && (
              <div className="filters-panel">
                <div className="filter-group">
                  <label>Category:</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>City:</label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    <option value="all">All Cities</option>
                    {locations.map(location => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Province:</label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    <option value="all">All Provinces</option>
                    {provinces.map(province => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results Summary - Only show when searched */}
          {hasSearched && (
            <div className="results-summary">
              <h3>Results: {filteredKreatives.length} {selectedCategory !== 'all' ? selectedCategory + 's' : 'kreatives'} found</h3>
              <p>Based on your search, we have found {filteredKreatives.length} kreatives in your area matching your description</p>
            </div>
          )}

          {/* Default state when no search */}
          {!hasSearched && (
            <div className="search-prompt">
              <h3>🗺️ Discover South African Kreatives</h3>
              <p>Use the search above or apply filters to find amazing artists, designers, and creators across South Africa</p>
            </div>
          )}
        </div>

        {/* Map and Results Layout */}
        <div className="map-results-container">
          {/* Interactive Map Section */}
          <div className="map-section">
            <div className="map-container">
              <LeafletArtistsMap
                artists={filteredKreatives}
                onArtistClick={handleMapArtistClick}
              />

              {/* Map Info */}
              <div className="google-map-info">
                <div className="map-attribution">
                  <span>© 2024 AfriKreate</span>
                </div>
                <div className="map-stats">
                  <span>{filteredKreatives.length} kreatives shown</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results List - Only show when searched */}
          <div className="results-section">
            {!hasSearched ? (
              <div className="no-search-state">
                <div className="search-illustration">
                  🎨
                </div>
                <h3>Start Your Creative Journey</h3>
                <p>Search for artists, filter by category, or select a location to discover talented kreatives across South Africa.</p>
                <div className="quick-filters">
                  <button
                    className="quick-filter-btn"
                    onClick={() => { setSelectedCategory('digital artist'); setHasSearched(true); }}
                  >
                    Digital Artists
                  </button>
                  <button
                    className="quick-filter-btn"
                    onClick={() => { setSelectedCategory('photographer'); setHasSearched(true); }}
                  >
                    Photographers
                  </button>
                  <button
                    className="quick-filter-btn"
                    onClick={() => { setLocationFilter('Cape Town'); setHasSearched(true); }}
                  >
                    Cape Town
                  </button>
                </div>
              </div>
            ) : (
              <div className="results-list">
                {filteredKreatives.length > 0 ? (
                  filteredKreatives.map((kreative) => (
                    <div
                      key={kreative.id}
                      className="result-item"
                      onClick={() => handleKreativeClick(kreative)}
                    >
                      <div className="result-image">
                        <img src={kreative.image} alt={kreative.name} />
                      </div>
                      <div className="result-info">
                        <h4>{kreative.name}</h4>
                        <p className="result-category">{kreative.category}</p>
                        <p className="result-location">📍 {kreative.city}, {kreative.province}</p>
                        <p className="result-followers">👥 {kreative.followers} followers</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <h3>No kreatives found</h3>
                    <p>Try adjusting your search criteria or filters to find more results.</p>
                    <button className="clear-search-btn" onClick={handleClearSearch}>
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kreative Popup */}
      {selectedKreative && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopup}>×</button>
            <div className="popup-header">
              <img src={selectedKreative.image} alt={selectedKreative.name} />
              <div className="popup-info">
                <h3>{selectedKreative.name}</h3>
                <p className="popup-category">{selectedKreative.category}</p>
                <p className="popup-location">📍 {selectedKreative.city}, {selectedKreative.province}</p>
                <p className="popup-followers">👥 {selectedKreative.followers} followers</p>
              </div>
            </div>
            <div className="popup-description">
              <p>{selectedKreative.description.substring(0, 200)}...</p>
            </div>
            <button className="view-profile-btn">View Full Profile</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
