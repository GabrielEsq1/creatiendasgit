const fs = require('fs');
const path = 'src/data/blogPosts.tsx';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split(/\r?\n/);

// Fix Arrows (lines 111, 119, 127 -> indices 110, 118, 126)
const arrowLine = '                                <span className="transition group-open:rotate-180">▼</span>';
if (lines[110].includes('rotate-180')) lines[110] = arrowLine;
if (lines[118].includes('rotate-180')) lines[118] = arrowLine;
if (lines[126].includes('rotate-180')) lines[126] = arrowLine;

// Fix Line 729 (index 728)
if (lines[728].includes('De vendedor a asesor')) lines[728] = '                    <h2 className="text-3xl font-black text-gray-900 mb-6">🧠 De vendedor a asesor: Evita el bloqueo</h2>';

// Fix Line 814 (index 813)
if (lines[813].includes('flujo ganador')) lines[813] = '                    <h3 className="text-2xl font-bold text-gray-900 mb-6">🛠️ Cómo implementar el flujo ganador</h3>';

fs.writeFileSync(path, lines.join('\n'), 'utf8');
console.log('Fixed final batch of emojis');
