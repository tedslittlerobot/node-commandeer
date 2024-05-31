import {Command} from 'commander';
import ls from 'src/log-stream/instance.js';
import type {CommandRegistrar} from './types.js';
import {run} from './run.js';

export default function runProgram(name: string, version: string, description: string, commands: CommandRegistrar[]) {
	const program = ls.setupCommander(new Command(name));

	program
		.version(version)
		.description(description)
		.showHelpAfterError();

	run(program, commands);
}
