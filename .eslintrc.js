module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': ['warn', {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always",
    }],
    'spaced-comment': 'off',
    'curly': ['warn', 'all'],

    "no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "args": "none",
        "ignoreRestSiblings": true
      }
    ],
    "brace-style": ["warn", "stroustrup"],


    //Revisit this one. Not sure we want to do this
    "ban-ts-comment": "off",

    //Tired of seeing this warning/error, especially since the IDE will clean this up on save by default
    "no-trailing-spaces": "off"
  }
}
