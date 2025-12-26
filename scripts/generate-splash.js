const sharp = require('sharp');
const path = require('path');

// Splash Icon SVG - Coin only (no background, for splash screen)
const splashSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gold gradient for coin -->
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFE55C"/>
      <stop offset="50%" style="stop-color:#FFD700"/>
      <stop offset="100%" style="stop-color:#B8860B"/>
    </linearGradient>

    <!-- Inner shadow for depth -->
    <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feOffset dx="0" dy="2"/>
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.3 0"/>
      <feBlend in2="SourceGraphic"/>
    </filter>

    <!-- Drop shadow -->
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#FFD700" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Coin outer ring (darkest gold) -->
  <circle cx="256" cy="256" r="240" fill="#B8860B" filter="url(#dropShadow)"/>

  <!-- Coin main face -->
  <circle cx="256" cy="256" r="224" fill="url(#goldGradient)"/>

  <!-- Highlight for 3D effect -->
  <circle cx="220" cy="220" r="140" fill="#FFE55C" opacity="0.25"/>

  <!-- Inner decorative ring -->
  <circle cx="256" cy="256" r="185" fill="none" stroke="#B8860B" stroke-width="6"/>

  <!-- Center letter C -->
  <text x="256" y="290"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
        font-size="180"
        font-weight="200"
        fill="#B8860B"
        text-anchor="middle"
        filter="url(#innerShadow)">C</text>

  <!-- Decorative dots around the edge -->
  ${Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45) * Math.PI / 180;
    const x = 256 + Math.cos(angle) * 200;
    const y = 256 + Math.sin(angle) * 200;
    return `<circle cx="${x}" cy="${y}" r="10" fill="#FFE55C"/>`;
  }).join('\n  ')}
</svg>
`;

async function generateSplash() {
  const outputPath = path.join(__dirname, '..', 'assets', 'splash-icon.png');

  try {
    await sharp(Buffer.from(splashSvg))
      .resize(512, 512)
      .png()
      .toFile(outputPath);

    console.log('✅ Splash Icon generated successfully!');
    console.log(`   Path: ${outputPath}`);
    console.log('   Size: 512x512 PNG');

  } catch (error) {
    console.error('❌ Error generating splash icon:', error.message);
    process.exit(1);
  }
}

generateSplash();
