import {type Command} from 'commander';
import {type TreeValue} from 'omelette';
import type {CommandRegistrar} from './types.js';
import runActionThroughErrorHandlerMiddleware from './middleware.error.js';

export default function registerCommands(
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
				runActionThroughErrorHandlerMiddleware(command, config);

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
