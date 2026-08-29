import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Standard App Icon SVG (512x512)
const standardSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="50%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>
    <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Rounded Squircle -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect x="6" y="6" width="500" height="500" rx="106" stroke="#334155" stroke-width="4" fill="none" opacity="0.6" />

  <!-- Outer Meter Dial Track -->
  <circle cx="256" cy="256" r="168" stroke="#1E293B" stroke-width="24" stroke-linecap="round" fill="none" />
  
  <!-- Active Meter Gauge Arc (Cyan to Blue) -->
  <circle cx="256" cy="256" r="168" stroke="url(#primaryGrad)" stroke-width="24" stroke-linecap="round" stroke-dasharray="750 300" stroke-dashoffset="180" fill="none" />
  
  <!-- Secondary Efficiency Arc (Emerald) -->
  <circle cx="256" cy="256" r="168" stroke="url(#emeraldGrad)" stroke-width="24" stroke-linecap="round" stroke-dasharray="140 900" stroke-dashoffset="-45" fill="none" />

  <!-- Inner Meter Core Circle -->
  <circle cx="256" cy="256" r="124" fill="#0B132B" stroke="#38BDF8" stroke-width="3" stroke-opacity="0.3" />

  <!-- Lightning Bolt Energy Core (Bantay Kuryente) -->
  <path d="M272 130L178 274H252L240 382L334 238H260L272 130Z" fill="url(#amberGrad)" filter="url(#glow)" />
  <path d="M272 130L178 274H252L240 382L334 238H260L272 130Z" fill="#FFFBEB" opacity="0.4" />

  <!-- Dial Ticks -->
  <circle cx="256" cy="76" r="6" fill="#60A5FA" />
  <circle cx="436" cy="256" r="6" fill="#34D399" />
  <circle cx="76" cy="256" r="6" fill="#94A3B8" />
  <circle cx="256" cy="436" r="6" fill="#64748B" />
</svg>
`;

// 2. Maskable Icon SVG (with extra safe zone padding for Android adaptive icons)
const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="50%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>
    <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Solid Full Background for Maskable -->
  <rect width="512" height="512" fill="url(#bgGrad)" />

  <!-- Center Content scaled within the 80% safe zone (384px) -->
  <g transform="translate(51.2, 51.2) scale(0.8)">
    <!-- Outer Meter Dial Track -->
    <circle cx="256" cy="256" r="168" stroke="#1E293B" stroke-width="24" stroke-linecap="round" fill="none" />
    
    <!-- Active Meter Gauge Arc -->
    <circle cx="256" cy="256" r="168" stroke="url(#primaryGrad)" stroke-width="24" stroke-linecap="round" stroke-dasharray="750 300" stroke-dashoffset="180" fill="none" />
    
    <!-- Secondary Efficiency Arc (Emerald) -->
    <circle cx="256" cy="256" r="168" stroke="url(#emeraldGrad)" stroke-width="24" stroke-linecap="round" stroke-dasharray="140 900" stroke-dashoffset="-45" fill="none" />

    <!-- Inner Meter Core Circle -->
    <circle cx="256" cy="256" r="124" fill="#0B132B" stroke="#38BDF8" stroke-width="3" stroke-opacity="0.3" />

    <!-- Lightning Bolt Energy Core -->
    <path d="M272 130L178 274H252L240 382L334 238H260L272 130Z" fill="url(#amberGrad)" filter="url(#glow)" />
    <path d="M272 130L178 274H252L240 382L334 238H260L272 130Z" fill="#FFFBEB" opacity="0.4" />

    <!-- Dial Ticks -->
    <circle cx="256" cy="76" r="6" fill="#60A5FA" />
    <circle cx="436" cy="256" r="6" fill="#34D399" />
    <circle cx="76" cy="256" r="6" fill="#94A3B8" />
    <circle cx="256" cy="436" r="6" fill="#64748B" />
  </g>
</svg>
`;

async function generate() {
  console.log('Generating PWA icons...');

  // Save SVG
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), standardSvg);
  fs.writeFileSync(path.join(publicDir, 'icon-maskable.svg'), maskableSvg);

  // 1. pwa-192x192.png
  await sharp(Buffer.from(standardSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Created /public/pwa-192x192.png');

  // 2. pwa-512x512.png
  await sharp(Buffer.from(standardSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Created /public/pwa-512x512.png');

  // 3. pwa-maskable-192x192.png & pwa-maskable-512x512.png
  await sharp(Buffer.from(maskableSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-192x192.png'));
  console.log('Created /public/pwa-maskable-192x192.png');

  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Created /public/pwa-maskable-512x512.png');

  // 4. apple-touch-icon.png (180x180)
  await sharp(Buffer.from(standardSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created /public/apple-touch-icon.png');

  // 5. favicon-32x32.png & favicon.ico equivalent
  await sharp(Buffer.from(standardSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('Created /public/favicon-32x32.png');

  console.log('All icons generated successfully!');
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
