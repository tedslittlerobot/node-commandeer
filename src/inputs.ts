import {exit, stderr} from 'node:process';
import {
	type Separator, input, password, select,
} from '@inquirer/prompts';
import {ls} from './logstream.js';

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

export async function askForSecret(
	question: string,
	defaultChoice?: string,
	validate?: (value: string) => boolean | string | Promise<string | boolean>,
) {
	return password({
		message: question,
		mask: '*',
		validate,
	}, {output: stderr});
}

type SelectChoice<Value> = {
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
