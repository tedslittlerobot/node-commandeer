import {exit, stderr} from 'node:process';
import chalk from 'chalk';
import type {Command} from 'commander';
import type {RegisteredCommand} from './types.js';

export default function handleErrors(command: Command, config: RegisteredCommand) {
	command.action(async (...parameters: any[]) => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			await config.action(...parameters);
		} catch (error) {
			if (error instanceof Error) {
				stderr.write(`\n${chalk.red.bold(`[${error.constructor.name}]`)} ${chalk.red(error.message)}\n`);
				exit(1);
			}
		}
	});
}
