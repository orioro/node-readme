import { Transform } from 'readable-stream'
import vinylFs from 'vinyl-fs'
import rename from 'gulp-rename'
import { Environment } from 'nunjucks'
import { parseComments } from './parseComments'
import { MACROS } from './macros'

export const vinylReadmeRenderStream = (context, { macros = MACROS } = {}) => {

  const env = new Environment(null, {
    autoescape: false
  })

  return new Transform({
    objectMode: true,
    transform(file, enc, cb) {
      if (file.isStream()) {
        this.emit('error', Error('@orioro/readme: Streams files are not supported'))
        return cb()
      } else if (file.isBuffer()) {
        const rendered = env.renderString(
          `${macros}${file.contents.toString('utf8')}`,
          context
        )
        .trim() + '\n'

        file.contents = Buffer.from(rendered, 'utf8')

        this.push(file)
      }
      
      cb()
    }
  })
}

/**
 * Generates the readme.md file
 *
 * @name render
 * @param {{ templates: {GlobPattern[]}, comments: {GlobPattern[]}, dest: string }} config
 * @param {{ cwd: {String} }} options
 * @return {Promise->void}
 */
export const render = ({
  templates,
  comments,
  dest = './'
}, options = {}) => (
  parseComments(comments, options)
    .then(comments => {

      return new Promise((resolve, reject) => {
        const stream = vinylFs
          .src(templates, {
            dot: true,
            ...options
          })
          .pipe(vinylReadmeRenderStream({ comments }))
          .pipe(rename(path => ({
            ...path,
            basename: path.basename.replace(/^\./, ''),
          })))
          .pipe(vinylFs.dest(dest, options))

        stream.on('finish', resolve)
        stream.on('error', reject)
      })
    })
)
