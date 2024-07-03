import chalk from 'chalk';
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
				.argument('[version]', `The version to update to. Could be a specific version like ${chalk.magenta('1.0.0')}, ${chalk.magenta('latest')} to use the latest stable version, or ${chalk.magenta('preview')} to use the latest preview version on the main branch`);
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
 * Resolve the release string. The rules are as follows:
 *
 * - If a specific version is provided, use that (mapping stable => latest, canary|unstable|main => preview)
 * - If the current version of the tool is a preview, use the preview release
 * - Otherwise, always get the latest (most likely)
 */
function resolveRelease(version: string | undefined, command: Command): string {
	if (version) {
		if (version === 'stable') {
			return 'latest';
		}

		if (['canary', 'unstable', 'main'].includes(version)) {
			return 'preview';
		}

		return version;
	}

	const commandVersion = command.version();

	if (commandVersion?.endsWith('-preview')) {
		return 'preview';
	}

	return 'latest';
}
