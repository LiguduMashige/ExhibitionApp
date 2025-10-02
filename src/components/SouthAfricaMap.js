import React from 'react';
import './SouthAfricaMap.css';

const SouthAfricaMap = ({ zoom, center, onLocationClick, selectedLocation }) => {
  const provinces = [
    { 
      name: 'Western Cape', 
      path: 'M150,200 L180,190 L200,200 L210,220 L200,240 L170,250 L150,240 Z',
      centerX: 180,
      centerY: 220
    },
    { 
      name: 'Eastern Cape', 
      path: 'M210,220 L240,210 L270,220 L280,240 L270,260 L240,270 L210,260 L200,240 Z',
      centerX: 240,
      centerY: 240
    },
    { 
      name: 'Northern Cape', 
      path: 'M150,140 L200,130 L230,140 L240,170 L220,190 L180,180 L150,170 Z',
      centerX: 190,
      centerY: 160
    },
    { 
      name: 'Free State', 
      path: 'M240,170 L270,160 L290,170 L295,190 L280,210 L250,200 L240,180 Z',
      centerX: 265,
      centerY: 185
    },
    { 
      name: 'KwaZulu-Natal', 
      path: 'M280,180 L310,170 L330,180 L340,200 L330,220 L310,230 L290,220 L280,200 Z',
      centerX: 310,
      centerY: 200
    },
    { 
      name: 'Gauteng', 
      path: 'M280,140 L295,135 L305,145 L300,155 L285,150 Z',
      centerX: 292,
      centerY: 145
    },
    { 
      name: 'Mpumalanga', 
      path: 'M305,130 L330,125 L345,135 L340,155 L325,160 L305,150 Z',
      centerX: 325,
      centerY: 145
    },
    { 
      name: 'Limpopo', 
      path: 'M280,90 L320,80 L350,90 L355,120 L340,135 L310,130 L280,120 Z',
      centerX: 315,
      centerY: 110
    },
    { 
      name: 'North West', 
      path: 'M230,120 L270,110 L290,130 L285,150 L260,155 L240,145 Z',
      centerX: 260,
      centerY: 135
    }
  ];

  const cities = [
    { name: 'Cape Town', x: 165, y: 230, province: 'Western Cape' },
    { name: 'Johannesburg', x: 290, y: 145, province: 'Gauteng' },
    { name: 'Durban', x: 320, y: 210, province: 'KwaZulu-Natal' },
    { name: 'Pretoria', x: 295, y: 140, province: 'Gauteng' },
    { name: 'Port Elizabeth', x: 255, y: 255, province: 'Eastern Cape' },
    { name: 'Bloemfontein', x: 270, y: 195, province: 'Free State' },
    { name: 'East London', x: 275, y: 250, province: 'Eastern Cape' },
    { name: 'Polokwane', x: 310, y: 105, province: 'Limpopo' },
    { name: 'Kimberley', x: 210, y: 175, province: 'Northern Cape' },
    { name: 'Nelspruit', x: 335, y: 145, province: 'Mpumalanga' }
  ];

  const getTransform = () => {
    const scale = zoom;
    const translateX = (200 - center.lng * 2) * (zoom - 1);
    const translateY = (150 - center.lat * 2) * (zoom - 1);
    return `translate(${translateX}, ${translateY}) scale(${scale})`;
  };

  return (
    <div className="sa-map-container">
      <svg 
        viewBox="0 0 400 300" 
        className="sa-map-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Ocean Background */}
        <rect width="400" height="300" fill="url(#oceanGradient)" />

        {/* Map Group with Transform */}
        <g transform={getTransform()}>
          {/* Provinces */}
          {provinces.map((province) => (
            <g key={province.name}>
              <path
                d={province.path}
                fill="#2d1b4e"
                stroke="#8b5cf6"
                strokeWidth="1.5"
                className="province-path"
                onClick={() => onLocationClick && onLocationClick(province.name)}
              />
              <text
                x={province.centerX}
                y={province.centerY}
                className="province-label"
                textAnchor="middle"
                fill="#a78bfa"
                fontSize="8"
                fontWeight="500"
              >
                {province.name}
              </text>
            </g>
          ))}

          {/* Cities */}
          {cities.map((city) => (
            <g 
              key={city.name}
              onClick={() => onLocationClick && onLocationClick(city.name)}
              className="city-marker"
            >
              <circle
                cx={city.x}
                cy={city.y}
                r={selectedLocation === city.name ? 5 : 3}
                fill={selectedLocation === city.name ? '#fbbf24' : '#8b5cf6'}
                stroke="#ffffff"
                strokeWidth="1"
                filter="url(#shadow)"
                className="city-dot"
              />
              <text
                x={city.x}
                y={city.y - 8}
                className="city-label"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="7"
                fontWeight="600"
              >
                {city.name}
              </text>
            </g>
          ))}
        </g>

        {/* Map Legend */}
        <g className="map-legend">
          <rect x="10" y="250" width="120" height="40" fill="rgba(0,0,0,0.7)" rx="5" />
          <text x="20" y="265" fill="#ffffff" fontSize="9" fontWeight="600">South Africa</text>
          <circle cx="20" cy="278" r="3" fill="#8b5cf6" />
          <text x="28" y="281" fill="#ffffff" fontSize="7">Cities</text>
        </g>
      </svg>
    </div>
  );
};

export default SouthAfricaMap;
