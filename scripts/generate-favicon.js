const sharp = require('sharp');
const path = require('path');

// Favicon SVG - Simple coin for small sizes
const faviconSvg = `
<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFE55C"/>
      <stop offset="50%" style="stop-color:#FFD700"/>
      <stop offset="100%" style="stop-color:#B8860B"/>
    </linearGradient>
  </defs>

  <!-- Coin -->
  <circle cx="24" cy="24" r="22" fill="#B8860B"/>
  <circle cx="24" cy="24" r="20" fill="url(#goldGradient)"/>
  <circle cx="24" cy="24" r="16" fill="none" stroke="#B8860B" stroke-width="1.5"/>

  <!-- Letter C -->
  <text x="24" y="30"
        font-family="system-ui, sans-serif"
        font-size="20"
        font-weight="300"
        fill="#B8860B"
        text-anchor="middle">C</text>
</svg>
`;

async function generateFavicon() {
  const outputPath = path.join(__dirname, '..', 'assets', 'favicon.png');

  try {
    await sharp(Buffer.from(faviconSvg))
      .resize(48, 48)
      .png()
      .toFile(outputPath);

    console.log('✅ Favicon generated successfully!');
    console.log(`   Path: ${outputPath}`);
    console.log('   Size: 48x48 PNG');

  } catch (error) {
    console.error('❌ Error generating favicon:', error.message);
    process.exit(1);
  }
}

generateFavicon();
