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

		item.task = async (c, t) => {
			await lanterman.section(
				title,
				async () => {
					t.title = chalk.cyan.bold(title);
					await task(c, t);
					t.title = chalk.green(title);
				},
			);
		};
	}

	return tasks;
}
// Stuff for later
// async () => lanterman.feedback.withFeedback(
// 	async message => {
// 		item.title = `${chalk.cyan.bold(title)} / ${chalk.magenta(message)}`;
// 	},
// ),
