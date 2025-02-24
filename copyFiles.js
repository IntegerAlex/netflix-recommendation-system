const fs = require('fs');
const path = require('path');

// Files to copy
const filesToCopy = [
    'script.py',
    'titles.json',
    'movies_data.csv'  // if you have this file
];

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Copy each file
filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join('dist', file));
        console.log(`Copied ${file} to dist folder`);
    } else {
        console.warn(`Warning: ${file} not found`);
    }
}); 