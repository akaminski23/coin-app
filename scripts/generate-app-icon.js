const sharp = require('sharp');
const path = require('path');

// EXACT colors from CoinFlip.tsx - GOLD coin
const GOLD = {
  light: '#FFF8DC',    // Bright highlight
  main: '#FFD700',     // Main gold
  dark: '#B8860B',     // Medium dark for contrast
  stroke: '#DAA520',   // Golden stroke
  letter: '#5C4A00',   // Dark brown for letter
  dots: '#F0E68C',     // Khaki/cream for dots
};

const SIZE = 1024;
const SCALE = SIZE / 200; // Original viewBox is 200x200

// Generate dot positions - 8 dots evenly spaced
function generateDots() {
  const dots = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i * 45 * Math.PI) / 180;
    const cx = 100 + Math.cos(angle) * 80;
    const cy = 100 + Math.sin(angle) * 80;
    dots.push({ cx: cx * SCALE, cy: cy * SCALE, r: 7 * SCALE });
  }
  return dots;
}

const dots = generateDots();
const dotsPath = dots.map(d =>
  `<circle cx="${d.cx}" cy="${d.cy}" r="${d.r}" fill="${GOLD.dots}" stroke="${GOLD.dark}" stroke-width="${1 * SCALE}"/>`
).join('\n    ');

// SVG matching EXACTLY the CoinFaceView component
const svg = `
<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background for no-alpha -->
  <rect width="${SIZE}" height="${SIZE}" fill="${GOLD.dark}"/>

  <!-- Outer edge - stroke color -->
  <circle cx="${SIZE/2}" cy="${SIZE/2}" r="${99 * SCALE}" fill="${GOLD.stroke}"/>

  <!-- Outer ring - dark gold -->
  <circle cx="${SIZE/2}" cy="${SIZE/2}" r="${96 * SCALE}" fill="${GOLD.dark}"/>

  <!-- Main coin face -->
  <circle cx="${SIZE/2}" cy="${SIZE/2}" r="${90 * SCALE}" fill="${GOLD.main}"/>

  <!-- Highlight for 3D effect -->
  <circle cx="${SIZE/2}" cy="${SIZE/2}" r="${55 * SCALE}" fill="${GOLD.light}" opacity="0.35"/>

  <!-- Inner decorative ring -->
  <circle cx="${SIZE/2}" cy="${SIZE/2}" r="${72 * SCALE}" fill="none" stroke="${GOLD.dark}" stroke-width="${3 * SCALE}" opacity="0.6"/>

  <!-- Center letter C for Coin -->
  <text
    x="${SIZE/2}"
    y="${SIZE/2}"
    dy="0.35em"
    font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif"
    font-size="${78 * SCALE}"
    font-weight="900"
    fill="${GOLD.letter}"
    text-anchor="middle"
  >C</text>

  <!-- Decorative dots -->
  ${dotsPath}
</svg>
`;

async function generateIcon() {
  try {
    const outputPath = path.join(__dirname, '..', 'assets', 'icon.png');

    await sharp(Buffer.from(svg))
      .png()
      .flatten({ background: GOLD.dark }) // Ensure no alpha
      .toFile(outputPath);

    console.log(`✅ Icon generated: ${outputPath}`);
    console.log(`   Size: ${SIZE}x${SIZE}`);
    console.log(`   Letter: C (for Coin)`);
    console.log(`   Style: Gold coin (matches app)`);

    // Verify no alpha
    const metadata = await sharp(outputPath).metadata();
    console.log(`   Channels: ${metadata.channels} (${metadata.channels === 3 ? 'no alpha ✓' : 'has alpha ✗'})`);

  } catch (error) {
    console.error('Error generating icon:', error);
  }
}

generateIcon();
