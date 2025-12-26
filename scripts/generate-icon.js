const sharp = require('sharp');
const path = require('path');

// App Icon SVG - Premium Coin Design
const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background gradient -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a1a"/>
      <stop offset="100%" style="stop-color:#2a2a2a"/>
    </linearGradient>

    <!-- Gold gradient for coin -->
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFE55C"/>
      <stop offset="50%" style="stop-color:#FFD700"/>
      <stop offset="100%" style="stop-color:#B8860B"/>
    </linearGradient>

    <!-- Gold glow filter -->
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="30" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Inner shadow for depth -->
    <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feOffset dx="0" dy="4"/>
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.3 0"/>
      <feBlend in2="SourceGraphic"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1024" height="1024" fill="url(#bgGradient)"/>

  <!-- Outer glow ring -->
  <circle cx="512" cy="512" r="380" fill="none" stroke="#FFD700" stroke-width="2" opacity="0.3" filter="url(#glow)"/>

  <!-- Glow behind coin -->
  <circle cx="512" cy="512" r="320" fill="#FFD700" opacity="0.15" filter="url(#glow)"/>

  <!-- Coin outer ring (darkest gold) -->
  <circle cx="512" cy="512" r="300" fill="#B8860B"/>

  <!-- Coin main face -->
  <circle cx="512" cy="512" r="280" fill="url(#goldGradient)"/>

  <!-- Highlight for 3D effect -->
  <circle cx="460" cy="460" r="180" fill="#FFE55C" opacity="0.25"/>

  <!-- Inner decorative ring -->
  <circle cx="512" cy="512" r="230" fill="none" stroke="#B8860B" stroke-width="8"/>

  <!-- Center letter C -->
  <text x="512" y="560"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
        font-size="280"
        font-weight="200"
        fill="#B8860B"
        text-anchor="middle"
        filter="url(#innerShadow)">C</text>

  <!-- Decorative dots around the edge -->
  ${Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30) * Math.PI / 180;
    const x = 512 + Math.cos(angle) * 250;
    const y = 512 + Math.sin(angle) * 250;
    return `<circle cx="${x}" cy="${y}" r="12" fill="#FFE55C"/>`;
  }).join('\n  ')}
</svg>
`;

async function generateIcon() {
  const outputPath = path.join(__dirname, '..', 'assets', 'icon.png');

  try {
    await sharp(Buffer.from(iconSvg))
      .resize(1024, 1024)
      .png()
      .toFile(outputPath);

    console.log('✅ App Icon generated successfully!');
    console.log(`   Path: ${outputPath}`);
    console.log('   Size: 1024x1024 PNG');

    // Also generate adaptive icon for Android
    const adaptiveIconPath = path.join(__dirname, '..', 'assets', 'adaptive-icon.png');
    await sharp(Buffer.from(iconSvg))
      .resize(1024, 1024)
      .png()
      .toFile(adaptiveIconPath);

    console.log('✅ Adaptive Icon generated successfully!');
    console.log(`   Path: ${adaptiveIconPath}`);

  } catch (error) {
    console.error('❌ Error generating icon:', error.message);
    process.exit(1);
  }
}

generateIcon();
