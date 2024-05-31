import {stderr} from 'node:process';
import {input} from '@inquirer/prompts';

export async function ask(
	question: string,
	defaultChoice?: string,
	validate?: (value: string) => boolean | string | Promise<string | boolean>,
) {
	return input({
		message: question,
		validate,
		default: defaultChoice,
	}, {output: stderr});
}
