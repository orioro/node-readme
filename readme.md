# readme

Helper utility to generate `readme.md` files for projects.
Parses source code looking for JSDoc-like comments.

## API

##### `parseComments(globs, options)`

Parses comments loaded from files matching the given
glob patterns.

- `globs` {GlobPatterns[]} Array of glob patterns for files
                        from which comments should be loaded
- `options` {Object} Options to be forwarded to `vinylFs.src`
- `options.cwd` {string}
- Returns: `List` {Promise->Comment[]} of comments

##### `render(config, options)`

Generates the readme.md file

- `config` {Object}
- `config.templates` {GlobPattern[]}
- `config.comments` {GlobPattern[]}
- `config.dest` {string} Default: `'./'`
- `options` {Object}
- `options.cwd` {string}
- Returns: {Promise->void}
