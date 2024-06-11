import chalk, {type ChalkInstance} from 'chalk';
import gloucester, {type Verbosity} from 'gloucester';
import type {ListrTask} from 'listr2';
import lanterman from 'margaret-lanterman';

const verbosityColourMap: Record<Verbosity, ChalkInstance> = {
	quiet: chalk.hidden,
	normal: chalk.cyan,
	verbose: chalk.magenta,
	superVerbose: chalk.yellow,
	ridiculouslyVerbose: chalk.magentaBright.bold,
};

export function wrapTasks<Context>(tasks: Array<ListrTask<Context>>) {
	for (const item of tasks) {
		let {task, title} = item;

		if (Array.isArray(title)) {
			title = title.join(' | ');
		}

		title ||= '';

		item.title = chalk.gray(title);

		item.task = async (c, t) => {
			await lanterman.section(
				title,
				async () => {
					await lanterman.feedback.withFeedback(
						async (message, verbosity) => {
							if (gloucester.is.gte(verbosity)) {
								t.title = `${chalk.cyan.bold(title)} / ${verbosityColourMap[verbosity](message)}`;
							}
						},
						async () => {
							t.title = chalk.cyan.bold(title);
							await task(c, t);
							t.title = chalk.greenBright(title);
						},
					);
				},
			);
		};
	}

	return tasks;
}
