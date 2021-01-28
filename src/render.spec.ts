import * as fs from 'fs'
import * as path from 'path'
import {
  render
} from './render'

const FIXTURES_PATH = path.join(__dirname, '../test')
const TMP_PATH = path.join(__dirname, '../tmp')

describe('render', () => {
  test('', () => {
    return render({
      templates: ['**/.*.md'],
      comments: ['**/*.ts'],
      cwd: FIXTURES_PATH
    })
    .then(() => {
      expect(fs.readFileSync(path.join(FIXTURES_PATH, 'fixture-1/readme.md'), 'utf8'))
        .toMatchSnapshot()
    })
  })
})
