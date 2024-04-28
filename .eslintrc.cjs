module.exports = {

    "env": {
        "browser": true,
        "es2021": true
    },

    "parserOptions": {
        "ecmaVersion": "latest"
    },

    "root": true,
    "extends": ["eslint:recommended", "prettier", "airbnb" ],
    "ignorePatterns": ["node_modules/", "**/*.cjs"]
}