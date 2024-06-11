import {env} from 'node:process';

let configDirectory: string | undefined;

export function setConfigDirectory(directory: string) {
	configDirectory = directory;
}

export function configPath(name: string) {
	if (!configDirectory) {
		throw new Error('Config directory is not set');
	}

	return `${env.HOME}/.config/${configDirectory}/${name}.json`;
}
