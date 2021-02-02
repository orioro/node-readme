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
        '**/*.js',
        '**/*.jsx',
        '**/*.ts',
        '**/*.tsx',
      ],
      cwd: FIXTURES_PATH
    })
    .then(() => {
      expect(fs.readFileSync(path.join(FIXTURES_PATH, 'fixture-1/readme.md'), 'utf8'))
        .toMatchSnapshot()
    })
  })
})
