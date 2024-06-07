import {stderr} from 'node:process';
import {Command} from 'commander';
import chalk from 'chalk';
import ls from 'src/log-stream/instance.js';
import type {CommandRegistrar} from './types.js';
import run from './run.js';

// eslint-disable-next-line max-params
export function runProgram(name: string, version: string, description: string, commands: CommandRegistrar[], configure?: (program: Command) => void) {
	const program = ls.setupCommander(new Command(name));

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

	run(program, commands);
}
