export default {
	env: {
		es2021: true,
		node: true,
	},
	extends: ['eslint:recommended'],
	parserOptions: {
		ecmaVersion: 13,
		sourceType: 'module',
		allowImportExportEverywhere: true,
	},
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': ['error'],
	},
};
