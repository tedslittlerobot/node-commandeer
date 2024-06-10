import {type Separator, select} from '@inquirer/prompts';
import {ListrInquirerPromptAdapter} from '@listr2/prompt-adapter-inquirer';
import type {ListrTaskWrapper} from 'listr2';
import lm from 'margaret-lanterman';
import {NoChoiceError} from 'src/inputs/choose.js';

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
	await lm.write(question, 'choice');
	await lm.write(choices, 'choice:options');

	try {
		return await task.prompt(ListrInquirerPromptAdapter).run(select<Value>, {
			message: question,
			pageSize: 15,
			loop: true,
			choices,
		});
	} catch {
		await lm.write('No selection', 'error');
		throw new NoChoiceError();
	}
}
