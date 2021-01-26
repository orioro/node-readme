import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'

const jsExtensions = ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.node']

const SCRIPTS = [
	{
		input: 'src/index.ts',
		output: [
			{
				file: 'dist/index.js',
				format: 'cjs',
				exports: 'named',
			},
			{
				file: 'dist/index.mjs',
				format: 'esm',
			}
		]
	},
	{
		input: 'src/bin/index.ts',
		output: [
			{
				file: 'dist/bin/index.js',
				format: 'cjs',
				exports: 'named',
			},
		]
	}
]

module.exports = SCRIPTS.map(script => ({
	...script,

	external: [
    ...Object.keys(require('../package.json').dependencies || {}),
    ...Object.keys(require('../package.json').devDependencies),
  ],
	plugins: [
		babel({
			babelrc: true,
			exclude: 'node_modules/**',
			extensions: jsExtensions
		}),
		resolve({
			extensions: jsExtensions
		}),
		commonjs(),
	]
}))

// module.exports = {
// 	input: 'src/index.ts',
// 	output: [
// 		{
// 			file: 'dist/index.js',
// 			format: 'cjs',
// 			exports: 'named',
// 		},
// 		{
// 			file: 'dist/index.mjs',
// 			format: 'esm',
// 		}
// 	],
// }
