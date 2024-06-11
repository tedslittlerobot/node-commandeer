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

		item.title = chalk.gray(title);

		item.task = async (c, t) => {
			await lanterman.section(
				title,
				async () => {
					await lanterman.feedback.withFeedback(
						async message => {
							t.title = `${chalk.cyan.bold(title)} / ${chalk.magenta(message)}`;
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
