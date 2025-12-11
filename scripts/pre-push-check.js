#!/usr/bin/env node

/**
 * Pre-push hook script
 * Checks for and removes unnecessary files before pushing to git
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GITIGNORE_PATTERNS = [
  /\.env$/,
  /\.env\./,
  /\.key$/,
  /\.pem$/,
  /\.crt$/,
  /REHBERI/i,
  /COZUM/i,
  /TROUBLESHOOT/i,
  /_SETUP/i,  // Only patterns like NETLIFY_SETUP.md, not jest.setup.js
  /DOMAIN/i,
  /DNS/i,
  /SSL/i,
  /CONSOLE/i,
  /BROWSER/i,
  /TEST_REHBERI/i,
  /MANUAL_/i,
  /PRODUCTION_TEST/i,
  /coverage\//,
  /playwright-report\//,
  /test-results\//,
  /\.log$/,
];

// Files that should NOT be removed even if they match patterns
const EXCLUDED_FILES = [
  'jest.setup.js',
  'jest.config.js',
];

function getTrackedFiles() {
  try {
    const output = execSync('git ls-files', { encoding: 'utf-8' });
    return output.split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error getting tracked files:', error.message);
    return [];
  }
}

function shouldIgnoreFile(filePath) {
  // Don't remove excluded files
  if (EXCLUDED_FILES.some(excluded => filePath.includes(excluded))) {
    return false;
  }
  return GITIGNORE_PATTERNS.some(pattern => pattern.test(filePath));
}

function removeFromGit(filePath) {
  try {
    execSync(`git rm --cached "${filePath}"`, { stdio: 'inherit' });
    console.log(`✅ Removed from git: ${filePath}`);
    return true;
  } catch (error) {
    // File might already be removed or not tracked
    return false;
  }
}

function main() {
  console.log('🔍 Checking for unnecessary files to remove from git...\n');
  
  const trackedFiles = getTrackedFiles();
  let removedCount = 0;
  const filesToRemove = [];

  // Find files that should be ignored
  trackedFiles.forEach(file => {
    if (shouldIgnoreFile(file)) {
      filesToRemove.push(file);
    }
  });

  if (filesToRemove.length === 0) {
    console.log('✅ No unnecessary files found. Ready to push!');
    return 0;
  }

  console.log(`⚠️  Found ${filesToRemove.length} file(s) that should be removed:\n`);
  filesToRemove.forEach(file => {
    console.log(`   - ${file}`);
  });

  // Remove files from git
  console.log('\n🗑️  Removing files from git (keeping local files)...\n');
  filesToRemove.forEach(file => {
    if (removeFromGit(file)) {
      removedCount++;
    }
  });

  if (removedCount > 0) {
    console.log(`\n✅ Removed ${removedCount} file(s) from git.`);
    console.log('⚠️  Please review the changes and commit before pushing again.\n');
    console.log('   Run: git status');
    console.log('   Then: git commit -m "Remove unnecessary files"');
    console.log('   Finally: git push\n');
    return 1; // Exit with error to prevent push
  }

  return 0;
}

// Run if executed directly
if (require.main === module) {
  const exitCode = main();
  process.exit(exitCode);
}

module.exports = { main };

