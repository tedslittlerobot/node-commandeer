import {Command} from 'commander';
import {Choices, TreeValue} from 'omelette';

export type CommandRegistrar = RegisteredCommand | CommandGroup;

export interface RegisteredCommand {
  type: 'command';
  name: string;
  description?: string;
  config?: (command: Command) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (...args: any[]) => Promise<void>;
  completions: () => TreeValue | Choices;
}

export interface CommandGroup {
  type: 'group';
  name: string;
  description?: string;
  config?: (command: Command) => void;
  commands: CommandRegistrar[];
}
