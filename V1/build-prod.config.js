const { execSync } = require('child_process');

require('dotenv').config({ path: '.env.prod' });

execSync('npm install --production')
console.log('Installing production dependencies...');

/* const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting production build...');

// Transpile code
console.log('Transpiling code...');
execSync('npm run build');

// Bundle assets
console.log('Bundling assets...');
execSync('npm run bundle');

// Optimize resources
console.log('Optimizing resources...');
execSync('npm run optimize');

// Additional production-specific build tasks
console.log('Running other production build tasks...');
// Your custom production build tasks go here

console.log('Production build completed successfully.');

// Example: Write build information to a file
const buildInfo = {
  timestamp: new Date().toISOString(),
  version: process.env.APP_VERSION,
  // Add more build information if needed
};

fs.writeFileSync(
  path.join(__dirname, 'build-info.json'),
  JSON.stringify(buildInfo, null, 2)
);

console.log('Build information written to build-info.json file.'); */
