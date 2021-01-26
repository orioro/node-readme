#!/usr/bin/env node
const { yargs } = require('../dist/bin/index.js')

yargs.argv

// Issue related to shebang not being interpreted by TypeScript. See:
// https://github.com/Microsoft/TypeScript/blob/master/bin/tsc
