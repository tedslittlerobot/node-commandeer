import {stderr} from 'node:process';
import {password} from '@inquirer/prompts';

export async function askForSecret(
	question: string,
	validate?: (value: string) => boolean | string | Promise<string | boolean>,
) {
	return password({
		message: question,
		mask: '*',
		validate,
	}, {output: stderr});
}
