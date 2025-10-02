const https = require('https');
const fs = require('fs');

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

const downloadAllImages = async () => {
  console.log('🚀 Starting image download from Picsum (Lorem Ipsum for photos)...\n');

  // Create directories
  createDir('./public/images/profile-img');
  createDir('./public/images/amahle-artworks-img');
  createDir('./public/images/thabo-artworks-img');
  createDir('./public/images/nomsa-artworks-img');

  // Using Picsum Photos - reliable, no rate limits
  const images = [
    // Profile Images (portrait oriented)
    {
      url: 'https://picsum.photos/400/500?random=1',
      path: './public/images/profile-img/Amahle.jpg',
      description: 'Amahle Ndaba - Profile'
    },
    {
      url: 'https://picsum.photos/400/500?random=2',
      path: './public/images/profile-img/Thabo.jpg',
      description: 'Thabo Molefe - Profile'
    },
    {
      url: 'https://picsum.photos/400/500?random=3',
      path: './public/images/profile-img/Nomsa.jpg',
      description: 'Nomsa Khumalo - Profile'
    },

    // Amahle's Artworks (square format for art)
    {
      url: 'https://picsum.photos/600/400?random=10',
      path: './public/images/amahle-artworks-img/Ancestral_Echoes.jpg',
      description: 'Amahle - Ancestral Echoes'
    },
    {
      url: 'https://picsum.photos/600/400?random=11',
      path: './public/images/amahle-artworks-img/Ubuntu_Rising.jpg',
      description: 'Amahle - Ubuntu Rising'
    },

    // Thabo's Artworks
    {
      url: 'https://picsum.photos/600/400?random=20',
      path: './public/images/thabo-artworks-img/Breaking_Chains.jpg',
      description: 'Thabo - Breaking Chains'
    },
    {
      url: 'https://picsum.photos/600/400?random=21',
      path: './public/images/thabo-artworks-img/Voices_Unheard.jpg',
      description: 'Thabo - Voices Unheard'
    },

    // Nomsa's Artworks
    {
      url: 'https://picsum.photos/600/400?random=30',
      path: './public/images/nomsa-artworks-img/Digital_Ancestors.jpg',
      description: 'Nomsa - Digital Ancestors'
    },
    {
      url: 'https://picsum.photos/600/400?random=31',
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
      // Add small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Failed to download ${image.description}:`, error.message);
    }
  }

  console.log('\n🎉 Image download complete!');
  console.log('\n📁 New unique images saved to:');
  console.log('   - public/images/profile-img/ (3 unique portraits)');
  console.log('   - public/images/amahle-artworks-img/ (2 unique artworks)');
  console.log('   - public/images/thabo-artworks-img/ (2 unique artworks)');
  console.log('   - public/images/nomsa-artworks-img/ (2 unique artworks)');
  console.log('\n✨ Each artist now has completely different images!');
  console.log('\n🔄 Refresh your React app to see the new images.');
};

// Run the download
downloadAllImages().catch(console.error);
