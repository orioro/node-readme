import * as path from 'path'
const readPkgUp = require('read-pkg-up')
// import readPkgUp from 'read-pkg-up'
import { render } from '../render'

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

      return render({
        ...DEFAULT_README_CONF,
        ...readme
      }, { cwd })
    })
)

export const CMD_RENDER = {
  command: ['render', '$0'],
  describe: 'Renders readme.md files',
  handler: cmdRenderHandler
}
