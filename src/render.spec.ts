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
      comments: ['**/*.ts']
    }, {
      cwd: FIXTURES_PATH
    })
  })
})
