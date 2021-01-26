export const MACRO_PARAM_TYPE = [
  '{% macro paramType(type) %}',
    '{% raw %}{{% endraw %}',
      '{{ type }}',
    '{% raw %}}{% endraw %}',
  '{% endmacro %}'
].join('')

export const MACRO_METHOD_API = [
  '{% macro methodAPI(method) %}',
    '{% set comma = joiner(", ") %}',
    // Heading
    '\n##### `{{ method.name }}(',
      '{% for param in method.tags.param %}',
        '{{ comma() }}{{ param.name }}',
      '{% endfor %}',
    ')`\n',
    // description
    '\n{{ method.description | safe }}\n',
    // Parameters
    '\n{% for param in method.tags.param %}',
      '- `{{ param.name }}` {{ paramType(param.type) }} {{ param.description }}\n',
    '{% endfor %}',
    // Return
    '{% if method.tags.return %}',
      '{% set return = method.tags.return["0"] %}',
      '- Returns: `{{ return.name }}` {{ paramType(return.type) }} {{ return.description }}\n',
    '{% endif %}',
  '{% endmacro %}'
].join('')

export const MACROS = [
  MACRO_PARAM_TYPE,
  MACRO_METHOD_API
].join('')
