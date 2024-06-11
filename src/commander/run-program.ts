import {stderr} from 'node:process';
import {Command} from 'commander';
import chalk from 'chalk';
import lm from 'margaret-lanterman';
import setupLanterman from 'margaret-lanterman/lib/integrations/commander';
import gl from 'gloucester';
import setupGloucester from 'gloucester/lib/integrations/commander';
import {setConfigDirectory} from 'src/config/path.js';
import type {CommandRegistrar} from './types.js';
import run from './run.js';

// eslint-disable-next-line max-params
export async function runProgram(name: string, version: string, description: string, commands: CommandRegistrar[], configure?: (program: Command) => void) {
	const program = new Command(name);

	setConfigDirectory(name);
	await setupLanterman(program, lm);
	setupGloucester(program, gl);

	program
		.version(version)
		.description(description)
		.configureOutput({
			writeErr: message => stderr.write(chalk.yellow(message)),
			outputError(message, write) {
				write(`\n${chalk.red.bold(message)}`);
			},
		})
		.showHelpAfterError();

	if (configure) {
		configure(program);
	}

	await run(program, commands);
}
