const fs = require('fs');

if (fs.existsSync('frontend/dist')) {
  fs.cpSync('frontend/dist', 'dist', { recursive: true });
  console.log('✓ Frontend static build copied to root dist directory.');
}
