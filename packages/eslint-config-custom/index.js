module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript'
  ],
  overrides: [
    {
      files: [
        './**/*.{ts,js,vue}'
      ],
      rules: {
        'no-console': [
          'error',
          {
            allow: [
              'info',
              'warn',
              'trace',
              'error'
            ]
          }
        ],
        'vue/max-attributes-per-line': ['error', {
          singleline: {
            max: 5
          },
          multiline: {
            max: 5
          }
        }],
        'vue/first-attribute-linebreak': ['error', {
          singleline: 'beside'
        }],
        'vue/attributes-order': ['error', {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            ['UNIQUE', 'SLOT'],
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'EVENTS',
            'CONTENT',
            'OTHER_ATTR'
          ]
        }],
        '@typescript-eslint/no-unused-vars': ['error', {
          varsIgnorePattern: '^_'
        }]
      }
    }
  ]
}
