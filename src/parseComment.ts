import { Transform } from 'readable-stream'
import { parse } from 'comment-parser/lib'
import vinylFs from 'vinyl-fs'
import { groupBy } from 'lodash'
import { cascadeExec, cascadeFilter, test, Alternative, ExecutableAlternative } from '@orioro/cascade'

type PlainObject = { [key:string]: any }
type Parser = (PlainObject) => PlainObject
const noopParser:Parser = comment => ({})
const noopEcho = i => i

const hasTag = tagName => comment => comment.tags.some(tag => tag.tag === tagName)

const commentTypeParser = (
  tagName,
  parser:Parser = noopParser
):Alternative => ([
  hasTag(tagName),
  comment => {
    const nameTag = comment.tags.find(tag => tag.tag === tagName)

    return {
      commentType: tagName,
      name: nameTag.name,
      ...parser(comment),
    }
  }
])

const listParser = (
  tagName,
  property,
  parser = noopParser
):Alternative => ([
  comment => ({
    [property]: comment.tags.filter(tag => tag.tag === tagName),
    ...parser(comment)
  })
])

const nestedListParser = (
  tagName,
  {
    rootProperty,
    nestedProperty
  },
  parser:Parser = noopParser
):Alternative => ([
  comment => {
    const { tags } = comment

    const items = tags.filter(tag => (
      tag.tag === tagName &&
      !tag.name.includes('.')
    ))
    .map(item => ({
      ...item,
      [nestedProperty]: tags.filter(tag => (
        tag.tag === tagName &&
        (
          tag.name.startsWith(`${item.name}.`) ||
          tag.name.startsWith(`${item.name}[].`)
        )
      ))
      .map(property => ({
        ...property,
        name: property.name
          .replace(`${item.name}.`, '')
          .replace(`${item.name}[].`, '')
      }))
    }))

    return {
      [rootProperty]: items,
      ...parser(comment),
    }
  }
])

const SPECIAL_TAGS = [
  'function', 'func', 'method', 'callback',
  'class', 'constructor',
  'constant', 'const',
  'event',
  'example',
  'global',
  'module',
  'typedef',
  'param',
  'property',
  'todo',
]

/**
 * Parsers are tested against each comment
 * and the ones applied return each an object
 * to be merged, in order, into the final
 * parsing result.
 */
const PARSERS:Alternative[] = [
  // By default, set all tags to the comment root 
  [({ tags }) => {
    return tags.reduce((acc, tag) => {
      return SPECIAL_TAGS.includes(tag.tag)
        ? acc
        : {
            ...acc,
            [tag.tag]: tag
          }
    }, {})
  }],

  // Tags that define the commentType property and
  // the name
  ...[
    'function', 'func', 'method', 'callback',
    'class', 'constructor',
    'constant', 'const',
    'event',
    'global',
    'module',
    'typedef'
  ]
  .map(tagName => commentTypeParser(tagName)),

  /**
   * Tags that may provide multiple values
   */
  listParser('todo', 'todo'),
  listParser('example', 'examples'),

  /**
   * Tags that may provide multiple values and
   * be nested
   */
  nestedListParser('param', {
    rootProperty: 'params',
    nestedProperty: 'properties',
  }),
  nestedListParser('property', {
    rootProperty: 'properties',
    nestedProperty: 'properties',
  }),

  // Force setting name
  [
    hasTag('name'),
    ({ tags }) => ({
      name: tags.find(tag => tag.tag === 'name').name
    })
  ],
  
  // // Trim description
  // [({ description }) => ({
  //   description: typeof description === 'string'
  //     ? description.trim()
  //     : undefined
  // })]
]

export const parseComment = comment => {
  const parsers = cascadeFilter(test, PARSERS, comment)

  return parsers.reduce((acc, parser) => ({
    ...acc,
    ...parser(comment, acc)
  }), {})
}

export const vinylCommentStream = () => {
  return new Transform({
    objectMode: true,
    transform(file, enc, cb) {
      if (file.isStream()) {
        this.emit('error', new Error('@orioro/readme: Streams files are not supported'))
        return cb()
      }

      if (file.isBuffer()) {
        file.comments = parse(file.contents.toString('utf8'), {
          spacing: 'preserve'
        })
        .map(parseComment)

        this.push(file)
      }

      cb()
    }
  })
}

/**
 * Parses comments loaded from files matching the given
 * glob patterns.
 * 
 * @name parseCommentsFromFs
 * @param {GlobPatterns[]} globs Array of glob patterns for files
 *                         from which comments should be loaded
 * @param {Object} options Options to be forwarded to `vinylFs.src`
 * @param {string} options.cwd
 * @return {Promise->Comment[]} List of comments
 */
export const parseCommentsFromFs = (
  globs,
  options?
) => (
  new Promise((resolve, reject) => {
    const comments = {}
    const commentsStream = vinylFs
      .src(globs, options)
      .pipe(vinylCommentStream())

    commentsStream.on('data', file => {
      comments[file.relative] = file.comments.reduce((acc, comment, index) => {
        const key = comment.name !== null ? comment.name : index + ''

        return {
          ...acc,
          [key]: comment
        }
      }, {})
    })

    commentsStream.on('end', () => resolve(comments))
    commentsStream.on('error', reject)
  })
)
