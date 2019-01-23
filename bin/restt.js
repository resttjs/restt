#!/usr/bin/env node

/*!
 * Restt
 * 
 * Copyright(c) 2019-present Daniel Larkin
 * MIT Licensed
 */

// Attempt to load Restt-CLI
try {

  // Import and execute Restt-CLI
  require('restt-cli/bin/restt')({
    action: process.argv[2],
    script: process.argv[3]
  });

// Unable to find Restt-CLI
} catch (error) {

  // Log out the install instructions
  console.log('\n\x1b[31mRestt-CLI is has not yet been installed!\x1b[0m\n');
  console.log('\x1b[36m  • Install Restt-CLI for this user (recommended)');
  console.log('\x1b[2m       npm install -g restt-cli\x1b[0m\n');
  console.log('\x1b[36m  • Install Restt-CLI for this project only');
  console.log('\x1b[2m       npm install restt-cli\x1b[0m\n');
  console.log('\x1b[34mPlease see \x1b[1mhttps://github.com/larkin-nz/restt-cli#readme\x1b[0m \x1b[34mfor more information\n')
}
