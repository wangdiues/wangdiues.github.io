import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const OUTPUT = resolve('public/CLP/Application-20636_CLP_Final.pdf');
const HERO = resolve('src/assets/projects/connected-skies/GH1.jpeg');
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;

const palette = {
  ink: [0.055, 0.082, 0.071],
  forest: [0.12, 0.29, 0.19],
  moss: [0.42, 0.66, 0.43],
  paper: [0.965, 0.957, 0.925],
  white: [1, 1, 1],
  text: [0.12, 0.15, 0.13],
  muted: [0.35, 0.39, 0.36],
  line: [0.82, 0.84, 0.80],
  pale: [0.93, 0.95, 0.91],
};

function escapePdfText(value) {
  return value.replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)');
}

function rgb(values, stroke = false) {
  return `${values.join(' ')} ${stroke ? 'RG' : 'rg'}`;
}

function textLine(commands, value, x, top, size, font = 'F1', color = palette.text) {
  const y = PAGE_HEIGHT - top;
  commands.push(`BT /${font} ${size} Tf ${rgb(color)} 1 0 0 1 ${x} ${y} Tm (${escapePdfText(value)}) Tj ET`);
}

function wrapText(value, maxWidth, size, font = 'F1') {
  const averageWidth = size * (font === 'F2' ? 0.56 : 0.5);
  const maxCharacters = Math.max(12, Math.floor(maxWidth / averageWidth));
  const words = value.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxCharacters && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function textBlock(commands, value, x, top, maxWidth, size, lineHeight, options = {}) {
  const { font = 'F1', color = palette.text } = options;
  const lines = wrapText(value, maxWidth, size, font);
  lines.forEach((line, index) => textLine(commands, line, x, top + index * lineHeight, size, font, color));
  return top + lines.length * lineHeight;
}

function fillRect(commands, x, top, width, height, color) {
  const y = PAGE_HEIGHT - top - height;
  commands.push(`${rgb(color)} ${x} ${y} ${width} ${height} re f`);
}

function strokeLine(commands, x1, top1, x2, top2, color = palette.line, width = 1) {
  commands.push(`${rgb(color, true)} ${width} w ${x1} ${PAGE_HEIGHT - top1} m ${x2} ${PAGE_HEIGHT - top2} l S`);
}

function sectionLabel(commands, value, top) {
  textLine(commands, value.toUpperCase(), 48, top, 8.5, 'F2', palette.forest);
  return top + 18;
}

function heading(commands, value, top, size = 22) {
  textLine(commands, value, 48, top, size, 'F2', palette.ink);
  return top + size + 10;
}

function bulletList(commands, items, top, options = {}) {
  const { x = 58, width = 500, size = 10.5, lineHeight = 15, gap = 7 } = options;
  let cursor = top;
  for (const item of items) {
    fillRect(commands, x, cursor - 6, 5, 5, palette.moss);
    cursor = textBlock(commands, item, x + 16, cursor, width - 16, size, lineHeight, { color: palette.text });
    cursor += gap;
  }
  return cursor;
}

function footer(commands, pageNumber, top = 746) {
  strokeLine(commands, 48, top, 564, top, palette.line, 0.6);
  textLine(commands, 'CONNECTED SKIES  |  PUBLIC PROJECT BRIEF', 48, top + 19, 7.5, 'F2', palette.muted);
  textLine(commands, String(pageNumber), 552, top + 19, 8, 'F1', palette.muted);
}

function stripJpegPrivateMetadata(source) {
  const chunks = [source.subarray(0, 2)];
  let position = 2;
  while (position + 4 <= source.length) {
    if (source[position] !== 0xff) break;
    const marker = source[position + 1];
    if (marker === 0xda) {
      chunks.push(source.subarray(position));
      return Buffer.concat(chunks);
    }
    if (marker === 0xd8 || marker === 0xd9) {
      chunks.push(source.subarray(position, position + 2));
      position += 2;
      continue;
    }
    const length = source.readUInt16BE(position + 2);
    const end = position + 2 + length;
    if (end > source.length) throw new Error('Invalid JPEG segment length');
    const isPrivateMetadata = marker === 0xe1 || marker === 0xed || marker === 0xfe;
    if (!isPrivateMetadata) chunks.push(source.subarray(position, end));
    position = end;
  }
  throw new Error('Could not locate JPEG scan data');
}

function jpegDimensions(buffer) {
  let position = 2;
  while (position + 9 < buffer.length) {
    if (buffer[position] !== 0xff) {
      position += 1;
      continue;
    }
    const marker = buffer[position + 1];
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return {
        height: buffer.readUInt16BE(position + 5),
        width: buffer.readUInt16BE(position + 7),
      };
    }
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0xd8) {
      position += 2;
    } else {
      position += 2 + buffer.readUInt16BE(position + 2);
    }
  }
  throw new Error('Could not read JPEG dimensions');
}

