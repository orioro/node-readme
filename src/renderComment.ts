const stringFromLines = (
  lines:(string | false)[]
):string => (
  lines
    .filter(str => typeof str === 'string')
    .join('\n')
)

export const renderDefaultComment = (comment, level = 5) => stringFromLines([
  `${'#'.repeat(level)} ${ renderCommentTitle(comment) }`,
  '',
  comment.description
    ? `${comment.description}\n`
    : false,
  comment.properties
    ? renderPropList(comment.properties)
    : false,
])

export const renderCommentTitle = (comment) => {
  if (comment.commentType === 'function') {
    return `\`${ comment.name }(${ comment.params.map(prop => prop.name).join(', ') })\``
  } else {
    return `\`${ comment.name }\``
  }
}

const renderProp = (prop, level = 0) => stringFromLines([
  `${' '.repeat(level * 2)}- \`${prop.name}\` {\`${prop.type}\`}`,
  ...(prop.properties || []).map(property => renderProp(property, level + 1))
])

const renderPropList = (props) => (
  stringFromLines(props.map(prop => renderProp(prop, 0)))
)

export const renderFunctionComment = (comment, level = 5) => stringFromLines([
  `${'#'.repeat(level)} ${ renderCommentTitle(comment) }`,
  '',
  comment.description
    ? `${comment.description}\n`
    : false,
  comment.params
    ? renderPropList(comment.params)
    : false,
  comment.returns
    ? `- Returns: ${comment.returns.name ? `\`${comment.returns.name}\` ` : ''}{\`${comment.returns.type}\`} ${comment.returns.description || ''}`
    : false,
])

export const renderComment = (comment, level = 5) => {
  switch (comment.commentType) {
    case 'function':
    case 'func':
    case 'method':
    case 'callback':
      return renderFunctionComment(comment, level)
    default:
      return renderDefaultComment(comment, level)
  }
}
