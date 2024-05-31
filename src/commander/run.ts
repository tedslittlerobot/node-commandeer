import {argv} from 'node:process';
import {type Command} from 'commander';
import runCompletions from 'src/completions/completions.js';
import {type CommandRegistrar} from './types.js';
import registerCommands from './register.js';

export default function run(program: Command, commands: CommandRegistrar[]) {
	const {cli, tree} = registerCommands(program, commands);

	if (!runCompletions(tree, argv)) {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		cli.parseAsync();
	}
}
