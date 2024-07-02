import {type Command} from 'commander';
import gloucester from 'gloucester';
import {runTasks} from 'src/listr/run-tasks.js';
import {type CommandRegistrar} from 'src/commander/types.js';
import tasks from './self-update.tasks.js';

type Options = Record<string, unknown>;

export default function selfUpdateCommandFactory(baseUrl: string, credentials: Record<string, string>): CommandRegistrar {
	return {
		type: 'command',
		name: 'self:update',
		description: 'Update this CLI Tool',
		config(command) {
			command
				.argument('[version]', 'The version to update to');
		},
		async action(
			version: string | undefined,
			options: Options,
			command: Command,
		) {
			await runTasks(
				tasks({
					name: command.parent!.name(),
					tarball: `/tmp/${command.parent!.name()}.tgz`,
					release: resolveRelease(version, command.parent!),
					baseUrl,
					credentials,
				}),
				gloucester.is.gte('verbose') ? 'passive' : 'normal',
			);
		},
		completions() {
			return [];
		},
	};
}

/**
 * Resolve the release string
 */
function resolveRelease(version: string | undefined, command: Command): string {
	if (version) {
		return version;
	}

	const commandVersion = command.version();

	if (commandVersion?.endsWith('-preview')) {
		return 'preview';
	}

	return 'latest';
}
