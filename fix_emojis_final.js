const fs = require('fs');
const path = 'src/data/blogPosts.tsx';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split(/\r?\n/);

const arrowLine = '                                <span className="transition group-open:rotate-180">▼</span>';

lines[117] = arrowLine;
lines[124] = arrowLine;

lines[802] = '                            <span className="text-red-500 text-xl font-bold">❌</span>';
lines[806] = '                            <span className="text-red-500 text-xl font-bold">❌</span>';

fs.writeFileSync(path, lines.join('\n'), 'utf8');
console.log('Fixed last batch.');
