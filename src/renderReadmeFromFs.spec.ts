import * as fs from 'fs'
import * as path from 'path'
import { renderReadmeFromFs } from './renderReadmeFromFs'

const FIXTURES_PATH = path.join(__dirname, '../test')
const TMP_PATH = path.join(__dirname, '../tmp')

describe('renderReadmeFromFs', () => {
  test('', () => {
    return renderReadmeFromFs({
      templatesSrc: ['**/.*.md'],
      commentsSrc: [
        'src/**/*.js',
        'src/**/*.jsx',
        'src/**/*.ts',
        'src/**/*.tsx',
      ],
      cwd: path.join(FIXTURES_PATH, 'fixture-1'),
    })
    .then(() => {
      expect(fs.readFileSync(path.join(FIXTURES_PATH, 'fixture-1/README.md'), 'utf8'))
        .toMatchSnapshot()
      expect(fs.readFileSync(path.join(FIXTURES_PATH, 'fixture-1/TODO.md'), 'utf8'))
        .toMatchSnapshot()
    })
  })
})
