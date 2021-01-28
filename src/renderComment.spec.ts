import { renderParamList } from './renderComment'

test.skip('renderParamList', () => {
  console.log(renderParamList({
    comments: [
      { commentType: 'typedef', name: 'SomeSpecialType' }
    ]
  }, [
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
  ]))
})
