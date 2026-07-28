import antfu from '@antfu/eslint-config';

export default antfu(
	{
		type: 'app',
		typescript: true,
		svelte: true,
		// Prettier (with prettier-plugin-svelte) is the single formatter for this
		// project, so antfu's stylistic layer is switched off wholesale rather than
		// fighting it rule by rule. Every correctness and quality rule stays on.
		stylistic: false,
		ignores: [
			'.svelte-kit/**',
			'build/**',
			'dist/**',
			'coverage/**',
			'node_modules/**',
			'static/**'
		]
	},
	{
		rules: {
			'no-console': ['error', { allow: ['warn', 'error'] }]
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts'],
		rules: {
			// Component props are declared with `let { … } = $props()` and are
			// reassigned by the runtime, so `prefer-const` does not apply.
			'prefer-const': 'off'
		}
	}
);
