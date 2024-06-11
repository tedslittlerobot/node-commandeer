import {existsSync, mkdirSync} from 'node:fs';
import {env} from 'node:process';

let configDirectory: string | undefined;

export function setConfigDirectory(directory: string) {
	configDirectory = directory;
}

export function configPath(name: string) {
	if (!configDirectory) {
		throw new Error('Config directory is not set');
	}

	const directory = `${env.HOME}/.config/${configDirectory}`;

	if (!existsSync(directory)) {
		mkdirSync(directory, {recursive: true});
	}

	return `${directory}/${name}.json`;
}
