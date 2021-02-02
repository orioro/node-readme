import { Environment } from 'nunjucks'
import { ALL_EXPRESSIONS, evaluate } from '@orioro/expression'
import toc from 'markdown-toc'
import { renderCommentTitle, renderComment } from './renderComment'

type PlainObject = { [key:string]: any }
type ObjectMap = { [key:string]: PlainObject }

const ensureArray = (
  items:(PlainObject[] | ObjectMap)
):PlainObject[] => {
  if (typeof items !== 'object') {
    throw new TypeError(`Invalid items: expected Array or Object, but got ${typeof items}`)
  }

  return Array.isArray(items)
    ? items
    : Object.keys(items).map(key => items[key])
}

const filterQuery = (items, query) => {
  items = ensureArray(items)

  return items.filter(item => (
    evaluate({
      interpreters: ALL_EXPRESSIONS,
      scope: { $$VALUE: item }
    }, ['$objectMatches', query])
  ))
}

const filterToc = (items, level = 0) => {
  items = ensureArray(items)

  return items
    .map(item => (`${' '.repeat(level * 2)}- [${renderCommentTitle(item)}](#${toc.slugify(renderCommentTitle(item))})]`))
    .join('\n')
}

const renderEnv = () => {
  const env = new Environment(null, {
    autoescape: false
  })

  env.addFilter('query', filterQuery)
  env.addFilter('toc', filterToc)
  env.addFilter('docEntry', renderComment)

  return env
}

export const templateRender = (template, context) => {
  const env = renderEnv()

  return env.renderString(
    template,
    context
  )
  .trim()
}
