import {type Command} from 'commander';
import {type ListrTask} from 'listr2';
import {type Choices, type TreeValue} from 'omelette';

export type CommandRegistrar = RegisteredCommand | CommandGroup;

export type RegisteredCommand = {
	type: 'command';
	name: string;
	description?: string;
	config?: (command: Command) => void;

	action: (...arguments_: any[]) => Promise<void>;
	completions: () => TreeValue | Choices;
};

export type CommandGroup = {
	type: 'group';
	name: string;
	description?: string;
	config?: (command: Command) => void;
	commands: CommandRegistrar[];
};

export type TaskList<Context> = Array<ListrTask<Context> | undefined>;
export type AsyncTaskList<Context> = Promise<TaskList<Context>>;
