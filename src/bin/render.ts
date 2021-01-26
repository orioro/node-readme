import * as path from 'path'
import * as chokidar from 'chokidar'
const readPkgUp = require('read-pkg-up')
// import readPkgUp from 'read-pkg-up'
import { render } from '../render'

const renderWithTimer = (config, options) => {
  const start = Date.now()

  return render(config, options).then(() => {
    const end = Date.now()

    console.log(`Successfully rendered readme docs, ${end - start}ms`)
  })
}

const DEFAULT_README_CONF = {
    templates: [
      '.readme.md',
      'src/**/*.md'
    ],
    comments: [
      'src/**/*',
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
        ...readme
      }

      return renderWithTimer(config, { cwd }).then(() => {

        if (argv.watch) {
          const watcher = chokidar.watch([
            ...config.templates,
            ...config.comments
          ].map(p => path.join(cwd, p)))

          const handleChange = path => {
            console.log(`readme-related files have changed, will re-render (${path})`)
            renderWithTimer(config, { cwd })
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
