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
    '{% set dotRegExp = r/\\./ %}',
    '{% set comma = joiner(", ") %}',

    // Heading
    '\n##### `{{ method.name }}(',
      '{% for param in method.tags.param %}',
        // Skips parameters with dot in their names
        // (they are assumed to be sub-properties)
        '{% if not dotRegExp.test(param.name) %}',
          '{{ comma() }}{{ param.name }}',
        '{% endif %}',
      '{% endfor %}',
    ')`\n',
    // description
    '\n{{ method.description }}\n',
    // Parameters
    '\n{% for param in method.tags.param %}',
      '- `{{ param.name }}` {{ paramType(param.type) }} {% if param.description %}{{ param.description }}{% endif %}{% if param.default %} Default: `{{ param.default }}`{% endif %}\n',
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
