import * as fs from 'fs'
import * as path from 'path'
import { parse as parse } from 'comment-parser/lib'
import {
  parseComment,
  parseCommentsFromFs
} from './parseComment'

const FIXTURES_PATH = path.join(__dirname, '../test')
const TMP_PATH = path.join(__dirname, '../tmp')

const FUNC1_COMMENT = parse(`
/**
 * Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Quisque nec ligula sem.
 * 
 * @todo #65 Lorem ipsum dolor sit amet
 * @function func1
 * @param {String} param1 Param 1 description
 * @param {Number} [param2=0] Param 2 description
 * @returns {Boolean} result Result description
 */
`)[0]

const FUNC2_COMMENT = parse(`
/**
 * Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Quisque nec ligula sem.
 * 
 * @function func2
 * @param {Object} param1 Param 1 description
 * @param {String} param1.key1 Key 1 description
 * @param {Boolean} param1.key2 Key 2 description
 * @param {Object[]} [param2=[]] Param 2 description
 * @param {Number} [param2[].key1]
 * @param {String} [param2[].key2]
 * @returns {Boolean} result Result description
 */
`)[0]

describe('parseComment(comment)', () => {
  test('@function / @func / @method', () => {

    expect(parseComment(FUNC1_COMMENT)).toMatchObject({
      name: 'func1',
      commentType: 'function',
      params: [
        { name: 'param1', type: 'String' },
        { name: 'param2', type: 'Number', optional: true, default: '0' }
      ],
      returns: { name: 'result', type: 'Boolean' },
      todo: [
        { name: '#65', description: 'Lorem ipsum dolor sit amet' }
      ]
    })
  })

  test('@function with nested param specs', () => {
    expect(parseComment(FUNC2_COMMENT)).toMatchObject({
      name: 'func2',
      commentType: 'function',
      params: [
        {
          name: 'param1',
          type: 'Object',
          properties: [
            { name: 'key1', type: 'String' },
            { name: 'key2', type: 'Boolean' },
          ]
        },
        {
          name: 'param2',
          type: 'Object[]',
          properties: [
            { name: 'key1', type: 'Number' },
            { name: 'key2', type: 'String' }
          ]
        }
      ],
      returns: { name: 'result', type: 'Boolean' }
    })
  })
})

describe('parseCommentsFromFs', () => {
  test('', () => {
    return parseCommentsFromFs('**/*.ts', {
      cwd: FIXTURES_PATH
    })
    .then(comments => {
      expect(comments).toMatchSnapshot()
    })
  })
})
