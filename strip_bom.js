const fs = require('fs');
const path = "c:\\Users\\ASUS\\Desktop\\creatiendas\\creatiendasgit\\src\\data\\blogPosts.tsx";
let content = fs.readFileSync(path, 'utf8');
const firstChar = content.charCodeAt(0);
console.log('First char code:', firstChar);
if (firstChar === 65533 || firstChar === 0xFEFF || firstChar > 127) {
    content = content.slice(1);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Stripped leading char.');
}
