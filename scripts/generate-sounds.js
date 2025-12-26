const fs = require('fs');
const path = require('path');

// Generate WAV file with simple tone
function generateTone(frequency, duration, volume = 0.5, fadeOut = true) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(44 + numSamples * 2); // WAV header + 16-bit samples

  // WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // AudioFormat (PCM)
  buffer.writeUInt16LE(1, 22); // NumChannels
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
  buffer.writeUInt16LE(2, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  // Generate samples
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let envelope = volume;

    // Apply fade out
    if (fadeOut) {
      const fadeStart = duration * 0.3;
      if (t > fadeStart) {
        envelope *= 1 - (t - fadeStart) / (duration - fadeStart);
      }
    }

    // Apply attack (fade in)
    const attackTime = 0.01;
    if (t < attackTime) {
      envelope *= t / attackTime;
    }

    const sample = Math.sin(2 * Math.PI * frequency * t) * envelope;
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

// Generate coin flip sound (multiple quick tones simulating spinning)
function generateFlipSound() {
  const sampleRate = 44100;
  const duration = 0.4;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // Frequency that changes over time (simulating coin spinning)
    const baseFreq = 800;
    const freqMod = Math.sin(t * 40) * 200; // Wobble effect
    const frequency = baseFreq + freqMod;

    // Envelope with multiple "hits"
    let envelope = 0.4;
    const hitInterval = 0.05;
    const hitPhase = (t % hitInterval) / hitInterval;
    envelope *= Math.exp(-hitPhase * 8); // Quick decay for each hit

    // Overall fade out
    envelope *= 1 - (t / duration);

    const sample = Math.sin(2 * Math.PI * frequency * t) * envelope;
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

// Generate result sound (pleasant chime)
function generateChimeSound(baseFreq, duration = 0.5) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // Multiple harmonics for richer sound
    let sample = 0;
    sample += Math.sin(2 * Math.PI * baseFreq * t) * 0.5;
    sample += Math.sin(2 * Math.PI * baseFreq * 2 * t) * 0.25;
    sample += Math.sin(2 * Math.PI * baseFreq * 3 * t) * 0.125;

    // Envelope: quick attack, slow decay
    let envelope = Math.exp(-t * 4);
    if (t < 0.01) envelope *= t / 0.01;

    sample *= envelope * 0.6;
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

// Generate tap sound (short click)
function generateTapSound() {
  const sampleRate = 44100;
  const duration = 0.08;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // White noise with quick decay
    const noise = (Math.random() * 2 - 1);
    const tone = Math.sin(2 * Math.PI * 1000 * t);
    let sample = (noise * 0.3 + tone * 0.7);

    // Very quick envelope
    let envelope = Math.exp(-t * 60);
    if (t < 0.002) envelope *= t / 0.002;

    sample *= envelope * 0.5;
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

// Convert WAV to MP3 is not easily done in Node without ffmpeg
// So we'll save as WAV and rename to MP3 (expo-av handles both)
// Or just use WAV files

async function main() {
  const soundsDir = path.join(__dirname, '..', 'assets', 'sounds');

  // Generate and save sounds
  const sounds = {
    'coin-flip.mp3': generateFlipSound(),
    'coin-heads.mp3': generateChimeSound(880, 0.4), // A5 - higher, brighter
    'coin-tails.mp3': generateChimeSound(659, 0.4), // E5 - slightly lower
    'tap.mp3': generateTapSound(),
  };

  for (const [filename, buffer] of Object.entries(sounds)) {
    const filepath = path.join(soundsDir, filename);
    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Generated: ${filename}`);
  }

  console.log('\n🎵 All sounds generated successfully!');
  console.log('   Location: assets/sounds/');
}

main();
