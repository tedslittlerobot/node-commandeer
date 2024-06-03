import {password} from '@inquirer/prompts';
import {ListrInquirerPromptAdapter} from '@listr2/prompt-adapter-inquirer';
import type {ListrTaskWrapper} from 'listr2';

export async function askForSecret<Context>(
	task: ListrTaskWrapper<Context, any, any>,
	question: string,
	validate?: (value: string) => boolean | string | Promise<string | boolean>,
) {
	return task.prompt(ListrInquirerPromptAdapter).run(password, {
		message: question,
		mask: '*',
		validate,
	});
}
