Commandeer
==========

A wrapper around CommanderJS with a few common utilities.

## TSConfig

```json
{
  "extends": "./node_modules/@tedslittlerobot/commandeer/tsconfig.json",
  "compilerOptions": {
    "rootDir": "./src",
    "baseUrl": "./",
    "outDir": "build",
    "paths": {
      "src/*": ["./src/*"]
    },
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

tsup.config.ts

```typescript
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
```
