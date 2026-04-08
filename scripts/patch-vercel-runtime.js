#!/usr/bin/env node
// scripts/patch-vercel-runtime.js
// Patches any nodejs18.x runtime references in Vercel build output → nodejs20.x.
// Run automatically via the "postbuild" npm script.

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';

function findFiles(dir, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      findFiles(full, results);
    } else if (entry === '.vc-config.json' || entry === 'config.json') {
      results.push(full);
    }
  }
  return results;
}

const files = findFiles('.vercel/output');

if (files.length === 0) {
  console.log('[patch-vercel-runtime] No Vercel output files found — skipping.');
  process.exit(0);
}

let patched = 0;
for (const file of files) {
  const original = readFileSync(file, 'utf8');
  const updated  = original.split('nodejs18.x').join('nodejs20.x');
  if (updated !== original) {
    writeFileSync(file, updated, 'utf8');
    console.log(`[patch-vercel-runtime] Patched: ${file}`);
    patched++;
  }
}

if (patched === 0) {
  console.log('[patch-vercel-runtime] No nodejs18.x references found — nothing to patch.');
} else {
  console.log(`[patch-vercel-runtime] ✅ Patched ${patched} file(s) — runtime set to nodejs20.x`);
}
