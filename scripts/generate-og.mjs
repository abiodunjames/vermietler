// Generates /public/images/og-default.png at 1200x630 using sharp.
// Run with: node scripts/generate-og.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#141f30"/>
      <stop offset="55%" stop-color="#1e2d45"/>
      <stop offset="100%" stop-color="#1a3560"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.6">
      <stop offset="0%" stop-color="#2563eb" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#2563eb" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(96,165,250,0.06)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Logo mark (house icon) -->
  <g transform="translate(80, 80)">
    <rect width="56" height="56" rx="14" fill="rgba(37,99,235,0.18)" stroke="rgba(96,165,250,0.35)" stroke-width="1.5"/>
    <g transform="translate(16, 14) scale(0.95)" fill="none" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 11 L13 2 L23 11 V24 H3 Z"/>
      <path d="M9 24 V16 H17 V24"/>
    </g>
  </g>

  <!-- Wordmark -->
  <text x="156" y="118" font-family="Space Grotesk, system-ui, sans-serif" font-size="28" font-weight="700" fill="#ffffff" letter-spacing="-0.5">
    vermiet<tspan fill="#60a5fa">ler</tspan>
  </text>

  <!-- Headline -->
  <text x="80" y="320" font-family="Space Grotesk, system-ui, sans-serif" font-size="68" font-weight="700" fill="#ffffff" letter-spacing="-2.5">
    Property management
  </text>
  <text x="80" y="396" font-family="Space Grotesk, system-ui, sans-serif" font-size="68" font-weight="700" fill="#60a5fa" letter-spacing="-2.5">
    for German landlords.
  </text>

  <!-- Subheading -->
  <text x="80" y="460" font-family="DM Sans, system-ui, sans-serif" font-size="26" font-weight="400" fill="rgba(255,255,255,0.62)" letter-spacing="-0.3">
    Calculators, guides, and software for Vermieter in Germany.
  </text>

  <!-- Tags row -->
  <g transform="translate(80, 525)" font-family="DM Sans, system-ui, sans-serif" font-size="18" fill="rgba(255,255,255,0.55)">
    <text x="0" y="0">vermietler.com</text>
    <text x="220" y="0" fill="rgba(255,255,255,0.35)">·</text>
    <text x="244" y="0">DE / EN</text>
    <text x="324" y="0" fill="rgba(255,255,255,0.35)">·</text>
    <text x="348" y="0">DSGVO compliant</text>
  </g>
</svg>`;

const outDir = path.join(process.cwd(), "public", "images");
fs.mkdirSync(outDir, { recursive: true });

const buffer = Buffer.from(svg);

const outPng = path.join(outDir, "og-default.png");
await sharp(buffer, { density: 144 })
  .resize(1200, 630, { fit: "cover" })
  .png({ compressionLevel: 9, quality: 92 })
  .toFile(outPng);

console.log(`Generated ${outPng}`);

// Also a 1080x1080 square for Slack / Discord previews
const outSquare = path.join(outDir, "og-square.png");
await sharp(buffer, { density: 144 })
  .resize(1080, 1080, { fit: "cover", position: "left" })
  .png({ compressionLevel: 9, quality: 92 })
  .toFile(outSquare);

console.log(`Generated ${outSquare}`);
