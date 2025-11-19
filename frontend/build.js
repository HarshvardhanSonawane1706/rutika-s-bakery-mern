const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building React app with Vite...');

// Run Vite build
try {
  const command = process.platform === 'win32' ? 'npx.cmd vite build' : 'npx vite build';
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error('Vite build failed:', error);
  process.exit(1);
}

console.log('Build completed successfully!');

// Copy build output to dist
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  console.log('Build output is in dist/');
} else {
  console.error('dist/ not found after build');
  process.exit(1);
}
