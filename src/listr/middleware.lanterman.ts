import chalk from 'chalk';
import type {ListrTask} from 'listr2';
import lanterman from 'margaret-lanterman';

export function wrapTasks<Context>(tasks: Array<ListrTask<Context>>) {
	for (const item of tasks) {
		let {task, title} = item;

		if (Array.isArray(title)) {
			title = title.join(' | ');
		}

		title ||= '';

		item.task = async (c, t) =>
			lanterman.section(
				title,
				async () => lanterman.feedback.withFeedback(
					async message => {
						item.title = `${chalk.cyan.bold(title)} / ${chalk.magenta(message)}`;
					},
					async () => {
						item.title = chalk.cyan.bold(title);
						await task(c, t);
						item.title = chalk.green(title);
					},
				),
			);
	}

	return tasks;
}
