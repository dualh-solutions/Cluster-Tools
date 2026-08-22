const fs = require('fs');
const https = require('https');
const path = require('path');
const { execSync } = require('child_process');

if (process.platform === 'linux') {
  console.log("Linux detected. Downloading standalone yt-dlp_linux...");
  const destDir = path.join(__dirname, '../node_modules/youtube-dl-exec/bin');
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const dest = path.join(destDir, 'yt-dlp');
  
  try {
    // Download yt-dlp_linux which doesn't require python3 on the host
    execSync(`curl -L -o ${dest} https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux`);
    execSync(`chmod +x ${dest}`);
    console.log("Successfully replaced yt-dlp with standalone linux binary.");
  } catch (error) {
    console.error("Failed to download or set permissions for yt-dlp_linux:", error.message);
  }
} else {
  console.log("Not on Linux, skipping yt-dlp fix.");
}
