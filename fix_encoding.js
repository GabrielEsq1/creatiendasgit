const fs = require('fs');
const path = "c:\\Users\\ASUS\\Desktop\\creatiendas\\creatiendasgit\\src\\data\\blogPosts.tsx";
try {
    const content = fs.readFileSync(path, 'utf8');
    const buffer = Buffer.from(content, 'latin1');
    const fixed = buffer.toString('utf8');
    fs.writeFileSync(path, fixed, 'utf8');
    console.log('Fixed encoding.');
} catch (e) {
    console.error(e);
}
