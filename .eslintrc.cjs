/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  root: true,
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    '@remix-run/eslint-config/jest-testing-library',
    'prettier',
  ],
  globals: {
    shopify: 'readonly',
  },
  rules: {
    // ---------------------------- Import ----------------------------

    // Forbid import of modules using absolute paths
    // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-absolute-path.md
    'import/no-absolute-path': 'error',

    // ---------------------------- React Specific Rules ----------------------------

    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-undef.md
    'react/jsx-no-undef': 'error',

    // Prevent usage of dangerous JSX properties
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-danger.md
    'react/no-danger': 'warn',

    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/anchor-is-valid.md
    'jsx-a11y/anchor-is-valid': 'warn',

    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/alt-text.md
    'jsx-a11y/alt-text': 'warn',

    // ---------------------------- TypeScript Specific Rules ----------------------------

    // Detects unused variables
    // https://eslint.org/docs/latest/rules/no-unused-vars
    '@typescript-eslint/no-unused-vars': 'warn',

    // ---------------------------- Other Rules ----------------------------

    // Disallow use of the 'new' operator without parentheses
    // https://eslint.org/docs/latest/rules/new-parens
    'new-parens': 'error',

    // https://eslint.org/docs/latest/rules/space-in-parens
    // Require spaces inside parentheses
    'space-in-parens': 'error',

    // Enforce curly braces for multi-line blocks
    // https://eslint.org/docs/latest/rules/curly
    curly: ['warn', 'multi-line'],

    // Disallow initializing variables to 'undefined'
    // https://eslint.org/docs/latest/rules/no-undef-init
    'no-undef-init': 'warn',

    // Disallow the use of 'var', prefer 'let' or 'const'
    // https://eslint.org/docs/latest/rules/no-var
    'no-var': 'warn',

    // https://eslint.org/docs/rules/no-else-return
    'no-else-return': ['warn', { allowElseIf: false }],

    // Limit the maximum number of statements allowed per line
    'max-statements-per-line': ['error', { max: 1 }],

    // Enforces return statements in callbacks of array's methods
    // https://eslint.org/docs/rules/array-callback-return
    'array-callback-return': ['warn', { allowImplicit: true }],

    // Require the use of const when declaring variables that are not reassigned
    // https://eslint.org/docs/latest/rules/prefer-const
    'prefer-const': 'warn',

    // Suggest using template literals instead of string concatenation
    // https://eslint.org/docs/rules/prefer-template
    'prefer-template': 'warn',

    // Disable the rule disallowing template curly braces in strings
    // https://eslint.org/docs/latest/rules/no-template-curly-in-string
    'no-template-curly-in-string': 'warn',

    // Warn against loose equality (==, !=) and suggest using strict equality (===, !==)
    // https://eslint.org/docs/latest/rules/eqeqeq
    eqeqeq: 'warn',

    // Disable the rule disallowing function declarations inside loops
    // https://eslint.org/docs/latest/rules/no-loop-func
    'no-loop-func': 'warn',

    // Disable the rule disallowing self-assignment
    // https://eslint.org/docs/latest/rules/no-self-assign
    'no-self-assign': 'warn',

    // Disable the rule disallowing escape '\' sequences in strings
    // https://eslint.org/docs/latest/rules/no-useless-escape
    'no-useless-escape': 'off',

    // Disable the rule disallowing comma operator
    // https://eslint.org/docs/latest/rules/no-sequences
    'no-sequences': 'off',

    // Operators should placed at the beginning of lines for easy reading and maintenance
    'operator-linebreak': ['warn', 'before'],

    // One line should not have more than 120 characters for easy reading and maintenance
    'max-len': ['warn', { code: 120 }],

    // One file should not have more than 600 lines of code for easy reading and maintenance
    'max-lines': [
      'warn',
      {
        max: 600,
        skipComments: true,
        skipBlankLines: true,
      },
    ],

    // ---------------------------- Test Specific Rules ----------------------------

    'jest/no-deprecated-functions': 'off',
    'testing-library/prefer-screen-queries': 'off',

    // Disable the rule disallowing no-debugging-utils
    'testing-library/no-debugging-utils': [
      'error',
      {
        utilsToCheckFor: {
          debug: false,
          logRoles: true,
          logDOM: true,
        },
      },
    ],
  },
}
