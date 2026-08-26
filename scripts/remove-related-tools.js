const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'content', 'tools');
const files = fs.readdirSync(contentDir);

files.forEach(file => {
  if (!file.endsWith('.mdx')) return;
  
  const filePath = path.join(contentDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the index of "## Related Tools"
  const idx = content.indexOf('## Related Tools');
  
  if (idx !== -1) {
    // Keep everything before "## Related Tools" and trim trailing whitespace
    content = content.substring(0, idx).trimEnd() + '\n';
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});

console.log("Done updating MDX files.");
