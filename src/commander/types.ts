import {type Command} from 'commander';
import {type GloucesterEvaluator} from 'gloucester';
import {type Choices, type TreeValue} from 'omelette';

export type CommandRegistrar = RegisteredCommand | CommandGroup;

export type RegisteredCommand = {
	type: 'command';
	name: string;
	description?: string;
	config?: (command: Command) => void;
	errorHandler?: (error: any, gloucester: GloucesterEvaluator) => void;

	completions?: () => TreeValue | Choices;
	action(...parameters: any[]): Promise<void>;
};

export type CommandGroup = {
	type: 'group';
	name: string;
	description?: string;
	config?: (command: Command) => void;
	commands: CommandRegistrar[];
};
