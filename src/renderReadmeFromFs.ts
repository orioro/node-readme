import * as path from 'path'
import { writeFile } from 'fs'
import { promisify } from 'util'
import { Transform } from 'readable-stream'
import vinylFs from 'vinyl-fs'
import rename from 'gulp-rename'
import { parseCommentsFromFs } from './parseComment'
import toc from 'markdown-toc'
import { uniq } from 'lodash'
import { templateRender } from './template'
import { renderCommentTitle } from './renderComment'

const writeFileAsync = promisify(writeFile)

const REFERRABLE_COMMENT_TYPES = [
  'function', 'func', 'method', 'callback',
  'class', 'constructor',
  'constant', 'const',
  'event',
  'global',
  'module',
  'typedef'
]

const strReplaceAll = (str, search, replacement) => {
  return str.replace(new RegExp(search, 'g'), replacement)
}

const linkInnerTypeReferences = (comments, text) => {
  return comments.reduce((acc, comment) => (
    REFERRABLE_COMMENT_TYPES.includes(comment.commentType)
      ? acc.replace(
          new RegExp(`{.*?${comment.name}.*?}`, 'g'),
          match => match.replace(
            comment.name,
            `[${comment.name}](#${toc.slugify(renderCommentTitle(comment))})`
          )
        )
      : acc
  ), text) 
}

export const vinylReadmeRenderStream = (context) => {
  return new Transform({
    objectMode: true,
    transform(file, enc, cb) {
      if (file.isStream()) {
        this.emit('error', Error('@orioro/readme: Streams files are not supported'))
        return cb()
      } else if (file.isBuffer()) {
        const rendered = linkInnerTypeReferences(
          context.comments,
          templateRender(
            file.contents.toString('utf8'),
            context
          )
        )

        file.contents = Buffer.from(
          rendered + '\n',
          'utf8'
        )

        this.push(file)
      }
      
      cb()
    }
  })
}

const readMeRenderContext = comments => {
  const files = uniq(comments.map(comment => comment.file))
  const todo = comments.reduce((acc, comment) => {
    return Array.isArray(comment.todo) && comment.todo.length > 0
      ? [...acc, ...comment.todo.map(todo => ({
          ...todo,
          source: comment.file
        }))]
      : acc
  }, [])

  return {
    comments,
    todo,
    files: files.reduce((acc, file) => {
      const _comments = comments
        .filter(comment => comment.file === file)

      const moduleComment = _comments.find(comment => comment.commentType === 'module')

      return {
        ...acc,
        [file]: {
          name: moduleComment ? moduleComment.name : file,
          comments: _comments.reduce((acc, comment, index) => {
            const name = comment.name || index + ''
            return {
              ...acc,
              [name]: comment
            }
          }, {})
        }
      }
    }, {})
  }
}

const renderTodo = (targetPath, todo) => {
  const longestNameCharCount = todo.reduce((acc, todo) => (
    todo.name.length > acc
      ? todo.name.length
      : acc
  ), 0)

  return writeFileAsync(
    targetPath,
    todo
      .map(todo => {
        const name = (todo.name || '').trim().padEnd(longestNameCharCount, ' ')
        const description = (todo.description || '').trim()
        const source = todo.source.trim()

        return `- ${name} | ${description} (${source})`
      })
      .sort()
      .join('\n') + '\n'
  )
}

/**
 * Generates the readme.md file
 *
 * @function renderReadmeFromFs
 * @param {Object} config
 * @param {GlobPattern[]} config.templatesSrc
 * @param {GlobPattern[]} config.commentsSrc
 * @param {string} config.cwd
 * @param {string} [config.dest='./']
 * @return {Promise<void>}
 */
export const renderReadmeFromFs = ({
  templatesSrc,
  commentsSrc,
  dest = './',
  todo = true,
  cwd
}) => (
  parseCommentsFromFs(commentsSrc, { cwd })
  .then(comments => {

    const context = readMeRenderContext(comments)

    const readmePromise = new Promise((resolve, reject) => {
      const stream = vinylFs
        .src(templatesSrc, {
          cwd,
          dot: true
        })
        .pipe(vinylReadmeRenderStream(context))
        .pipe(rename(path => ({
          ...path,
          basename: path.basename.replace(/^\./, ''),
        })))
        .pipe(vinylFs.dest(dest, { cwd }))

      stream.on('finish', resolve)
      stream.on('error', reject)
    })

    const todoPromise = todo
      ? renderTodo(
          path.join(cwd, dest, 'TODO.md'),
          context.todo
        )
      : Promise.resolve()

    return Promise.all([readmePromise, todoPromise]).then(() => undefined)
  })
)
