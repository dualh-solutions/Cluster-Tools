const fs = require('fs');
const path = require('path');

const NEXT_SERVER_APP_DIR = path.join(process.cwd(), '.next', 'server', 'app');

if (!fs.existsSync(NEXT_SERVER_APP_DIR)) {
  console.log('Skipping canonical check: .next/server/app directory not found.');
  process.exit(0);
}

let missingCanonicalCount = 0;
let missingOgUrlCount = 0;

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      // Ignore Next.js internal pages if any
      if (entry.name.includes('_not-found') || entry.name.includes('500') || entry.name.includes('404') || entry.name.includes('_global-error')) {
        continue;
      }
      
      const content = fs.readFileSync(fullPath, 'utf8');
      
      if (!content.includes('<link rel="canonical"')) {
        console.error(`\x1b[31m[SEO ERROR]\x1b[0m Missing canonical tag in statically generated page: ${fullPath.replace(NEXT_SERVER_APP_DIR, '').replace(/\\/g, '/')}`);
        missingCanonicalCount++;
      }

      if (!content.includes('property="og:url"')) {
        console.error(`\x1b[31m[SEO ERROR]\x1b[0m Missing og:url in statically generated page: ${fullPath.replace(NEXT_SERVER_APP_DIR, '').replace(/\\/g, '/')}`);
        missingOgUrlCount++;
      }
    }
  }
}

console.log('Scanning statically generated pages for canonical tags...');
scanDirectory(NEXT_SERVER_APP_DIR);

if (missingCanonicalCount > 0 || missingOgUrlCount > 0) {
  if (missingCanonicalCount > 0) {
    console.error(`\x1b[31m[SEO ERROR]\x1b[0m Found ${missingCanonicalCount} page(s) missing a canonical tag.`);
  }
  if (missingOgUrlCount > 0) {
    console.error(`\x1b[31m[SEO ERROR]\x1b[0m Found ${missingOgUrlCount} page(s) missing an og:url tag.`);
  }
  process.exit(1);
} else {
  console.log('\x1b[32m[SEO SUCCESS]\x1b[0m All static pages contain a canonical tag and an og:url tag.');
}
