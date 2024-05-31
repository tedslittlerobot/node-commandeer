import {stderr} from 'node:process';
import {DefaultRenderer, ListrLogger, ProcessOutput} from 'listr2';

export class CommandeerRenderer extends DefaultRenderer {
	constructor(tasks: any, options: any, events: any) {
		const processOutput = new ProcessOutput(stderr, stderr);
		const logger = new ListrLogger({processOutput});

		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		super(tasks, {...options, logger}, events);
	}
}
