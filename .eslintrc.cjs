module.exports = {

    "env": {
        "browser": true,
        "es2021": true,
        "jest": true
    },

    "parserOptions": {
        "ecmaVersion": "latest"
    },

    "globals":{
        "jest/globals": true
    },

    rules:{
        "no-await-in-loop": "off",
        // "no-param-reassign": "off",
        // "radix": "off",
        // "no-nested-ternary": "off"
    },

    "root": true,
    "extends": ["eslint:recommended", "prettier", "airbnb-base" ],
    "ignorePatterns": ["node_modules/", "**/*.cjs", "dist/"]
}