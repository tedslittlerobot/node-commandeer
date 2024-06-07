#! /usr/bin/env node
import {readFileSync} from 'node:fs';
import {argv} from 'node:process';

const file: Record<string, string> = JSON.parse(readFileSync('package.json', 'utf8')) as Record<string, string>;

console.info(file.name);
console.info(argv);
