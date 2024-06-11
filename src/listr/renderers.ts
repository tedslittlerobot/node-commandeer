import {stderr} from 'node:process';
import {
	DefaultRenderer, ListrLogger, type ListrRenderer, ProcessOutput, SilentRenderer, SimpleRenderer, VerboseRenderer,
} from 'listr2';
import gloucester from 'gloucester';

export class CommandeerRenderer extends DefaultRenderer {
	constructor(tasks: any, options: any, events: any) {
		const processOutput = new ProcessOutput(stderr, stderr);
		const logger = new ListrLogger({processOutput});

		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		super(tasks, {...options, logger}, events);
	}
}

export type Renderer = 'default' | 'verbose' | 'simple' | 'silent';

export const renderers: Record<Renderer, typeof ListrRenderer> = {
	default: CommandeerRenderer,
	verbose: VerboseRenderer,
	simple: SimpleRenderer,
	silent: SilentRenderer,
};

/**
 * @param forOutputs Whether the renderer needs to be able to be used with commands that output to stdout. Most commands just output for a user, in which case the default of false is fine as the fancy renderer uses stdout. In the case of commands which output JSON for piping or chaining, true should be used to force the use of a renderer which uses stderr.
 * @returns
 */
export function getDefaultRenderer(forOutputs = false): Renderer {
	if (gloucester.is.quiet) {
		return 'silent';
	}

	if (!forOutputs) {
		return 'default';
	}

	return gloucester.is.gt('normal') ? 'verbose' : 'simple';
}
