import {input} from '@inquirer/prompts';
import {ListrInquirerPromptAdapter} from '@listr2/prompt-adapter-inquirer';
import type {ListrTaskWrapper} from 'listr2';

export async function ask<Context>(
	task: ListrTaskWrapper<Context, any, any>,
	question: string,
	defaultChoice?: string,
	validate?: (value: string) => boolean | string | Promise<string | boolean>,
) {
	return task.prompt(ListrInquirerPromptAdapter).run(input, {
		message: question,
		validate,
		default: defaultChoice,
	});
}
