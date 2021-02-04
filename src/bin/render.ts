import * as path from 'path'
import * as chokidar from 'chokidar'
const readPkgUp = require('read-pkg-up')
// import readPkgUp from 'read-pkg-up'
import { renderReadmeFromFs } from '../renderReadmeFromFs'

const renderWithTimer = (config) => {
  const start = Date.now()

  return renderReadmeFromFs(config).then(() => {
    const end = Date.now()

    console.log(`Successfully rendered readme docs, ${end - start}ms`)
  })
}

const DEFAULT_README_CONF = {
    templatesSrc: [
      '.*.md',
      'src/**/*.md'
    ],
    commentsSrc: [
      'src/**/*',
      '!src/**/*.snap',
      '!src/**/*.spec.*',
      '!**/*.md'
    ]
  }

const cmdRenderHandler = argv => (
  readPkgUp()
    .then(({ packageJson, path: packageJsonPath }) => {
      const { readme = {} } = packageJson
      const cwd = path.dirname(packageJsonPath)

      const config = {
        ...DEFAULT_README_CONF,
        ...readme,
        cwd
      }

      return renderWithTimer(config).then(() => {

        if (argv.watch) {
          const watcher = chokidar.watch([
            ...config.templatesSrc,
            ...config.commentsSrc
          ].map(p => path.join(cwd, p)))

          const handleChange = path => {
            console.log(`readme-related files have changed, will re-render (${path})`)
            renderWithTimer(config)
          }

          watcher.on('change', handleChange)
        }
      })
    })
)

export const CMD_RENDER = {
  command: '$0',
  describe: 'Renders readme.md files',
  handler: cmdRenderHandler
}
