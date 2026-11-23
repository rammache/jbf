const fs = require('fs');
const path = require('path');

  const src = path.resolve(__dirname, '../frontend/dist');
  const dest = path.resolve(__dirname, '../dist');

  if (!fs.existsSync(src)) {
    console.error(`❌ Error: Frontend build directory does not exist: ${src}`);
    process.exit(1);
  }

  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log(`✓ Frontend static build copied successfully from ${src} to ${dest}`);