const heroJpeg = stripJpegPrivateMetadata(readFileSync(HERO));
const heroDimensions = jpegDimensions(heroJpeg);

const page1 = [];
page1.push(`q ${PAGE_WIDTH} 0 0 408 0 384 cm /Im1 Do Q`);
fillRect(page1, 0, 408, PAGE_WIDTH, 384, palette.ink);
fillRect(page1, 48, 443, 54, 4, palette.moss);
textLine(page1, 'CONSERVATION LEADERSHIP PROGRAMME', 48, 473, 9, 'F2', palette.moss);
textLine(page1, 'FUTURE CONSERVATIONIST AWARD 2026', 48, 492, 9, 'F2', palette.paper);
let coverTop = 536;
coverTop = textBlock(
  page1,
  "Connected Skies: Bhutan's First GPS-AI Study Empowering Communities to Protect Great Hornbills",
  48,
  coverTop,
  516,
  25,
  31,
  { font: 'F2', color: palette.white }
);
coverTop += 13;
textBlock(
  page1,
  'A public project brief for integrated telemetry, AI bioacoustics, connectivity modelling and community-led conservation in Biological Corridor 03, Bhutan.',
  48,
  coverTop,
  500,
  11.5,
  17,
  { color: palette.paper }
);
textLine(page1, 'TEAM LEADER  /  WANGDI WANGDI', 48, 756, 8.5, 'F2', palette.moss);

const page2 = [];
fillRect(page2, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, palette.white);
let top = sectionLabel(page2, 'Conservation challenge', 52);
top = heading(page2, 'Project Overview', top);
top = textBlock(
  page2,
  "Great hornbills depend on connected forest, large nest trees and dependable fruiting habitat. In Bhutan's 407 km2 Biological Corridor 03, forest degradation, road expansion and climate-driven shifts are reducing nesting trees and safe movement routes. Local movement data remain limited, leaving managers without the evidence needed to identify flight pathways, feeding areas, breeding habitat and connectivity bottlenecks.",
  48,
  top,
  516,
  10.5,
  15.5,
  { color: palette.muted }
);
top += 15;
fillRect(page2, 48, top, 516, 58, palette.pale);
top = textBlock(
  page2,
  'Connected Skies will combine GPS telemetry, artificial intelligence-supported acoustic monitoring and GIS analysis to convert these knowledge gaps into practical corridor conservation guidance.',
  64,
  top + 18,
  484,
  10.5,
  15,
  { font: 'F2', color: palette.forest }
);
top += 27;
top = sectionLabel(page2, 'Integrated field science', top);
top = heading(page2, 'Research Approach', top);

const approaches = [
  {
    title: '01  GPS Telemetry',
    description: 'Supervised, welfare-compliant solar GPS tags will record movement locations under approved veterinary and animal-welfare protocols.',
    points: ['Movement tracking', 'Flight pathways', 'Habitat use'],
  },
  {
    title: '02  AI Bioacoustics',
    description: 'AudioMoth recorders will sample monitoring sites, while BirdNET screens calls for manual validation and repeated-survey analysis.',
    points: ['AudioMoth deployment', 'BirdNET AI detection', 'Occupancy monitoring'],
  },
  {
    title: '03  GIS and Connectivity Modelling',
    description: 'Telemetry, acoustic detections and environmental layers will be integrated to identify priority habitat and corridor bottlenecks.',
    points: ['Habitat mapping', 'Corridor assessment', 'Threat analysis'],
  },
];

for (const approach of approaches) {
  textLine(page2, approach.title, 48, top, 12, 'F2', palette.forest);
  top += 20;
  top = textBlock(page2, approach.description, 48, top, 516, 9.5, 14, { color: palette.muted });
  top += 4;
  textLine(page2, approach.points.join('  /  '), 48, top, 8.5, 'F2', palette.text);
  top += 22;
  if (approach !== approaches.at(-1)) strokeLine(page2, 48, top - 7, 564, top - 7, palette.line, 0.5);
}
footer(page2, 2);

const page3 = [];
fillRect(page3, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, palette.white);
top = sectionLabel(page3, 'Local stewardship', 52);
top = heading(page3, 'Community Conservation', top);
top = textBlock(
  page3,
  'Thirty Hornbill Guardians will connect local stewardship with scientific monitoring. Community participants will help protect important resources, support long-term observation and report emerging threats.',
  48,
  top,
  516,
  10.5,
  15.5,
  { color: palette.muted }
);
top += 13;
top = bulletList(page3, [
  '30 trained Hornbill Guardians',
  'Nest tree protection and fruiting tree monitoring',
  'Threat and disturbance reporting',
  'Support for field monitoring and verified observations',
], top, { x: 48, width: 516, size: 10 });

