import { Transform } from 'readable-stream'
import vinylFs from 'vinyl-fs'
import rename from 'gulp-rename'
import { parseCommentsFromFs } from './parseComment'
import toc from 'markdown-toc'
import { uniq } from 'lodash'
import { templateRender } from './template'
import slugify from '@sindresorhus/slugify'

export const vinylReadmeRenderStream = (context) => {
  return new Transform({
    objectMode: true,
    transform(file, enc, cb) {
      if (file.isStream()) {
        this.emit('error', Error('@orioro/readme: Streams files are not supported'))
        return cb()
      } else if (file.isBuffer()) {
        const rendered = templateRender(
          file.contents.toString('utf8'),
          context
        ) + '\n'

        const TOC = toc(rendered, {
          // firsth1: false
        }).content

        file.contents = Buffer.from(
          rendered.replace(/<!--\s*TOC\s*-->/g, TOC),
          'utf8'
        )

        this.push(file)
      }
      
      cb()
    }
  })
}

const CALLABLE_COMMENT_TYPES = ['function', 'func', 'method', 'callback']

const commentTitle = comment => {
  if (CALLABLE_COMMENT_TYPES.includes(comment.commentType)) {
    return `${ comment.name }(${ comment.params.map(param => param.name).join(', ') })`
  } else {
    return `\`${comment.name}\``
  }
}

const renderContext = comments => {
  comments = comments.map(comment => ({
    ...comment,
    title: commentTitle(comment)
  }))

  const files = uniq(comments.map(comment => comment.file))

  return {
    comments,
    files: files.reduce((acc, file) => ({
      ...acc,
      [file]: {
        comments: comments.filter(comment => comment.file === file),
        toc: comments.map(comment => `[${comment.title}](#${slugify(comment.title)})`)
      }
    }), {})
  }

  // const files = comments.reduce((acc, comment) => ({
  //   ...acc,
  //   [comment.file]: acc[comment.file]
  //     ? { ...file, [comment.name]: comment }
  // }))

  // const files = comments.reduce((acc, comment) => {
  //   const file = acc[comment.file]
    
  //   return {
  //     ...acc,
  //     [comment.file]: file
  //       ? {
  //           ...file,
  //           [comment.name]: comment
  //         }
  //       : {
  //           [comment.name]: comment
  //         }
  //   }
  // }, {})
}

/**
 * Generates the readme.md file
 *
 * @name render
 * @param {Object} config
 * @param {GlobPattern[]} config.templates
 * @param {GlobPattern[]} config.comments
 * @param {string} [config.dest='./']
 * @param {Object} options
 * @param {string} options.cwd
 * @return {Promise<void>}
 */
export const render = ({
  templates,
  templatesOptions = {},
  comments,
  commentsOptions = {},
  dest = './',
  todo = false,
  cwd
}) => (
  parseCommentsFromFs(comments, {
    cwd,
    ...commentsOptions
  })
  .then(comments => {
    const files = comments.reduce((acc, comment) => {
      const file = acc[comment.file]
      
      return {
        ...acc,
        [comment.file]: file
          ? {
              ...file,
              [comment.name]: comment
            }
          : {
              [comment.name]: comment
            }
      }
    }, {})

    console.log(files)

    return new Promise((resolve, reject) => {
      const stream = vinylFs
        .src(templates, {
          cwd,
          dot: true,
          ...templatesOptions
        })
        .pipe(vinylReadmeRenderStream({
          comments,
          files,
        }))
        .pipe(rename(path => ({
          ...path,
          basename: path.basename.replace(/^\./, ''),
        })))
        .pipe(vinylFs.dest(dest, {
          cwd,
          commentsOptions
        }))

      stream.on('finish', resolve)
      stream.on('error', reject)
    })
  })
)
