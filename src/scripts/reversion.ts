#! /usr/bin/env node
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {argv, env, stderr} from 'node:process';
import chalk from 'chalk';

const file: Record<string, string> = JSON.parse(readFileSync('package.json', 'utf8')) as Record<string, string>;

const token = argv[2];
const version = argv[3] ?? env.REVERSION ?? 'unversioned';

let entrypoint = file.name;

if (!entrypoint) {
	throw new Error('Cannot get entrypoint from package.json (property: name)');
}

entrypoint = `dist/${entrypoint}.cjs`;

if (!existsSync(entrypoint)) {
	throw new Error('No entrypoint exists at ' + entrypoint);
}

stderr.write(chalk.cyan.bold(`\nRe-versioning ${entrypoint} from ${token} to ${version}\n`));

let contents = readFileSync(entrypoint, 'utf8');

if (!contents.includes(`"${token}"`)) {
	throw new Error('Nothing to reversion');
}

contents = contents.replace(`"${token}"`, `"${version}"`);

writeFileSync(entrypoint, contents, 'utf8');

stderr.write(chalk.cyan.bold('Re-versioning complete\n\n'));
