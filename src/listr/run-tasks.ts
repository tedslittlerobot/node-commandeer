import {stderr} from 'node:process';
import {
	Listr, ListrLogger, type ListrTask, ProcessOutput,
} from 'listr2';
import {wrapListrTasks} from 'margaret-lanterman/lib/integrations/listr';
import {type Renderer, renderers, getDefaultRenderer} from './renderers.js';
import type {TaskList} from './types.js';

export async function runTasks<Context>(
	tasks: TaskList<Context>,
	forOutput = false,
	context?: Context,
	renderer?: Renderer,
) {
	return forOutput ? runTasksForOutput(tasks, context, renderer) : runTasksForDisplay(tasks, context, renderer);
}

export async function runTasksForDisplay<Context>(
	tasks: TaskList<Context>,
	context?: Context,
	renderer?: Renderer,
) {
	return (new Listr(wrapListrTasks(tasks.filter(Boolean) as Array<ListrTask<Context>>), {
		renderer: renderers[renderer ?? getDefaultRenderer(false)],
		rendererOptions: {
			showErrorMessage: false,
			logger: new ListrLogger({processOutput: new ProcessOutput(stderr, stderr)}),
		},
	}))
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		.run(context ?? {} as Context);
}

export async function runTasksForOutput<Context>(
	tasks: TaskList<Context>,
	context?: Context,
	renderer?: Renderer,
) {
	return (new Listr(wrapListrTasks(tasks.filter(Boolean) as Array<ListrTask<Context>>), {
		renderer: renderers[renderer ?? getDefaultRenderer(true)],
		rendererOptions: {
			showErrorMessage: false,
			logger: new ListrLogger({processOutput: new ProcessOutput(stderr, stderr)}),
		},
	}))
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		.run(context ?? {} as Context);
}
