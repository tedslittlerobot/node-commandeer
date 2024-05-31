import {defineConfig} from 'tsup';

export default defineConfig({
	entry: {
		umvmatrix: 'src/index.ts',
	},
	format: 'cjs',
	target: 'esnext',
	sourcemap: true,
	clean: true,
	noExternal: [/(.*)/],
});
