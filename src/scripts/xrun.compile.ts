#! /usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {argv} from 'node:process';
import {$} from 'execa';

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

await $({stdio: 'inherit'})(entrypoint, argv.slice(2));
