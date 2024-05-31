import {argv} from 'node:process';
import {type Command} from 'commander';
import {type TreeValue} from 'omelette';
import runCompletions from './completions.js';
import {type CommandRegistrar} from './types.js';

export function registerCommands(
	cli: Command,
	commands: CommandRegistrar[],
): {cli: Command; tree: TreeValue} {
	const tree: TreeValue = {};

	for (const config of commands) {
		const command = cli.command(config.name);

		if (config.description) {
			command.description(config.description);
		}

		if (config.config) {
			config.config(command);
		}

		switch (config.type) {
			case 'command': {
				command.action(config.action);

				tree[config.name] = config.completions();
				break;
			}

			case 'group': {
				const group = registerCommands(command, config.commands);
				tree[config.name] = group.tree;
				break;
			}
		}
	}

	return {cli, tree};
}

export default function run(program: Command, commands: CommandRegistrar[]) {
	const {cli, tree} = registerCommands(program, commands);

	if (!runCompletions(tree, argv)) {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		cli.parseAsync();
	}
}
