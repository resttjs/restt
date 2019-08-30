#!/usr/bin/env node

/*!
 * Restt
 * 
 * Copyright(c) 2019-present Daniel Larkin
 * MIT Licensed
 */

// Attempt to load Restt-CLI
try {

  // Import Restt-CLI and execute
  const cli = require('restt-cli');

  // Check for the help flag
  // process.argv[2]

  // Define the flags
  const flags = {
    quiet: (process.argv[2] == '-q' || process.argv[2] == '--quiet') ? true : false,
    silent: (process.argv[2] == '-s' || process.argv[2] == '--silent') ? true : false,
  }

  // Define the action (serve or deploy)
  const action = (flags.quiet || flags.silent) ? process.argv[3] : process.argv[2];

  // Define the script to execute
  const script = (flags.quiet || flags.silent) ? process.argv[4] : process.argv[3];

  // Call the action for the script with the defined flags
  cli.execute({ action, script, flags });

// Unable to find Restt-CLI
} catch (error) {

  // Log out the install instructions
  console.log('\n\x1b[31mRestt-CLI is has not yet been installed!\x1b[0m\n');
  console.log('\x1b[36m  • Install Restt-CLI for this user (recommended)');
  console.log('\x1b[2m       npm install -g restt-cli\x1b[0m\n');
  console.log('\x1b[36m  • Install Restt-CLI for this project only');
  console.log('\x1b[2m       npm install restt-cli\x1b[0m\n');
  console.log('\x1b[34mPlease see \x1b[1mhttps://github.com/resttjs/restt-cli#readme\x1b[0m \x1b[34mfor more information\n')
}