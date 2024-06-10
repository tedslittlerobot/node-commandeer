import {stderr} from 'node:process';
import {
	Listr, ListrLogger, type ListrTask, ProcessOutput,
} from 'listr2';
import { Renderer, renderers } from './renderer.class.js';

export default async function runTasks<Context>(
	tasks: Array<ListrTask<Context>>,
	context?: Context,
	renderer: Renderer = 'default',
) {
	return (new Listr(tasks, {
		renderer: renderers[renderer],
		rendererOptions: {
			showErrorMessage: false,
			logger: new ListrLogger({processOutput: new ProcessOutput(stderr, stderr)}),
		},
	}))
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		.run(context ?? {} as Context);
}
