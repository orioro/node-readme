# readme

Helper utility to generate `README.md` and `TODO.md` files based on source code
JSDoc comments

## API

- [`parseCommentsFromFs(globs, options)`](#parsecommentsfromfsglobs-options)
- [`renderReadmeFromFs(config)`](#renderreadmefromfsconfig)

##### `parseCommentsFromFs(globs, options)`

Parses comments loaded from files matching the given
glob patterns.

- `globs` {GlobPatterns[]}
- `options` {Object}
  - `cwd` {string}

##### `renderReadmeFromFs(config)`

Generates the readme.md file

- `config` {Object}
  - `templatesSrc` {GlobPattern[]}
  - `commentsSrc` {GlobPattern[]}
  - `cwd` {string}
  - `dest` {string}
