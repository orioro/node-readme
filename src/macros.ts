export const MACRO_PARAM_TYPE = [
  '{% macro paramType(type) %}',
    '{% raw %}{{% endraw %}',
      '{{ type }}',
    '{% raw %}}{% endraw %}',
  '{% endmacro %}'
].join('')

export const MACRO_METHOD_API = [
  '{% macro methodAPI(method) %}',
    // Utility variables
    // '{% set dotRegExp = r/\\./ %}',
    '{% set comma = joiner(", ") %}',

    // Heading
    '\n##### `{{ method.name }}(',
      '{% for param in method.params %}',
        // Skips parameters with dot in their names
        // (they are assumed to be sub-properties)
        // '{% if not dotRegExp.test(param.name) %}',
          '{{ comma() }}{{ param.name }}',
        // '{% endif %}',
      '{% endfor %}',
    ')`\n',
    // description
    '{% if method.description %}\n{{ method.description }}\n{% endif %}',
    // Parameters
    '\n{% for param in method.params %}',
      '- `{{ param.name }}`',
      ' {{ paramType(param.type) }}',
      '{% if param.description %} {{ param.description }}{% endif %}',
      '{% if param.default %} Default: `{{ param.default }}`{% endif %}',
      '\n',
    '{% endfor %}',
    // Return
    '{% if method.returns %}',
      '- Returns:',
      '{% if method.returns.name %} `{{ method.returns.name }}`{% endif %}',
      ' {{ paramType(method.returns.type) }}',
      '{% if method.returns.description %} {{ method.returns.description }}{% endif %}',
      '\n',
    '{% endif %}',
  '{% endmacro %}'
].join('')

export const MACROS = [
  MACRO_PARAM_TYPE,
  MACRO_METHOD_API
].join('')
