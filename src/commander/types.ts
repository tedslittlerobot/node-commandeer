import {type Command} from 'commander';
import {type GloucesterEvaluator} from 'gloucester';
import {type Choices, type TreeValue} from 'omelette';

export type CommandRegistrar<Options = any> = RegisteredCommand<Options> | CommandGroup;

export type RegisteredCommand<Options = any> = {
	type: 'command';
	name: string;
	description?: string;
	config?: (command: Command) => void;
	errorHandler?: (error: any, gloucester: GloucesterEvaluator) => void;
	completions: () => TreeValue | Choices;

	action(...parameters: any[]): Promise<void>;
	action(options: Options, command: Command): Promise<void>;
	action<A1>(a: A1, options: Options, command: Command): Promise<void>;
	action<A1, A2>(argument1: A1, argument2: A2, options: Options, command: Command): Promise<void>;
	action<A1, A2, A3>(argument1: A1, argument2: A2, argument3: A3, options: Options, command: Command): Promise<void>;
	action<A1, A2, A3, A4>(argument1: A1, argument2: A2, argument3: A3, argument4: A4, options: Options, command: Command): Promise<void>;
};

export type CommandGroup = {
	type: 'group';
	name: string;
	description?: string;
	config?: (command: Command) => void;
	commands: CommandRegistrar[];
};
