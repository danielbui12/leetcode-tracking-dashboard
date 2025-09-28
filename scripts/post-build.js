#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rename index.extension.html to index.html after build
const sidepanelDir = path.join(__dirname, '..', 'extension', 'sidepanel');
const oldFile = path.join(sidepanelDir, 'index.extension.html');
const newFile = path.join(sidepanelDir, 'index.html');

if (fs.existsSync(oldFile)) {
  if (fs.existsSync(newFile)) {
    fs.unlinkSync(newFile);
  }
  fs.renameSync(oldFile, newFile);
  console.log('✅ Renamed index.extension.html to index.html');
} else {
  console.log('ℹ️  index.extension.html not found, skipping rename');
}
