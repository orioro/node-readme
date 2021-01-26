import { Transform } from 'readable-stream'
import { parse } from 'comment-parser/lib'
import vinylFs from 'vinyl-fs'
import { groupBy } from 'lodash'

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

        this.push(file)
      }

      cb()
    }
  })
}

const _parseComment = comment => {
  const { tags } = comment
  const nameTag = tags.find(tag => tag.tag === 'name') || null

  return {
    ...comment,
    name: nameTag ? nameTag.name : null,
    tags: groupBy(tags.filter(tag => tag.tag !== 'name'), 'tag'),
    description: typeof comment.description === 'string'
      ? comment.description.trim()
      : undefined
  }
}

/**
 * Parses comments loaded from files matching the given
 * glob patterns.
 * 
 * @name parseComments
 * @param {GlobPatterns[]} globs Array of glob patterns for files
 *                         from which comments should be loaded
 * @param {Object} options Options to be forwarded to `vinylFs.src`
 * @param {string} options.cwd
 * @return {Promise->Comment[]} List of comments
 */
export const parseComments = (
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
        comment = _parseComment(comment)

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
