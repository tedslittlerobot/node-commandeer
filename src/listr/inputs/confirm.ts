import {confirm as coreConfirm} from '@inquirer/prompts';
import {ListrInquirerPromptAdapter} from '@listr2/prompt-adapter-inquirer';
import type {ListrTaskWrapper} from 'listr2';
import {ConfirmationRejected} from 'src/inputs/confirm.js';

export {ConfirmationRejected} from 'src/inputs/confirm.js';

export async function confirm<Context>(
	task: ListrTaskWrapper<Context, any, any>,
	challenge: string,
	defaultOption = false,
) {
	const response = await task.prompt(ListrInquirerPromptAdapter).run(coreConfirm, {message: challenge, default: defaultOption});

	if (!response) {
		throw new ConfirmationRejected();
	}
}
