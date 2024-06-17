#! /usr/bin/env node
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {argv, stderr} from 'node:process';
import chalk from 'chalk';

const file: Record<string, string> = JSON.parse(readFileSync('package.json', 'utf8')) as Record<string, string>;

let entrypoint = file.name;

if (!entrypoint) {
	throw new Error('Cannot get entrypoint from package.json (property: name)');
}

entrypoint = `dist/${entrypoint}.cjs`;

if (!existsSync(entrypoint)) {
	throw new Error('No entrypoint exists at ' + entrypoint);
}

const token = argv[2];
const version = argv[3];

let contents = readFileSync(entrypoint, 'utf8');

stderr.write(chalk.cyan.bold(`\nRe-versioning from ${token} to ${version}\n`));

contents = contents.replace(`"${token}"`, `"${version}"`);

writeFileSync(entrypoint, contents, 'utf8');

stderr.write(chalk.cyan.bold('Re-versioning complete\n\n'));
