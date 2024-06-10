import {stderr} from 'node:process';
import {type Separator, select} from '@inquirer/prompts';
import lm from 'margaret-lanterman';

export type SelectChoice<Value> = {
	value: Value;
	name?: string;
	description?: string;
	disabled?: boolean | string;
	type?: never;
};

export class NoChoiceError extends Error {
	constructor() {
		super('No selection was made');
	}
}

export async function choose<T>(question: string, choices: ReadonlyArray<Separator | SelectChoice<T>>): Promise<T> {
	await lm.write(question, 'choice');
	await lm.write(choices, 'choice:options');

	try {
		return await select({
			message: question,
			pageSize: 15,
			loop: true,
			choices,
		}, {output: stderr});
	} catch {
		await lm.write('No selection', 'error');
		throw new NoChoiceError();
	}
}
