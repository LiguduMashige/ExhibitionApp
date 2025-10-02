// City aliases for better search
export const cityAliases = {
  'joburg': 'Johannesburg',
  'jozi': 'Johannesburg',
  'jhb': 'Johannesburg',
  'cpt': 'Cape Town',
  'capetown': 'Cape Town',
  'pta': 'Pretoria',
  'tshwane': 'Pretoria',
  'dbn': 'Durban',
  'pe': 'Port Elizabeth',
  'bloem': 'Bloemfontein'
};

// Parse location string to extract city and coordinates
export const parseLocation = (locationString) => {
  const cityCoordinates = {
    'Johannesburg': { lat: -26.2041, lng: 28.0473, province: 'Gauteng' },
    'Randburg': { lat: -26.0937, lng: 27.9817, province: 'Gauteng' },
    'Cape Town': { lat: -33.9249, lng: 18.4241, province: 'Western Cape' },
    'Durban': { lat: -29.8587, lng: 31.0218, province: 'KwaZulu-Natal' },
    'Pretoria': { lat: -25.7479, lng: 28.2293, province: 'Gauteng' },
    'Port Elizabeth': { lat: -33.9608, lng: 25.6022, province: 'Eastern Cape' },
    'Bloemfontein': { lat: -29.0852, lng: 26.1596, province: 'Free State' },
    'East London': { lat: -33.0153, lng: 27.9116, province: 'Eastern Cape' },
    'Pietermaritzburg': { lat: -29.6196, lng: 30.3794, province: 'KwaZulu-Natal' },
    'Polokwane': { lat: -23.9045, lng: 29.4689, province: 'Limpopo' },
    'Kimberley': { lat: -28.7282, lng: 24.7499, province: 'Northern Cape' },
    'Nelspruit': { lat: -25.4753, lng: 30.9703, province: 'Mpumalanga' },
    'Mbombela': { lat: -25.4753, lng: 30.9703, province: 'Mpumalanga' },
    'Rustenburg': { lat: -25.6672, lng: 27.2424, province: 'North West' },
    'George': { lat: -33.9630, lng: 22.4614, province: 'Western Cape' },
    'Stellenbosch': { lat: -33.9321, lng: 18.8602, province: 'Western Cape' },
    'Sandton': { lat: -26.1076, lng: 28.0567, province: 'Gauteng' },
    'Centurion': { lat: -25.8601, lng: 28.1893, province: 'Gauteng' },
  };

  // Check if location string contains any known city
  for (const [city, coords] of Object.entries(cityCoordinates)) {
    if (locationString.toLowerCase().includes(city.toLowerCase())) {
      return {
        city,
        ...coords
      };
    }
  }

  // Default to Johannesburg if no match found
  return {
    city: 'Johannesburg',
    ...cityCoordinates['Johannesburg']
  };
};

// Generate random pricing for artist
export const generatePricing = () => {
  return {
    hourly: Math.floor(Math.random() * 1000) + 300,  // R300-R1300
    daily: Math.floor(Math.random() * 5000) + 1500,   // R1500-R6500
    project: Math.floor(Math.random() * 15000) + 5000  // R5000-R20000
  };
};

// Add slight random offset to prevent exact overlaps
export const addLocationJitter = (lat, lng) => {
  const jitterAmount = 0.05; // ~5km
  return {
    lat: lat + (Math.random() - 0.5) * jitterAmount,
    lng: lng + (Math.random() - 0.5) * jitterAmount
  };
};
