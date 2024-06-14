import {stderr} from 'node:process';
import {
	Listr, ListrLogger, type ListrTask, ProcessOutput,
} from 'listr2';
import {wrapListrTasks} from 'margaret-lanterman/lib/integrations/listr';
import {
	type Renderer, renderers, getDefaultRenderer, type OutputMode,
} from './renderers.js';
import type {TaskList} from './types.js';

export async function runTasks<Context>(
	tasks: TaskList<Context>,
	outputMode: OutputMode = 'normal',
	context?: Context,
	renderer?: Renderer,
) {
	return (new Listr(wrapListrTasks(tasks.filter(Boolean) as Array<ListrTask<Context>>), {
		renderer: renderers[renderer ?? getDefaultRenderer(outputMode)],
		rendererOptions: {
			showErrorMessage: false,
			logger: new ListrLogger({processOutput: new ProcessOutput(stderr, stderr)}),
		},
	}))
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		.run(context ?? {} as Context);
}
