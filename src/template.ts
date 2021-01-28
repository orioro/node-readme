import { Environment } from 'nunjucks'
import { MACROS } from './macros'

export const templateRender = (template, context) => {
  const env = new Environment(null, {
    autoescape: false
  })

  return env.renderString(
    `${MACROS}${template}`,
    context
  )
  .trim()
}
