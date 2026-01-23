const fs = require('fs');
const content = fs.readFileSync('src/data/blogPosts.tsx', 'utf8');
const lines = content.split(/\r?\n/);
const badChar = String.fromCharCode(65533);
lines.forEach((line, i) => {
    if (line.includes(badChar)) {
        console.log(`Line ${i}: ${line.trim()}`);
    }
});
