import * as fs from 'fs'
import * as path from 'path'
import { parseComments } from './parseComments'

const FIXTURES_PATH = path.join(__dirname, '../test')
const TMP_PATH = path.join(__dirname, '../tmp')

describe('parseComments', () => {
  test('', () => {

    return parseComments('**/*.ts', {
      cwd: FIXTURES_PATH
    })
    .then(comments => {
      fs.writeFileSync(
        path.join(TMP_PATH, 'comments.json'),
        JSON.stringify(comments, null, '  '),
        'utf8'
      )
    })
  })
})
