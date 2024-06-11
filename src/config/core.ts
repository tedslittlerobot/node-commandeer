import {readFile, writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import lm from 'margaret-lanterman';
import {configPath} from './path.js';
import {MissingConfigFileError} from './errors.js';

export async function storeConfig<T>(name: string, config: T): Promise<T> {
	return lm.section(`storeConfig(${name})`, async () => {
		const path = configPath(name);

		await lm.write(config);

		await writeFile(
			path,
			JSON.stringify(config),
			'utf8',
		);

		await lm.write('Done', 'status');

		return config;
	});
}

export async function getConfigWithDefault<Config>(name: string, defaultValue?: Config): Promise<Config | undefined> {
	try {
		return await getConfig<Config>(name);
	} catch (error) {
		if (error instanceof MissingConfigFileError) {
			return defaultValue;
		}

		throw error;
	}
}

export async function getConfig<Config>(name: string): Promise<Config> {
	return lm.section(`getConfig(${name})`, async () => {
		const path = configPath(name);

		if (!existsSync(path)) {
			throw new MissingConfigFileError(path);
		}

		await lm.write(`Reading config file ${path}`);

		const raw = await readFile(path, 'utf8');

		await lm.write(raw, 'raw');

		return lm.write(JSON.parse(raw) as Config, 'parsed');
	});
}
