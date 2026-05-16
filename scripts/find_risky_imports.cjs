
const fs = require('fs');
const path = require('path');

const riskyNames = ['Image', 'List', 'History', 'Map', 'Notification', 'Screen', 'Location', 'Navigator', 'Plugin', 'Event'];

function findRiskyImports(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules') findRiskyImports(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      riskyNames.forEach(name => {
        // Look for imports like: import { ..., Image, ... } from 'lucide-react'
        // or import { Image } from 'lucide-react'
        // but ignore if it has 'as' like: import { Image as ImageIcon }
        const regex = new RegExp(`import\\s+{[^}]*?\\b${name}\\b(?!\\s+as)[^}]*?}\\s+from\\s+['"]lucide-react['"]`, 'g');
        if (regex.test(content)) {
          console.log(`[RISKY IMPORT] File: ${fullPath} | Name: ${name}`);
        }
      });
    }
  });
}

findRiskyImports('src');
