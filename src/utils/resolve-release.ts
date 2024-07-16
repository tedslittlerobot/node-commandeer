import {type Command} from 'commander';

/**
 * Resolve the release string. The rules are as follows:
 *
 * - If a specific version is provided, use that (mapping stable => latest, canary|unstable|main => preview)
 * - If the current version of the tool is a preview, use the preview release
 * - Otherwise, always get the latest (most likely)
 */
export function resolveRelease(version: string | undefined, command: Command): string {
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
