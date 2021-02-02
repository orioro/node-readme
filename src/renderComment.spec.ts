import {
  renderFunctionComment,
  renderDefaultComment
} from './renderComment'

test('renderDefaultComment(comment)', () => {
  expect(renderDefaultComment({
    commentType: 'typedef',
    name: 'SomeSpecialType',
    description: 'Integer finibus mi sed erat condimentum rhoncus id eu ligula. Mauris sed odio orci.',
    properties: [
      { name: 'prop1', type: 'string', description: 'Morbi egestas suscipit pharetra' },
      { name: 'prop2', type: 'boolean', description: 'In maximus est nibh' }
    ]
  }))
  .toMatchSnapshot()
})

test('renderFunctionComment(comment)', () => {
  expect(renderFunctionComment({
    commentType: 'function',
    name: 'someFunction',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    params: [
      {
        name: 'param1',
        type: 'String',
        description: 'Some description'
      },
      {
        name: 'param2',
        type: 'SomeSpecialType',
        description: 'Some description'
      },
      {
        name: 'param3',
        type: 'Object',
        description: 'Some param3 description',
        properties: [
          {
            name: 'key1',
            type: 'Number',
            description: 'Some key1 description'
          },
          {
            name: 'key2',
            type: 'String',
            description: 'Some key2 description'
          }
        ]
      },
      {
        name: 'param4',
        type: 'Object[]',
        description: 'Some description',
        properties: [
          {
            name: 'key1',
            type: 'Number',
            description: 'Some key1 description'
          },
          {
            name: 'key2',
            type: 'String',
            description: 'Some key2 description'
          }
        ]
      }
    ],
    returns: {
      name: 'result',
      type: 'SomeType',
      description: 'Some result description'
    }
  }))
  .toMatchSnapshot()
})

