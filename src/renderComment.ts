export const renderDefault = (context, comment) => {

}

export const renderFunction = (context, func) => {

}

export const renderCommentTitle = (context, comment) => {
  if (comment.commentType === 'function') {
    return `${ comment.name }(${ comment.params.map(param => param.name).join(', ') })`
  } else {
    return `\`${comment.name}\``
  }
}

export const renderCommentReference = (context, {
  commentType,
  name
}) => {
  const comment = context.comments.find(comment => (
    comment.commentType === commentType &&
    comment.name === name
  ))

  return comment
    ? `\`[${name}](${renderCommentTitle(context, comment)})]\``
    : `\`${name}\``
}

export const renderParam = (context, param, level = 0) => {
  const type = renderCommentReference(context, {
    commentType: 'typedef',
    name: param.type
  })

  return [
    `${' '.repeat(level * 2)}- \`${param.name}\` {${type}}`,
    ...(param.properties || []).map(property => renderParam(context, property, level + 1))
  ].join('\n')
}

export const renderParamList = (context, params) => {
  return params.map(param => renderParam(context, param, 0)).join('\n')
}


// const renderParam = param => {
//   return `- \`${param.name}\` {[${param.type}](#${param.type})}`
// }

// const renderParamList = (params, level = 0) => {
//   return params.reduce((acc, param) => {
//     return [
//       ...acc,
//       renderParam(param),
//       param
//     ]

//   }, [])
// }

// const FUNC_RENDERER = [
//   comment => comment.commentType === 'function',
//   comment => ([
//     `###### ${ comment.name }(${ comment.params.map(param => param.name).join(', ') })\n`,
//     `${ comment.description ? `\n${comment.description}\n` : '' }`,
//     `${ comment.params.map(param => renderParam(param)).join('\n') }`,
    
//   ]).join('')
// ]