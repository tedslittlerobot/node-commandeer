import {stderr} from 'node:process';
import {
	DefaultRenderer, Listr, ListrLogger, type ListrTask, ProcessOutput,
} from 'listr2';

class Renderer extends DefaultRenderer {
	constructor(tasks: any, options: any, events: any) {
		const processOutput = new ProcessOutput(stderr, stderr);
		const logger = new ListrLogger({processOutput});

		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		super(tasks, {...options, logger}, events);
	}
}

export default async function runTasks<Context>(tasks: Array<ListrTask<Context>>, context?: Context) {
	return (new Listr(tasks, {
		renderer: Renderer,
		rendererOptions: {logger: new ListrLogger({processOutput: new ProcessOutput(stderr, stderr)})},
	}))
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		.run(context ?? {} as Context);
}
