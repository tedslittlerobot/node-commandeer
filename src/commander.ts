import {Command} from 'commander';
import {TreeValue} from 'omelette';
import runCompletions from './completions';
import {CommandRegistrar} from './types';

export function registerCommands(
  cli: Command,
  commands: CommandRegistrar[]
): {cli: Command; tree: TreeValue} {
  const tree: TreeValue = {};

  commands.forEach(config => {
    const command = cli.command(config.name);

    if (config.description) {
      command.description(config.description);
    }

    if (config.config) {
      config.config(command);
    }

    switch (config.type) {
      case 'command':
        command.action(config.action)

        tree[config.name] = config.completions();
        break;
      case 'group': {
        const group = registerCommands(command, config.commands);
        tree[config.name] = group.tree;
        break;
      }
    }
  });

  return {cli, tree};
}

export function run(program: Command, commands: CommandRegistrar[]) {
  const {cli, tree} = registerCommands(program, commands);

  if (!runCompletions(tree, process.argv)) {
    cli.parseAsync();
  }
}
