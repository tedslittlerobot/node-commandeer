import {exit, stderr} from 'node:process';
import {type Separator, select} from '@inquirer/prompts';
import ls from 'src/log-stream/instance.js';

export type SelectChoice<Value> = {
	value: Value;
	name?: string;
	description?: string;
	disabled?: boolean | string;
	type?: never;
};

export async function choose<T>(question: string, choices: ReadonlyArray<Separator | SelectChoice<T>>): Promise<T> {
	try {
		return await select({
			message: question,
			pageSize: 15,
			loop: true,
			choices,
		}, {output: stderr});
	} catch {
		ls.fatal('Cancelled');
	}

	exit(1);
}
