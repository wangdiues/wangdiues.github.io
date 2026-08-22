import sharp from "sharp";

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0d1b16"/>
  <circle cx="1050" cy="80" r="300" fill="#12241d"/>
  <rect x="72" y="150" width="56" height="6" rx="3" fill="#63b385"/>
  <text x="72" y="240" font-family="Georgia, 'Times New Roman', serif" font-size="76" font-weight="700" fill="#f4f7f5">Wangdi Wangdi</text>
  <text x="72" y="310" font-family="Georgia, 'Times New Roman', serif" font-size="34" fill="#8ccaa4">Senior Forestry Officer · Conservation Researcher</text>
  <text x="72" y="380" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#7c8f88">Biodiversity · Climate science · GIS &amp; remote sensing · Forest governance</text>
  <text x="72" y="540" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#f4f7f5">wangdiues.github.io</text>
  <text x="960" y="590" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#7c8f88">Bhutan · ORCID 0009-0007-7726-1742</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/og.png");
console.log("og.png generated");
