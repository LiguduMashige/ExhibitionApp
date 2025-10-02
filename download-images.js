const https = require('https');
const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Download image from URL
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filepath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
};

// Unsplash API - Free images
const getUnsplashImage = async (query, width = 400, height = 400) => {
  // Using Unsplash Source API (no API key required)
  return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(query)}`;
};

// Picsum API - Lorem Ipsum for photos (fallback)
const getPicsumImage = (width = 400, height = 400, id) => {
  return `https://picsum.photos/id/${id}/${width}/${height}`;
};

const downloadAllImages = async () => {
  console.log('🚀 Starting image download...\n');

  // Create directories
  createDir('./public/images/profile-img');
  createDir('./public/images/amahle-artworks-img');
  createDir('./public/images/thabo-artworks-img');
  createDir('./public/images/nomsa-artworks-img');

  const images = [
    // Profile Images
    {
      url: await getUnsplashImage('african woman artist portrait professional'),
      path: './public/images/profile-img/Amahle.jpg',
      description: 'Amahle Ndaba - Profile'
    },
    {
      url: await getUnsplashImage('african man sculptor artist professional headshot'),
      path: './public/images/profile-img/Thabo.jpg',
      description: 'Thabo Molefe - Profile'
    },
    {
      url: await getUnsplashImage('african woman digital artist creative professional'),
      path: './public/images/profile-img/Nomsa.jpg',
      description: 'Nomsa Khumalo - Profile'
    },

    // Amahle's Artworks
    {
      url: await getUnsplashImage('african traditional art mixed media colorful'),
      path: './public/images/amahle-artworks-img/Ancestral_Echoes.jpg',
      description: 'Amahle - Ancestral Echoes'
    },
    {
      url: await getUnsplashImage('ubuntu community art african patterns gold'),
      path: './public/images/amahle-artworks-img/Ubuntu_Rising.jpg',
      description: 'Amahle - Ubuntu Rising'
    },

    // Thabo's Artworks
    {
      url: await getUnsplashImage('bronze sculpture liberation chains freedom art'),
      path: './public/images/thabo-artworks-img/Breaking_Chains.jpg',
      description: 'Thabo - Breaking Chains'
    },
    {
      url: await getUnsplashImage('black white portrait social justice art charcoal'),
      path: './public/images/thabo-artworks-img/Voices_Unheard.jpg',
      description: 'Thabo - Voices Unheard'
    },

    // Nomsa's Artworks
    {
      url: await getUnsplashImage('afrofuturism digital art cyberpunk african masks'),
      path: './public/images/nomsa-artworks-img/Digital_Ancestors.jpg',
      description: 'Nomsa - Digital Ancestors'
    },
    {
      url: await getUnsplashImage('led installation interactive art technology ubuntu'),
      path: './public/images/nomsa-artworks-img/Quantum_Ubuntu.jpg',
      description: 'Nomsa - Quantum Ubuntu'
    }
  ];

  // Download all images
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    try {
      console.log(`📥 Downloading: ${image.description}...`);
      await downloadImage(image.url, image.path);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to download ${image.description}:`, error.message);
      
      // Fallback to Picsum if Unsplash fails
      try {
        console.log(`🔄 Trying fallback for: ${image.description}...`);
        const fallbackUrl = getPicsumImage(400, 400, 100 + i);
        await downloadImage(fallbackUrl, image.path);
      } catch (fallbackError) {
        console.error(`❌ Fallback also failed for ${image.description}`);
      }
    }
  }

  console.log('\n🎉 Image download complete!');
  console.log('\n📁 Images saved to:');
  console.log('   - public/images/profile-img/');
  console.log('   - public/images/amahle-artworks-img/');
  console.log('   - public/images/thabo-artworks-img/');
  console.log('   - public/images/nomsa-artworks-img/');
  console.log('\n✨ Your app should now display unique images for each artist!');
};

// Run the download
downloadAllImages().catch(console.error);
