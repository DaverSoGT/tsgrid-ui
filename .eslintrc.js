module.exports = {
    root: true,
    'env': {
        'browser': true,
        'es2022': true
    },
    // "extends": "eslint:recommended",
    'parserOptions': {
        'ecmaVersion': 2022,
        'sourceType': 'module'
    },
    plugins : [
        'align-assignments',
    ],
    'globals': {
        '$': 'readonly',
        'app': 'readonly',
        'define': 'readonly',
        'exports': 'readonly',
        'jQuery': 'readonly',
        'module': 'readonly',
        'w2ui': 'readonly',
        'w2obj': 'readonly',
        'w2utils': 'readonly',
        'w2popup': 'readonly',
        'w2alert': 'readonly',
        'w2confirm': 'readonly',
        'w2prompt': 'readonly',
        'bela': 'readonly',
        'context': 'readonly',
        'test': 'readonly',
        'chai': 'readonly',
        'EyeDropper': 'readonly'
    },
    'rules': {
        'indent': ['error', 4, {
            'SwitchCase': 1,
            'ignoredNodes': ['ConditionalExpression', 'TemplateLiteral > *'],
            'FunctionDeclaration': {'parameters': 'first'},
            'MemberExpression': 'off',
        }],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'never'],
        'no-var': 'error',
        'no-unused-vars': ['warn', { 'vars': 'local', 'args': 'none' }],
        'no-extra-parens': 'off',
        'dot-notation': 'warn',
        'grouped-accessor-pairs': 'warn',
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-extend-native': 'error',
        'no-multi-spaces': [ 'error', {
            ignoreEOLComments : true,
            exceptions : {
                VariableDeclarator : true,
                AssignmentPattern : true,
                AssignmentExpression : true
            }
        }],
        // 'align-assignments/align-assignments': ['error', { requiresOnly: false } ],
        // 'key-spacing' : [ 'error', {
        //     mode        : 'strict',
        //     beforeColon : false,
        //     afterColon  : true,
        //     align       : 'colon'
        // }],
        'func-call-spacing': 'warn',
        'func-name-matching': 'warn',
        // "func-names": ["warn", "always"],
        'no-inner-declarations': 'off',
        'no-undef': 'error',
        'no-unreachable': 'off',
        'keyword-spacing': ['error', { 'before': true, 'after': true }],
    },
    overrides: [
        {
            // TypeScript source files — use @typescript-eslint parser + recommended ruleset
            // align-assignments is disabled (no TS equivalent); runs during Phase 1 migration
            files: ['**/*.ts'],
            parser: '@typescript-eslint/parser',
            parserOptions: { sourceType: 'module' },
            plugins: ['@typescript-eslint'],
            extends: [
                'plugin:@typescript-eslint/recommended',
                // intentionally NOT 'recommended-requiring-type-checking' — too noisy on day one;
                // re-evaluate in Phase 6
            ],
            rules: {
                'align-assignments/align-assignments': 'off',          // no equivalent in TS world
                '@typescript-eslint/no-explicit-any': 'off',           // re-enabled in Phase 6
                '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
                '@typescript-eslint/ban-ts-comment': ['warn', { 'ts-expect-error': 'allow-with-description' }],
                // Disable JS-only rules that conflict with TS
                'no-undef': 'off',
                'no-unused-vars': 'off',
                'dot-notation': 'off',                                 // bracket access on `any`/dynamic types is intentional; TS itself enforces correctness
            }
        }
    ]
}
