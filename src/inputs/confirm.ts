import {confirm as coreConfirm} from '@inquirer/prompts';

export class ConfirmationRejected extends Error {
	constructor() {
		super('The confirmation was rejected by the user');
	}
}

export async function confirm(challenge: string, defaultOption: false): Promise<void> {
	const response = await coreConfirm({message: challenge, default: defaultOption});

	if (!response) {
		throw new ConfirmationRejected();
	}
}
