// SPDX-License-Identifier: Apache-2.0
const js = require('@eslint/js');
const parser = require('@typescript-eslint/parser');

module.exports = [
    {ignores: ['**/lib/**', '**/temp/**', '**/output/**', '**/*.css.ts', '**/*.css.js']},
    {
        files: ['packages/**/*.ts'],
        languageOptions: {parser},
        rules: {
            ...js.configs.recommended.rules,
            // TypeScript checks names and unused declarations in npm test.
            'no-undef': 'off',
            'no-unused-vars': 'off',
        },
    },
];
