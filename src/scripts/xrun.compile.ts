#! /usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {argv, stderr} from 'node:process';
import {$} from 'execa';
import chalk from 'chalk';

const file: Record<string, string> = JSON.parse(readFileSync('package.json', 'utf8')) as Record<string, string>;

await $({stdio: 'inherit'})`npm run compile`;

let entrypoint = file.name;

if (!entrypoint) {
	throw new Error('Cannot get entrypoint from package.json (property: module)');
}

entrypoint = `dist/${entrypoint}.cjs`;

if (!existsSync(entrypoint)) {
	throw new Error('No entrypoint exists at ' + entrypoint);
}

try {
	await $({stdio: 'inherit'})(entrypoint, argv.slice(2));
} catch (error) {
	let message: string | undefined;

	if (error instanceof Error) {
		message = error.message;
	}

	stderr.write(chalk.red.bold(`\n[ERROR:xrun-compile] ${message}\n\n`));
}
