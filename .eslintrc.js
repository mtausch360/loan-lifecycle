module.exports = {
  "extends": "eslint:recommended",
  "globals": {
    "Big": true,
    "_": true
  },
  "rules": {
    "no-redeclare": 0
  },
  "env": {
    "browser": true,
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
  }
}
