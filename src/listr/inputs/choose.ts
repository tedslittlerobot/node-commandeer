import {exit} from 'node:process';
import {type Separator, select} from '@inquirer/prompts';
import {ListrInquirerPromptAdapter} from '@listr2/prompt-adapter-inquirer';
import type {ListrTaskWrapper} from 'listr2';
import ls from 'src/log-stream/instance.js';

export type SelectChoice<Value> = {
	value: Value;
	name?: string;
	description?: string;
	disabled?: boolean | string;
	type?: never;
};

export async function choose<Value, Context>(
	task: ListrTaskWrapper<Context, any, any>,
	question: string,
	choices: ReadonlyArray<Separator | SelectChoice<Value>>,
): Promise<Value> {
	try {
		return await task.prompt(ListrInquirerPromptAdapter).run(select<Value>, {
			message: question,
			pageSize: 15,
			loop: true,
			choices,
		});
	} catch {
		ls.fatal('Cancelled');
	}

	exit(1);
}
