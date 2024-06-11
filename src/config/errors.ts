
export class MissingConfigFileError extends Error {
	constructor(public readonly path: string) {
		super(`Config file ${path} not found`);
	}
}