top += 1;
top = sectionLabel(page3, 'Planned deliverables', top);
top = heading(page3, 'Expected Outputs', top);
top = bulletList(page3, [
  'National hornbill movement database',
  'AI-supported monitoring protocol',
  'Habitat and connectivity assessment for Biological Corridor 03',
  'Transferable community-led corridor conservation model',
], top, { x: 48, width: 516, size: 9.5, lineHeight: 14, gap: 4 });

top += 4;
strokeLine(page3, 48, top, 564, top, palette.line, 0.7);
top += 24;
textLine(page3, 'PROJECT PROFILE', 48, top, 8.5, 'F2', palette.forest);
top += 17;
textLine(page3, 'Year', 48, top, 8.5, 'F2', palette.muted);
textLine(page3, '2026', 138, top, 9.5, 'F1', palette.text);
top += 15;
textLine(page3, 'Role', 48, top, 8.5, 'F2', palette.muted);
textLine(page3, 'Team Leader', 138, top, 9.5, 'F1', palette.text);
top += 15;
textLine(page3, 'Team', 48, top, 8.5, 'F2', palette.muted);
top = textBlock(page3, 'Wangdi Wangdi, Sangay Chedup, Wangchuk Blon and Tashi Choden', 138, top, 426, 9.5, 14, { color: palette.text });
top += 2;
textLine(page3, 'Recognition', 48, top, 8.5, 'F2', palette.muted);
top = textBlock(page3, 'Conservation Leadership Programme - Future Conservationist Award 2026', 138, top, 426, 9.5, 14, { color: palette.text });
textLine(page3, 'OFFICIAL PROJECT PAGE', 48, 612, 8.5, 'F2', palette.forest);
textBlock(
  page3,
  'conservationleadershipprogramme.org/project/bhutans-first-gps-ai-study-great-hornbills/',
  48,
  630,
  516,
  8.5,
  12,
  { color: palette.muted }
);
footer(page3, 3, 708);

const pageStreams = [page1.join('\n'), page2.join('\n'), page3.join('\n')];
const objects = [];
objects[1] = Buffer.from('<< /Type /Catalog /Pages 2 0 R >>', 'ascii');
objects[3] = Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', 'ascii');
objects[4] = Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>', 'ascii');
objects[5] = Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>', 'ascii');
objects[6] = Buffer.concat([
  Buffer.from(
    `<< /Type /XObject /Subtype /Image /Width ${heroDimensions.width} /Height ${heroDimensions.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${heroJpeg.length} >>\nstream\n`,
    'ascii'
  ),
  heroJpeg,
  Buffer.from('\nendstream', 'ascii'),
]);

const pageIds = [];
for (const [index, stream] of pageStreams.entries()) {
  const pageId = 7 + index * 2;
  const streamId = pageId + 1;
  pageIds.push(pageId);
  const xObject = index === 0 ? ' /XObject << /Im1 6 0 R >>' : '';
  objects[pageId] = Buffer.from(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >>${xObject} >> /Contents ${streamId} 0 R >>`,
    'ascii'
  );
  const streamBuffer = Buffer.from(stream, 'ascii');
  objects[streamId] = Buffer.concat([
    Buffer.from(`<< /Length ${streamBuffer.length} >>\nstream\n`, 'ascii'),
    streamBuffer,
    Buffer.from('\nendstream', 'ascii'),
  ]);
}

objects[2] = Buffer.from(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`, 'ascii');
const infoId = objects.length;
objects[infoId] = Buffer.from(
  "<< /Title (Connected Skies - Public Project Brief) /Author (Wangdi Wangdi) /Subject (Great hornbill conservation in Biological Corridor 03, Bhutan) /Creator (Wangdi Wangdi portfolio) >>",
  'ascii'
);

const header = Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', 'latin1');
const parts = [header];
const offsets = [0];
let offset = header.length;
for (let id = 1; id < objects.length; id += 1) {
  const object = Buffer.concat([
    Buffer.from(`${id} 0 obj\n`, 'ascii'),
    objects[id],
    Buffer.from('\nendobj\n', 'ascii'),
  ]);
  offsets[id] = offset;
  parts.push(object);
  offset += object.length;
}

const xrefOffset = offset;
const xref = [
  `xref\n0 ${objects.length}\n`,
  '0000000000 65535 f \n',
  ...offsets.slice(1).map((value) => `${String(value).padStart(10, '0')} 00000 n \n`),
  `trailer\n<< /Size ${objects.length} /Root 1 0 R /Info ${infoId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
].join('');
parts.push(Buffer.from(xref, 'ascii'));

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, Buffer.concat(parts));
console.log(`Built public CLP brief: ${OUTPUT}`);
